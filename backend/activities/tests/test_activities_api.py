import pytest
from rest_framework.test import APIClient

from activities.models import Activity
from organizations.models import Organization
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_create_activity():
    user = User.objects.create_user(
        email="teacher@test.com",
        password="password123",
    )
    organization = Organization.objects.create(
        name="École Maternelle A",
        owner=user,
    )
    organization.members.add(user)

    client = APIClient()

    login_response = client.post(
        "/api/auth/login",
        {"email": "teacher@test.com", "password": "password123"},
        format="json",
    )
    token = login_response.data["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.post(
        "/api/activities",
        {
            "organization": organization.id,
            "title": "Découverte des animaux",
            "level": "PS",
            "domain": "LANGAGE",
            "duration_minutes": 20,
            "materials": "Images d'animaux",
            "description": "Nommer les animaux et leurs cris.",
        },
        format="json",
    )

    assert response.status_code == 201
    assert Activity.objects.filter(title="Découverte des animaux").exists()


@pytest.mark.django_db
def test_list_activities_only_for_user_organizations():
    user = User.objects.create_user(
        email="teacher@test.com",
        password="password123",
    )
    other_user = User.objects.create_user(
        email="other@test.com",
        password="password123",
    )

    org1 = Organization.objects.create(name="École A", owner=user)
    org1.members.add(user)

    org2 = Organization.objects.create(name="École B", owner=other_user)
    org2.members.add(other_user)

    Activity.objects.create(
        organization=org1,
        title="Puzzle animaux",
        level="MS",
        domain="MATHS",
        duration_minutes=15,
        materials="Puzzle",
        description="Assembler les pièces.",
        created_by=user,
    )

    Activity.objects.create(
        organization=org2,
        title="Peinture printemps",
        level="GS",
        domain="ART",
        duration_minutes=30,
        materials="Peinture",
        description="Peindre des fleurs.",
        created_by=other_user,
    )

    client = APIClient()

    login_response = client.post(
        "/api/auth/login",
        {"email": "teacher@test.com", "password": "password123"},
        format="json",
    )
    token = login_response.data["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get("/api/activities")

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["title"] == "Puzzle animaux"