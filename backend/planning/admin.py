from django.contrib import admin

from .models import WeeklyPlan, WeeklyPlanItem


@admin.register(WeeklyPlan)
class WeeklyPlanAdmin(admin.ModelAdmin):
    list_display = ("id", "organization", "week_start", "created_by", "created_at")
    list_filter = ("organization", "week_start")
    search_fields = ("organization__name", "created_by__email")


@admin.register(WeeklyPlanItem)
class WeeklyPlanItemAdmin(admin.ModelAdmin):
    list_display = ("id", "weekly_plan", "day", "position", "activity")
    list_filter = ("day",)
    search_fields = ("activity__title",)