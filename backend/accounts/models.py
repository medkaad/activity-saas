from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    weekly_llm_quota = models.IntegerField(default=5)
    llm_used_this_week = models.IntegerField(default=0)
    openai_api_key = models.TextField(blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
