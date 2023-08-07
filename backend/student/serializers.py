from rest_framework import serializers
from student.models import (
    StudentLog,
    Enrollment,
    GPA,
    ClassRank,
    TOEFL,
    IELTS,
    DET,
    SAT,
    ACT,
    AP,
    GRE,
)


class StudentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLog
        fields = "__all__"


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"


class GPA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = GPA
        fields = "__all__"


class ClassRankSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRank
        fields = "__all__"


class TOEFL_Serializer(serializers.ModelSerializer):
    class Meta:
        model = TOEFL
        fields = "__all__"


class IELTS_Serializer(serializers.ModelSerializer):
    class Meta:
        model = IELTS
        fields = "__all__"


class DET_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DET
        fields = "__all__"


class SAT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = SAT
        fields = "__all__"


class ACT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = ACT
        fields = "__all__"


class AP_Serializer(serializers.ModelSerializer):
    class Meta:
        model = AP
        fields = "__all__"


class GRE_Serializer(serializers.ModelSerializer):
    class Meta:
        model = GRE
        fields = "__all__"
