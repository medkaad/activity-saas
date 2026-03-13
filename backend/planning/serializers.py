from rest_framework import serializers

from .models import WeeklyPlan, WeeklyPlanItem


class WeeklyPlanItemSerializer(serializers.ModelSerializer):
    activity_title = serializers.CharField(source="activity.title", read_only=True)

    class Meta:
        model = WeeklyPlanItem
        fields = (
            "id",
            "weekly_plan",
            "activity",
            "activity_title",
            "day",
            "position",
        )


class WeeklyPlanSerializer(serializers.ModelSerializer):
    items = WeeklyPlanItemSerializer(many=True, read_only=True)

    class Meta:
        model = WeeklyPlan
        fields = (
            "id",
            "organization",
            "week_start",
            "created_by",
            "created_at",
            "items",
        )
        read_only_fields = ("id", "created_by", "created_at", "items")