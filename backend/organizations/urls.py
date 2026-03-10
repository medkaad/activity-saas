from django.urls import path

from .views import OrganizationListCreateView

urlpatterns = [
    path("orgs", OrganizationListCreateView.as_view(), name="organization-list-create"),
]