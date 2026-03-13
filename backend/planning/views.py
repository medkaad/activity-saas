from rest_framework import generics, permissions

from organizations.models import Organization

from .models import WeeklyPlan
from .serializers import WeeklyPlanItemSerializer, WeeklyPlanSerializer


class WeeklyPlanListCreateView(generics.ListCreateAPIView):
    serializer_class = WeeklyPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WeeklyPlan.objects.filter(
            organization__members=self.request.user
        ).select_related("organization", "created_by")

    def perform_create(self, serializer):
        organization_id = self.request.data.get("organization")

        organization = Organization.objects.get(id=organization_id)

        serializer.save(
            created_by=self.request.user,
            organization=organization,
        )


class WeeklyPlanItemCreateView(generics.CreateAPIView):
    serializer_class = WeeklyPlanItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()