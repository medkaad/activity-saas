from django.urls import path

from .views import WeeklyPlanItemCreateView, WeeklyPlanListCreateView

urlpatterns = [
    path("weekly-plans", WeeklyPlanListCreateView.as_view(), name="weekly-plan-list-create"),
    path("weekly-plan-items", WeeklyPlanItemCreateView.as_view(), name="weekly-plan-item-create"),
]