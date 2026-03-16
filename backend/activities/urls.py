from django.urls import path

from .views import ActivityPDFView, ActivityRetrieveView, ActivityListCreateView

urlpatterns = [
    path("activities", ActivityListCreateView.as_view(), name="activity-list-create"),
    path("activities/<int:pk>", ActivityRetrieveView.as_view(), name="activity-detail"),
    path("activities/<int:pk>/pdf", ActivityPDFView.as_view(), name="activity-pdf"),
]