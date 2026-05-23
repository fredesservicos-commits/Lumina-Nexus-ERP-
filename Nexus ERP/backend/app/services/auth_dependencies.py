from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jwt import PyJWKClient, decode as jwt_decode

from app.models.database import get_db
from app.models.user import User
from app.core.security import decode_access_token
from app.core.config import settings

bearer_scheme = HTTPBearer(auto_error=False)

_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        url = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
        _jwks_client = PyJWKClient(url, cache_keys=True)
    return _jwks_client


def verify_firebase_token(token: str) -> dict | None:
    try:
        client = _get_jwks_client()
        key = client.get_signing_key_from_jwt(token)
        payload = jwt_decode(
            token,
            key.key,
            algorithms=["RS256"],
            audience=settings.FIREBASE_PROJECT_ID,
            issuer=f"https://securetoken.google.com/{settings.FIREBASE_PROJECT_ID}",
        )
        return payload
    except Exception:
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

    payload = decode_access_token(raw)
    if payload is not None:
        user = db.query(User).filter(User.id == payload["sub"]).first()
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário não encontrado ou inativo",
            )
        return user

    fb_payload = verify_firebase_token(raw)
    if fb_payload is not None:
        uid = fb_payload.get("sub", "")
        email = fb_payload.get("email", "")
        user = db.query(User).filter(
            (User.firebase_local_id == uid) | (User.email == email)
        ).first()
        if user is None:
            user = User(
                email=email,
                firebase_local_id=uid,
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
        if not user.firebase_local_id:
            user.firebase_local_id = uid
            db.commit()
        return user

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
