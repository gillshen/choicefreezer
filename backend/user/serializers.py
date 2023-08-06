from rest_framework import serializers

from user.models import UserProfile
from core.models import Student, Application


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"


class UserProfileListItemSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;
        user: number;
        department: <UserProfile.Department>;
        public_banner: string;
        private_banner: string;
        username: string;
        is_active: boolean;
    """

    class Meta:
        model = UserProfile
        fields = "__all__"

    username = serializers.CharField()
    is_active = serializers.BooleanField()

    class _StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "name"]

        name = serializers.CharField()

    current_students = _StudentSerializer(many=True)
    past_students = _StudentSerializer(many=True)

    class _ApplicationSerializer(serializers.ModelSerializer):
        class Meta:
            model = Application
            fields = ["id", "general_status"]

        general_status = serializers.CharField()

    applications = _ApplicationSerializer(many=True)
