from django.conf import settings
from django.db import models
from organizations.models import Organization


class Activity(models.Model):
    LEVEL_CHOICES = [
        ("PS", "Petite Section"),
        ("MS", "Moyenne Section"),
        ("GS", "Grande Section"),
    ]

    DOMAIN_CHOICES = [
        ("LANGAGE", "Langage"),
        ("MOTRICITE", "Motricité"),
        ("MATHS", "Maths"),
        ("ART", "Arts"),
        ("EXPLORER", "Explorer le monde"),
        ("VIVRE", "Vivre ensemble"),
    ]

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="activities",
    )

    title = models.CharField(max_length=255)
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES)
    domain = models.CharField(max_length=20, choices=DOMAIN_CHOICES)

    duration_minutes = models.IntegerField()

    materials = models.TextField(blank=True)
    description = models.TextField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_activities",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
