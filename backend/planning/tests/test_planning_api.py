import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from activities.models import Activity
from organizations.models import Organization
from planning.models import WeeklyPlan, WeeklyPlanItem

User = get_user_model()


@pytest.mark.django_db
def test_create_weekly_plan():
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
        "/api/weekly-plans",
        {
            "organization": organization.id,
            "week_start": "2026-03-16",
        },
        format="json",
    )

    assert response.status_code == 201
    assert WeeklyPlan.objects.filter(organization=organization).exists()


@pytest.mark.django_db
def test_add_item_to_weekly_plan():
    user = User.objects.create_user(
        email="teacher@test.com",
        password="password123",
    )
    organization = Organization.objects.create(
        name="École Maternelle A",
        owner=user,
    )
    organization.members.add(user)

    activity = Activity.objects.create(
        organization=organization,
        title="Découvrons les animaux",
        level="PS",
        domain="LANGAGE",
        duration_minutes=20,
        materials="Cartes d'animaux",
        description="Nommer et décrire les animaux.",
        created_by=user,
    )

    weekly_plan = WeeklyPlan.objects.create(
        organization=organization,
        week_start="2026-03-16",
        created_by=user,
    )

    client = APIClient()

    login_response = client.post(
        "/api/auth/login",
        {"email": "teacher@test.com", "password": "password123"},
        format="json",
    )
    token = login_response.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.post(
        "/api/weekly-plan-items",
        {
            "weekly_plan": weekly_plan.id,
            "activity": activity.id,
            "day": "MON",
            "position": 1,
        },
        format="json",
    )

    assert response.status_code == 201
    assert WeeklyPlanItem.objects.filter(weekly_plan=weekly_plan, activity=activity).exists()


@pytest.mark.django_db
def test_list_weekly_plans_with_items():
    user = User.objects.create_user(
        email="teacher@test.com",
        password="password123",
    )
    organization = Organization.objects.create(
        name="École Maternelle A",
        owner=user,
    )
    organization.members.add(user)

    activity = Activity.objects.create(
        organization=organization,
        title="Puzzle animaux",
        level="MS",
        domain="MATHS",
        duration_minutes=15,
        materials="Puzzle",
        description="Assembler les pièces.",
        created_by=user,
    )

    weekly_plan = WeeklyPlan.objects.create(
        organization=organization,
        week_start="2026-03-16",
        created_by=user,
    )

    WeeklyPlanItem.objects.create(
        weekly_plan=weekly_plan,
        activity=activity,
        day="MON",
        position=1,
    )

    client = APIClient()

    login_response = client.post(
        "/api/auth/login",
        {"email": "teacher@test.com", "password": "password123"},
        format="json",
    )
    token = login_response.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    response = client.get("/api/weekly-plans")

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["items"][0]["activity_title"] == "Puzzle animaux"