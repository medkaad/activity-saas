from rest_framework import serializers

from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source="created_by.email", read_only=True)

    class Meta:
        model = Activity
        fields = (
            "id",
            "organization",
            "title",
            "level",
            "domain",
            "duration_minutes",
            "materials",
            "description",
            "created_by",
            "created_by_email",
            "created_at",
        )
        read_only_fields = ("id", "created_by", "created_by_email", "created_at")
