from django.conf import settings
from django.db import models

from activities.models import Activity
from organizations.models import Organization


class WeeklyPlan(models.Model):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="weekly_plans",
    )

    week_start = models.DateField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="weekly_plans",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Plan {self.week_start} - {self.organization.name}"


class WeeklyPlanItem(models.Model):
    DAY_CHOICES = [
        ("MON", "Monday"),
        ("TUE", "Tuesday"),
        ("WED", "Wednesday"),
        ("THU", "Thursday"),
        ("FRI", "Friday"),
    ]

    weekly_plan = models.ForeignKey(
        WeeklyPlan,
        on_delete=models.CASCADE,
        related_name="items",
    )

    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name="plan_items",
    )

    day = models.CharField(max_length=3, choices=DAY_CHOICES)

    position = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.day} - {self.activity.title}"