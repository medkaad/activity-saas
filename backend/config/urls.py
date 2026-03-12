from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health(request):
    return JsonResponse({"status": "ok", "version": "1.0"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health", health),
    path("api/", include("accounts.urls")),
    path("api/", include("organizations.urls")),
    path("api/", include("activities.urls")),
    path("api/", include("ai.urls")),
]
