from rest_framework import serializers

from target.models import (
    School,
    SchoolRanking,
    Program,
    Target,
    TargetRequirements,
    SubTarget,
)

from core.models import Application


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


class _NestedApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "id",
            "program_type",
            "year",
            "term",
            "admission_plan",
            "general_status",
            "was_submitted",
            "was_admitted",
            "was_rejected",
            "was_deferred",
            "was_waitlisted",
        ]

    program_type = serializers.CharField()
    year = serializers.IntegerField()
    term = serializers.CharField()
    admission_plan = serializers.CharField()
    general_status = serializers.CharField()
    was_submitted = serializers.BooleanField()
    was_admitted = serializers.BooleanField()
    was_rejected = serializers.BooleanField()
    was_deferred = serializers.BooleanField()
    was_waitlisted = serializers.BooleanField()


class SchoolListItemSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;
        name: string;
        abbreviation: string;
        type: School.Type
        country: string;

        applications: {
            id: number;
            program_type: ProgramType;
            year: number;
            term: Target.Term;
            admission_plan: SubTarget.AdmissionPlan;
            general_status: 'in progress' | 'result pending' | 'final';
            was_submitted: boolean;
            was_admitted: boolean;
            was_rejected: boolean;
            was_deferred: boolean;
            was_waitlisted: boolean;
        }[];
    """

    class Meta:
        model = School
        fields = "__all__"

    applications = _NestedApplicationSerializer(many=True)


class ProgramListItemSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;
        type: <Program.Type>;
        display_name: string;

        schools: {
            id: number;
            name: string;
            abbreviation: string;
        }[];

        targets: {
            id: number;
            year: number;
            term: Target.Term;
        }[];

        applications: {
            id: number;
            program_type: ProgramType;
            year: number;
            term: Target.Term;
            admission_plan: SubTarget.AdmissionPlan;
            general_status: 'in progress' | 'result pending' | 'final';
            was_submitted: boolean;
            was_admitted: boolean;
            was_rejected: boolean;
            was_deferred: boolean;
            was_waitlisted: boolean;
        }[];
    """

    class Meta:
        model = Program
        exclude = ["name", "degree"]

    class _SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name", "abbreviation"]

    class _TargetSerializer(serializers.ModelSerializer):
        class Meta:
            model = Target
            fields = ["id", "year", "term"]

    display_name = serializers.CharField()
    schools = _SchoolSerializer(many=True)
    targets = _TargetSerializer(many=True)
    applications = _NestedApplicationSerializer(many=True)


class ProgramSelectItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ["id", "type", "display_name", "schools"]


# TODO?
class TargetListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = "__all__"


class TargetPageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = "__all__"

    schools = SchoolSerializer(read_only=True, many=True)
    program = ProgramSerializer(read_only=True)
    program_display_name = serializers.CharField(read_only=True)
    subtargets = SubTargetSerializer(read_only=True, many=True)
