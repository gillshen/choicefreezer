from rest_framework import serializers
from user.models import CfUser
from core.models import Student
from writing.models import UserLog, EssayTag, Essay


class UserLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLog
        fields = "__all__"


class UserLogListItemSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;
        author: {
            id: number;
            username: string;
        };

        title: string;
        text?: string;

        pinned: boolean;
        shared: boolean;
        task_status: <UserLog.TaskStatus>;
        task_due: string | null; // datetime

        relevant_student: {
            id: number;
            name: string;
        };
        updated: string; // datetime
    """

    class Meta:
        model = UserLog
        fields = "__all__"

    class _AuthorSerializer(serializers.ModelSerializer):
        class Meta:
            model = CfUser
            fields = ["id", "username"]

    author = _AuthorSerializer()

    class _AboutStudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "name"]

    relevant_student = _AboutStudentSerializer()


class EssayTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = EssayTag
        fields = "__all__"


class EssaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Essay
        fields = "__all__"


class EssayListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Essay
        exclude = ["text"]

    preview = serializers.CharField()
