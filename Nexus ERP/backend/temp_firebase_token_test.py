import logging
from fastapi.testclient import TestClient
from app.main import app

logging.basicConfig(level=logging.DEBUG, format='%(levelname)s:%(name)s:%(message)s')
client = TestClient(app)

def pretty(resp):
    try:
        return resp.status_code, resp.json()
    except Exception:
        return resp.status_code, resp.text

print('Testing /dashboard/summary with fake Firebase token')
headers = {'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkZBS0VfR0tJTSJ9.invalid.payload'}
resp = client.get('/dashboard/summary', headers=headers)
print('response:', pretty(resp))
