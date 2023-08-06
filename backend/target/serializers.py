from rest_framework import serializers

from target.models import (
    School,
    SchoolRanking,
    Program,
    Target,
    TargetRequirements,
    SubTarget,
)


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


class SchoolRankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolRanking
        fields = "__all__"


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"


class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = "__all__"


class TargetRequirementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetRequirements
        fields = "__all__"


class SubTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTarget
        fields = "__all__"


# TODO
class SchoolListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


# TODO
class ProgramListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = "__all__"


# TODO
class TargetListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = "__all__"
