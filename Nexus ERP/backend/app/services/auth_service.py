from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User


def sign_up(db: Session, email: str, password: str, display_name: str | None = None) -> dict:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise ValueError("EMAIL_EXISTS: Este email já está cadastrado")

    user = User(
        email=email,
        hashed_password=hash_password(password),
        display_name=display_name or email.split("@")[0],
        role="operador",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.role)
    return {
        "email": user.email,
        "localId": user.id,
        "idToken": token,
        "refreshToken": "",
        "displayName": user.display_name,
        "role": user.role,
    }


def sign_in(db: Session, email: str, password: str) -> dict:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise ValueError("EMAIL_NOT_FOUND: Usuário não encontrado")
    if not verify_password(password, user.hashed_password):
        raise ValueError("INVALID_PASSWORD: Senha incorreta")
    if not user.is_active:
        raise ValueError("USER_DISABLED: Usuário inativo")

    token = create_access_token(user.id, user.role)
    return {
        "email": user.email,
        "localId": user.id,
        "idToken": token,
        "refreshToken": "",
        "displayName": user.display_name,
        "role": user.role,
    }
