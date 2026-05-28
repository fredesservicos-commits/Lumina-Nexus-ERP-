from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def pretty(resp):
    try:
        return resp.status_code, resp.json()
    except Exception:
        return resp.status_code, resp.text

print('Running local dashboard summary test')

# Try to register a test user (may fail if already exists)
resp = client.post('/auth/register', json={
    'email': 'localtest@nexus.com',
    'password': '123456',
    'display_name': 'Local Test'
})
print('register:', pretty(resp))

# Login (should return idToken)
resp = client.post('/auth/login', json={
    'email': 'localtest@nexus.com',
    'password': '123456'
})
print('login:', pretty(resp))

token = None
if resp.status_code == 200:
    token = resp.json().get('idToken')

headers = {'Authorization': f'Bearer {token}'} if token else {}
resp = client.get('/dashboard/summary', headers=headers)
print('summary:', pretty(resp))
