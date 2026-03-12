from rest_framework import generics, permissions

from .models import Organization
from .serializers import OrganizationSerializer


class OrganizationListCreateView(generics.ListCreateAPIView):
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.organizations.all() | Organization.objects.filter(
            owner=self.request.user
        )

    def perform_create(self, serializer):
        organization = serializer.save(owner=self.request.user)
        organization.members.add(self.request.user)
