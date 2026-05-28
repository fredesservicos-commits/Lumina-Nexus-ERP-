from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jwt import PyJWKClient, decode as jwt_decode
import logging
import base64
import json

from app.models.database import get_db
from app.models.user import User
from app.core.security import decode_access_token
from app.core.config import settings

logger = logging.getLogger("auth_dependencies")

bearer_scheme = HTTPBearer(auto_error=False)

_jwks_client: PyJWKClient | None = None
_supabase_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        url = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
        _jwks_client = PyJWKClient(url, cache_keys=True)
    return _jwks_client


def _get_supabase_jwks_client() -> PyJWKClient:
    global _supabase_jwks_client
    if _supabase_jwks_client is None:
        if not settings.SUPABASE_URL:
            raise RuntimeError("SUPABASE_URL is required to validate Supabase tokens")
        url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/certs"
        _supabase_jwks_client = PyJWKClient(url, cache_keys=True)
    return _supabase_jwks_client


def verify_firebase_token(token: str) -> dict | None:
    try:
        # Attempt to inspect token header (safe: only header, not verifying signature)
        try:
            header_b64 = token.split(".")[0]
            # pad base64
            padded = header_b64 + "=" * (-len(header_b64) % 4)
            header_json = base64.urlsafe_b64decode(padded)
            header = json.loads(header_json.decode("utf-8", errors="ignore"))
            kid = header.get("kid")
            logger.debug("Token header inspected", extra={"kid": kid})
        except Exception:
            logger.debug("Could not parse token header", exc_info=True)

        client = _get_jwks_client()
        key = client.get_signing_key_from_jwt(token)
        payload = jwt_decode(
            token,
            key.key,
            algorithms=["RS256"],
            audience=settings.FIREBASE_PROJECT_ID,
            issuer=f"https://securetoken.google.com/{settings.FIREBASE_PROJECT_ID}",
        )
        logger.debug(
            "Firebase token verified successfully",
            extra={"sub": payload.get("sub"), "aud": payload.get("aud"), "iss": payload.get("iss")},
        )
        return payload
    except Exception:
        logger.debug("Firebase token verification failed", exc_info=True)
        # Try to decode without verification to expose aud/iss when possible
        try:
            unverified = jwt_decode(token, options={"verify_signature": False})
            logger.debug("Unverified firebase payload", extra={"aud": unverified.get("aud"), "iss": unverified.get("iss")})
        except Exception:
            logger.debug("Unverified decode failed", exc_info=True)
        return None


def verify_supabase_token(token: str) -> dict | None:
    if not settings.SUPABASE_URL:
        return None
    try:
        try:
            header_b64 = token.split(".")[0]
            padded = header_b64 + "=" * (-len(header_b64) % 4)
            header_json = base64.urlsafe_b64decode(padded)
            header = json.loads(header_json.decode("utf-8", errors="ignore"))
            kid = header.get("kid")
            logger.debug("Supabase token header inspected", extra={"kid": kid})
        except Exception:
            logger.debug("Could not parse Supabase token header", exc_info=True)

        client = _get_supabase_jwks_client()
        key = client.get_signing_key_from_jwt(token)
        issuer = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1"
        payload = jwt_decode(
            token,
            key.key,
            algorithms=["RS256"],
            audience=settings.SUPABASE_AUDIENCE,
            issuer=issuer,
        )
        logger.debug(
            "Supabase token verified successfully",
            extra={"sub": payload.get("sub"), "aud": payload.get("aud"), "iss": payload.get("iss")},
        )
        return payload
    except Exception:
        logger.debug("Supabase token verification failed", exc_info=True)
        try:
            unverified = jwt_decode(token, options={"verify_signature": False})
            logger.debug("Unverified supabase payload", extra={"aud": unverified.get("aud"), "iss": unverified.get("iss")})
        except Exception:
            logger.debug("Unverified decode failed", exc_info=True)
        return None


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação não fornecido",
        )
    raw = credentials.credentials
    logger.info("Received auth token", extra={"length": len(raw) if raw else 0})

    payload = decode_access_token(raw)
    if payload is not None:
        logger.info("Local JWT validated", extra={"sub": payload.get("sub")})
        user = db.query(User).filter(User.id == payload["sub"]).first()
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado ou inativo",
            )
        return user
    fb_payload = verify_firebase_token(raw)
    if fb_payload is not None:
        logger.info("Firebase token validated", extra={"sub": fb_payload.get("sub")})
        uid = fb_payload.get("sub", "")
        email = fb_payload.get("email", "")
        user = db.query(User).filter(
            (User.supabase_uid == uid) | (User.email == email)
        ).first()
        if user is None:
            user = User(
                email=email,
                supabase_uid=uid,
                hashed_password="",
                display_name=email.split("@")[0],
                role="operador",
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário inativo",
            )
        if not user.supabase_uid:
            user.supabase_uid = uid
            db.commit()
        return user

    supabase_payload = verify_supabase_token(raw)
    if supabase_payload is not None:
        logger.info("Supabase token validated", extra={"sub": supabase_payload.get("sub")})
        uid = supabase_payload.get("sub", "")
        email = supabase_payload.get("email", "")
        user = db.query(User).filter(
            (User.supabase_uid == uid) | (User.email == email)
        ).first()
        if user is None:
            user = User(
                email=email,
                supabase_uid=uid,
                hashed_password="",
                display_name=email.split("@")[0],
                role="operador",
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário inativo",
            )
        if not user.supabase_uid:
            user.supabase_uid = uid
            db.commit()
        return user

    logger.info("Token inválido ou expirado: não é JWT local nem Firebase JWT")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado",
    )


def require_role(*roles: str):
    def _validator(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acesso restrito aos perfis: {', '.join(roles)}",
            )
        return current_user
    return _validator


def require_active(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário inativo",
        )
    return current_user
