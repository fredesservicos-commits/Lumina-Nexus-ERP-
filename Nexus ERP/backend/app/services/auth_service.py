import httpx

FIREBASE_API_KEY = "AIzaSyDy-mIIe3ITRJ6OO--S4T3XFQN2_AKbQd0"
AUTH_BASE = "https://identitytoolkit.googleapis.com/v1"


def sign_up(email: str, password: str) -> dict:
    with httpx.Client(timeout=15) as client:
        resp = client.post(
            f"{AUTH_BASE}/accounts:signUp?key={FIREBASE_API_KEY}",
            json={"email": email, "password": password, "returnSecureToken": True},
        )
        data = resp.json()
        if resp.status_code != 200:
            raise ValueError(data.get("error", {}).get("message", "Erro ao cadastrar"))
        return {
            "email": data["email"],
            "localId": data["localId"],
            "idToken": data["idToken"],
            "refreshToken": data["refreshToken"],
        }


def sign_in(email: str, password: str) -> dict:
    with httpx.Client(timeout=15) as client:
        resp = client.post(
            f"{AUTH_BASE}/accounts:signInWithPassword?key={FIREBASE_API_KEY}",
            json={"email": email, "password": password, "returnSecureToken": True},
        )
        data = resp.json()
        if resp.status_code != 200:
            raise ValueError(data.get("error", {}).get("message", "Erro ao fazer login"))
        return {
            "email": data["email"],
            "localId": data["localId"],
            "idToken": data["idToken"],
            "refreshToken": data["refreshToken"],
        }