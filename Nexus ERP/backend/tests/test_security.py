from app.core.security import hash_password, verify_password, create_access_token, decode_access_token


def test_hash_and_verify():
    hashed = hash_password("minha_senha_secreta")
    assert verify_password("minha_senha_secreta", hashed)
    assert not verify_password("senha_errada", hashed)


def test_create_and_decode_token():
    token = create_access_token("user123", "admin")
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "user123"
    assert payload["role"] == "admin"


def test_expired_token():
    import jwt
    from datetime import datetime, timedelta, UTC
    token = jwt.encode(
        {
            "sub": "user123",
            "exp": datetime.now(UTC) - timedelta(hours=1),
            "iat": datetime.now(UTC) - timedelta(hours=2),
        },
        "fake-secret",
        algorithm="HS256",
    )
    from app.core.config import settings
    decoded = decode_access_token(token)
    assert decoded is None


def test_invalid_token():
    decoded = decode_access_token("token-invalido")
    assert decoded is None
