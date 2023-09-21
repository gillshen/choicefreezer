from rest_framework import serializers
from student.models import (
    Student,
    Enrollment,
    GPA,
    ClassRank,
    TOEFL,
    IELTS,
    DET,
    SAT,
    ACT,
    AP,
    IBPredicted,
    IBFinal,
    AlevelPredicted,
    AlevelFinal,
    GRE,
    GMAT,
    LSAT,
)
from target.models import School


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

    result = serializers.IntegerField(read_only=True)


class IELTS_Serializer(serializers.ModelSerializer):
    class Meta:
        model = IELTS
        fields = "__all__"

    listening = serializers.FloatField()
    reading = serializers.FloatField()
    writing = serializers.FloatField()
    speaking = serializers.FloatField()
    result = serializers.FloatField(read_only=True)


class DET_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DET
        fields = "__all__"

    result = serializers.IntegerField(read_only=True)


class SAT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = SAT
        fields = "__all__"

    result = serializers.IntegerField(read_only=True)


class ACT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = ACT
        fields = "__all__"

    result = serializers.IntegerField(read_only=True)


class AP_Serializer(serializers.ModelSerializer):
    class Meta:
        model = AP
        fields = "__all__"


class IBPredictedSerializer(serializers.ModelSerializer):
    class Meta:
        model = IBPredicted
        fields = "__all__"


class IBFinalSerializer(serializers.ModelSerializer):
    class Meta:
        model = IBFinal
        fields = "__all__"


class AlevelPredictedSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlevelPredicted
        fields = "__all__"


class AlevelFinalSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlevelFinal
        fields = "__all__"


class GRE_Serializer(serializers.ModelSerializer):
    class Meta:
        model = GRE
        fields = "__all__"

    result = serializers.IntegerField(read_only=True)


class GMAT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = GMAT
        fields = "__all__"

    result = serializers.IntegerField(read_only=True)


class LSAT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = LSAT
        fields = "__all__"

    result = serializers.IntegerField(read_only=True)


class EnrollementListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"

    class _SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name"]

    school = _SchoolSerializer()
    grades = GPA_Serializer(read_only=True, many=True)
    class_ranks = ClassRankSerializer(read_only=True, many=True)


class EnrollmentPageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"

    class _StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "name"]

        name = serializers.CharField()

    student = _StudentSerializer()

    class _SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name"]

    school = _SchoolSerializer()

    grades = GPA_Serializer(read_only=True, many=True)
    class_ranks = ClassRankSerializer(read_only=True, many=True)
