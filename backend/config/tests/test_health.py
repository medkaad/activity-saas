import json


def test_health_endpoint(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = json.loads(resp.content.decode())
    assert data["status"] == "ok"
