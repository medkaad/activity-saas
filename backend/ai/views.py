from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import generate_activity


class GenerateActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        level = request.data.get("level")
        domain = request.data.get("domain")
        theme = request.data.get("theme")

        if not level or not domain or not theme:
            return Response(
                {"error": "level, domain and theme are required"},
                status=400,
            )

        result = generate_activity(level, domain, theme)

        return Response(result)