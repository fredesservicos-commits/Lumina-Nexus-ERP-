from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.models.database import Base, get_db
from app.models.user import User
from app.core.security import create_access_token, hash_password

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

_test_user_id = None


def setup_module():
    global _test_user_id
    db = TestingSessionLocal()
    user = User(
        email="teste@nexus.com",
        hashed_password=hash_password("123456"),
        display_name="Teste",
        role="admin",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    _test_user_id = user.id
    db.close()


def teardown_module():
    engine.dispose()
    Base.metadata.drop_all(bind=engine)
    import os, gc
    gc.collect()
    try:
        os.remove("test.db")
    except (FileNotFoundError, PermissionError):
        pass


def test_health():
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "Nexus ERP Online"


def test_auth_no_token():
    resp = client.get("/dashboard/summary")
    assert resp.status_code == 401


def test_auth_with_token():
    token = create_access_token(_test_user_id, "admin")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/dashboard/summary", headers=headers)
    assert resp.status_code == 200


def test_list_accounts_unauthorized():
    resp = client.get("/finance/accounts")
    assert resp.status_code == 401


def test_list_accounts_authorized():
    token = create_access_token(_test_user_id, "admin")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/finance/accounts", headers=headers)
    assert resp.status_code == 200


def test_sales_with_auth():
    token = create_access_token(_test_user_id, "admin")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/sales/list", headers=headers)
    assert resp.status_code == 200


def test_purchases_with_auth():
    token = create_access_token(_test_user_id, "admin")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/purchases/list", headers=headers)
    assert resp.status_code == 200


def test_rbac_operador_blocked():
    user_id_operador = None
    db = TestingSessionLocal()
    user = User(
        email="operador@nexus.com",
        hashed_password=hash_password("123456"),
        display_name="Operador",
        role="operador",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    user_id_operador = user.id
    db.close()

    token = create_access_token(user_id_operador, "operador")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.post("/employees/new", headers=headers, json={
        "partner_id": "test",
        "department": "TI",
        "hire_date": "2024-01-01",
        "base_salary": 5000,
    })
    assert resp.status_code == 403
