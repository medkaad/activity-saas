from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    ordering = ("email",)
    list_display = ("email", "is_staff", "is_superuser")
    fieldsets = DjangoUserAdmin.fieldsets
    add_fieldsets = DjangoUserAdmin.add_fieldsets
