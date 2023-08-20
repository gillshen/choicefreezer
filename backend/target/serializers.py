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

    def create(self, validated_data):
        # To ensure program uniqueness (not possible at the database
        # level for Django reasons), check if any existing program matches
        # what the caller wants to create; return it if one exists.
        schools = validated_data.pop("schools")
        programs = Program.of_exact_schools(*schools).filter(**validated_data)

        if programs.exists():
            return programs.first()  # should be unique too
        else:
            # Create a new prorgam if none exists with matching values.
            validated_data["schools"] = schools
            return super().create(validated_data)


class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = "__all__"

    def create(self, validated_data):
        target, _ = Target.objects.get_or_create(**validated_data)
        return target


class TargetRequirementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetRequirements
        fields = "__all__"


class SubTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTarget
        fields = "__all__"

    def create(self, validated_data):
        subtarget, _ = SubTarget.objects.get_or_create(
            target=validated_data.pop("target"),
            admission_plan=validated_data.pop("admission_plan"),
        )
        # If the caller passed more than just `target` and `admission_plan`,
        # we must process the extra fields *after* the object has been
        # retrieved or created ; else (when a new subtarget needs to be
        # created) we risk violating the unique constraint.
        SubTarget.objects.filter(id=subtarget.id).update(**validated_data)
        return subtarget


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


class ProgramSelectItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ["id", "type", "display_name", "schools"]


# TODO
class TargetListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = "__all__"
