from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "email", "password")

    def create(self, validated_data):
        user = User(email=validated_data["email"])
        user.set_password(validated_data["password"])
        user.save()
        return user


class MeSerializer(serializers.ModelSerializer):
    byok_enabled = serializers.SerializerMethodField()
    llm_remaining_this_week = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "weekly_llm_quota",
            "llm_used_this_week",
            "llm_remaining_this_week",
            "byok_enabled",
        )

    def get_byok_enabled(self, obj):
        return bool(obj.openai_api_key)

    def get_llm_remaining_this_week(self, obj):
        return max(obj.weekly_llm_quota - obj.llm_used_this_week, 0)
