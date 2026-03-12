from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from activities.models import Activity
from organizations.models import Organization

from .services import generate_activity


class GenerateActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        level = request.data.get("level")
        domain = request.data.get("domain")
        theme = request.data.get("theme")
        organization_id = request.data.get("organization")

        if not level or not domain or not theme or not organization_id:
            return Response(
                {"error": "organization, level, domain and theme are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            organization_id = int(organization_id)
        except (TypeError, ValueError):
            return Response(
                {"error": "organization must be a valid integer id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        organization = Organization.objects.filter(
            id=organization_id,
            members=request.user,
        ).first()

        if not organization:
            return Response(
                {"error": "organization not found or not accessible"},
                status=status.HTTP_404_NOT_FOUND,
            )

        generated = generate_activity(level, domain, theme)

        activity = Activity.objects.create(
            organization=organization,
            title=generated["title"],
            level=level,
            domain=domain,
            duration_minutes=generated["duration_minutes"],
            materials=generated["materials"],
            description=generated["description"],
            created_by=request.user,
        )

        return Response(
            {
                "id": activity.id,
                "organization": activity.organization.id,
                "title": activity.title,
                "level": activity.level,
                "domain": activity.domain,
                "duration_minutes": activity.duration_minutes,
                "materials": activity.materials,
                "description": activity.description,
                "created_by": activity.created_by.id,
                "created_at": activity.created_at,
            },
            status=status.HTTP_201_CREATED,
        )