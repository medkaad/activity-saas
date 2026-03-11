from django.contrib import admin

from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "level",
        "domain",
        "organization",
        "created_by",
        "created_at",
    )
    list_filter = ("level", "domain", "organization")
    search_fields = ("title", "description", "materials")
