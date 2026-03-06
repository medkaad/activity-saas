import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
def test_register():
    client = APIClient()

    response = client.post(
        "/api/auth/register",
        {"email": "test@test.com", "password": "password123"},
        format="json",
    )

    assert response.status_code == 201
    assert User.objects.filter(email="test@test.com").exists()


@pytest.mark.django_db
def test_login():
    user = User.objects.create_user(email="login@test.com", password="password123")

    client = APIClient()

    response = client.post(
        "/api/auth/login",
        {"email": "login@test.com", "password": "password123"},
        format="json",
    )

    assert response.status_code == 200
    assert "access" in response.data


@pytest.mark.django_db
def test_me():
    user = User.objects.create_user(email="me@test.com", password="password123")

    client = APIClient()

    login = client.post(
        "/api/auth/login",
        {"email": "me@test.com", "password": "password123"},
        format="json",
    )

    token = login.data["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get("/api/me")

    assert response.status_code == 200
    assert response.data["email"] == "me@test.com"