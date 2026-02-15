from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

resp = client.post('/chat', json={'message':'hello from debug'})
print('status', resp.status_code)
try:
    print('json:', resp.json())
except Exception as e:
    print('could not parse json:', e)

print('\n--- Response text ---')
print(resp.text)
