from rest_framework import serializers

from core.models import (
    CfProduct,
    Student,
    Contract,
    Service,
    Application,
    MajorChoice,
    ApplicationLog,
    CfUser,
)

from target.models import School, Program, Target, SubTarget


class CfProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = CfProduct
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"


class MajorChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MajorChoice
        fields = "__all__"


class ApplicationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationLog
        fields = "__all__"


class ServiceListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"

    cf_username = serializers.CharField()


class StudentListItemSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;

        last_name: string;
        first_name: string;
        last_name_first: boolean;

        last_name_romanized: string;
        first_name_romanized: string;

        gender: <Student.Gender>;
        citizenship: string;
        date_of_birth: string | null; // date

        city: string;
        state: string;

        comments: string;

        cf_products: {
            id: number;
            name: string;
        }[];

        name: string;
        is_current: boolean;
        latest_target_year: number;
        latest_contract_type: string;
        latest_services: {
            id: number;
            cf_username: string;
            role: <Service.Role>;
            start_date: string | null; // date
            end_date: string | null; // date
            contract: number;
            cf_person: number;
        }[];
    """

    class Meta:
        model = Student
        fields = "__all__"

    cf_products = CfProductSerializer(many=True)

    name = serializers.CharField()
    is_current = serializers.BooleanField()
    latest_target_year = serializers.IntegerField()
    latest_contract_type = serializers.CharField()
    latest_services = ServiceListItemSerializer(many=True)


class ContractListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    services = ServiceListItemSerializer(many=True)


class ApplicationListItemSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;

        student: {
            id: number;
            name: string;
            gender: <Student.Gender>;
            citizenship: string;
        };

        cf_people: {
            id: number;
            username: string;
        }[];

        schools: {
            id: number;
            abbreviation: string;
        }[];

        program: {
            id: number;
            type: <Program.Type>;
            name: string;
            degree: string;
        };

        target: {
            id: number;
            year: number;
            term: <Target.Term>;
        };

        subtarget: {
            id: number;
            admission_plan: <SubTarget.AdmissionPlan>;
            deadline: string | null; // datetime
            deadline_timezone: string;
        };

        majors_list: [string];

        latest_log: {
            date: string;
            status: <ApplicationLog.Status>;
            updated: string; // datetime
        };

        scholarship_amount: number;
        scholarship_currency: string;
        alt_admitted_into: number;
    """

    class Meta:
        model = Application
        exclude = ["cf_exclude"]

    # TODO enrich student serializer with GPA, tests, etc.
    class _StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "name", "gender", "citizenship"]

        name = serializers.CharField()

    student = _StudentSerializer()

    class _UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = CfUser
            fields = ["id", "username"]

    cf_people = _UserSerializer(many=True)

    class _SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "abbreviation"]

    schools = _SchoolSerializer(many=True)

    class _ProgramSerializer(serializers.ModelSerializer):
        class Meta:
            model = Program
            exclude = ["schools"]

    program = _ProgramSerializer()

    class _TargetSerializer(serializers.ModelSerializer):
        class Meta:
            model = Target
            exclude = ["program"]

    target = _TargetSerializer()

    class _SubTargetSerializer(serializers.ModelSerializer):
        class Meta:
            model = SubTarget
            exclude = ["target"]

    subtarget = _SubTargetSerializer()

    class _MajorChoiceSerializer(serializers.ModelSerializer):
        class Meta:
            model = MajorChoice
            fields = ["major", "rank"]

    majors_list = serializers.ListField()

    class _ApplicationLogSerializer(serializers.ModelSerializer):
        class Meta:
            model = ApplicationLog
            fields = ["date", "status", "updated"]

    latest_log = _ApplicationLogSerializer()
