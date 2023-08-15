from rest_framework import serializers

from user.models import CfUser
from core.models import Student, Application


class CfUserCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;
        username: string;
        password: string;  // write-only
        email: string;
        is_active: boolean;

        department: <user.Department>;
        public_banner: string;
        private_banner: string;
    """

    class Meta:
        model = CfUser
        exclude = [
            "first_name",
            "last_name",
            "last_login",
            "is_staff",
            "is_superuser",
            "date_joined",
            "groups",
            "user_permissions",
        ]

    password = serializers.CharField(write_only=True)


class CfUserRetrieveSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;
        username: string;
        email: string;
        is_active: boolean;

        department: <user.Department>;
        public_banner: string;
        private_banner: string;

        current_students: {id: number; name: string}[];
        past_students: {id: number; name: string}[];
        applications: {id: number; general_status: string}[];
    """

    class Meta:
        model = CfUser
        exclude = [
            "password",
            "first_name",
            "last_name",
            "last_login",
            "is_staff",
            "is_superuser",
            "date_joined",
            "groups",
            "user_permissions",
        ]

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


class CfUserListItemSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;
        username: string;
        password: string;
        email: string;
        is_active: boolean;

        department: <user.Department>;
        public_banner: string;
        private_banner: string;
    """

    class Meta:
        model = CfUser
        fields = ["id", "username", "is_active", "department"]
