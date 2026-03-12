from django.urls import path

from .views import GenerateActivityView

urlpatterns = [
    path("activities/generate", GenerateActivityView.as_view(), name="generate-activity"),
]