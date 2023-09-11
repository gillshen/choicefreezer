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
from student.models import TOEFL, IELTS, DET, SAT, ACT, AP, GRE, GMAT


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


class ContractPageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

    class _StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "name"]

        name = serializers.CharField()

    student = _StudentSerializer()
    services = ServiceListItemSerializer(many=True)


class _TOEFL_Serializer(serializers.ModelSerializer):
    class Meta:
        model = TOEFL
        exclude = ["used_for"]

    result = serializers.IntegerField()


class _IELTS_Serializer(serializers.ModelSerializer):
    class Meta:
        model = IELTS
        exclude = ["used_for"]

    result = serializers.IntegerField()


class _DET_Serializer(serializers.ModelSerializer):
    class Meta:
        model = DET
        exclude = ["used_for"]

    result = serializers.IntegerField()


class _SAT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = SAT
        exclude = ["used_for"]

    result = serializers.IntegerField()


class _ACT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = ACT
        exclude = ["used_for"]

    result = serializers.IntegerField()


class _AP_Serializer(serializers.ModelSerializer):
    class Meta:
        model = AP
        exclude = ["used_for"]


class _GRE_Serializer(serializers.ModelSerializer):
    class Meta:
        model = GRE
        exclude = ["used_for"]

    result = serializers.IntegerField()


class _GMAT_Serializer(serializers.ModelSerializer):
    class Meta:
        model = GMAT
        exclude = ["used_for"]

    result = serializers.IntegerField()


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
            name: string;
            abbreviation: string;
        }[];

        program: {
            id: number;
            type: <Program.Type>;
            name: string;
            degree: string;
            display_name: string;
        };

        target: {
            id: number;
            year: number;
            term: <Target.Term>;
            subjective_ranking: number | null;
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

        toefl_submitted: ...[];
        ielts_submitted: ...[];
        det_submitted: ...[];
        sat_submitted: ...[];
        act_submitted: ...[];
        ap_submitted: ...[];
        gre_submitted: ...[];
        gmat_submitted: ...[];

        scholarship_amount: number;
        scholarship_currency: string;
        alt_admitted_into: {
            id: number;
            program_display_name: string;
        };

        cf_exclude: number[];
    """

    class Meta:
        model = Application
        fields = "__all__"

    # TODO enrich student serializer with GPA, tests, etc.
    class _StudentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Student
            fields = ["id", "name", "gender", "citizenship"]

        name = serializers.CharField()

    student = _StudentSerializer()

    # TODO need roles
    class _UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = CfUser
            fields = ["id", "username"]

    cf_people = _UserSerializer(many=True)

    class _SchoolSerializer(serializers.ModelSerializer):
        class Meta:
            model = School
            fields = ["id", "name", "abbreviation"]

    schools = _SchoolSerializer(many=True)

    class _ProgramSerializer(serializers.ModelSerializer):
        class Meta:
            model = Program
            exclude = ["schools"]

        display_name = serializers.CharField()

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

    majors_list = serializers.ListField()

    class _ApplicationLogSerializer(serializers.ModelSerializer):
        class Meta:
            model = ApplicationLog
            fields = ["date", "status", "updated"]

    latest_log = _ApplicationLogSerializer()

    toefl_submitted = _TOEFL_Serializer(many=True)
    ielts_submitted = _IELTS_Serializer(many=True)
    det_submitted = _DET_Serializer(many=True)
    sat_submitted = _SAT_Serializer(many=True)
    act_submitted = _ACT_Serializer(many=True)
    ap_submitted = _AP_Serializer(many=True)
    gre_submitted = _GRE_Serializer(many=True)
    gmat_submitted = _GMAT_Serializer(many=True)

    class _AltTargetSerializer(serializers.ModelSerializer):
        class Meta:
            model = Target
            fields = ["id", "program_display_name"]

        program_display_name = serializers.CharField()

    alt_admitted_into = _AltTargetSerializer()


class ApplicationPageDataSerializer(serializers.ModelSerializer):
    """
    Fields:
        id: number;

        student: {
            id: number;
            name: string;
        };

        schools: {
            id: number;
            name: string;
            abbreviation: string;
        }[];

        program: {
            id: number;
            type: <Program.Type>;
            name: string;
            degree: string;
            display_name: string;
        };

        target: {
            id: number;
            year: number;
            term: <Target.Term>;
            subjective_ranking: number | null;
        };

        subtarget: {
            id: number;
            admission_plan: <SubTarget.AdmissionPlan>;
            deadline: string | null; // datetime
            deadline_timezone: string;
        };

        majors_choices: {
            id: number;
            application: number;
            major_category: string;
            major: string;
            rank: number;
        }[];

        logs: {
            id: number;
            application: number;
            date: string;
            status: <ApplicationLog.Status>;
            comments: string;
            updated: string; // datetime
        };

        toefl_submitted: ...[];
        ielts_submitted: ...[];
        det_submitted: ...[];
        sat_submitted: ...[];
        act_submitted: ...[];
        ap_submitted: ...[];
        gre_submitted: ...[];
        gmat_submitted: ...[];

        scholarship_amount: number;
        scholarship_currency: string;
        alt_admitted_into: {
            id: number;
            program_display_name: string;
        };
        latest_status: string;

        cf_exclude: number[];
    """

    class Meta:
        model = Application
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
            fields = ["id", "name", "abbreviation"]

    schools = _SchoolSerializer(many=True)

    class _ProgramSerializer(serializers.ModelSerializer):
        class Meta:
            model = Program
            exclude = ["schools"]

        display_name = serializers.CharField()

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
            fields = ["major_category", "major", "rank"]

    major_choices = MajorChoiceSerializer(many=True)
    logs = ApplicationLogSerializer(many=True)
    latest_status = serializers.CharField()

    toefl_submitted = _TOEFL_Serializer(many=True)
    ielts_submitted = _IELTS_Serializer(many=True)
    det_submitted = _DET_Serializer(many=True)
    sat_submitted = _SAT_Serializer(many=True)
    act_submitted = _ACT_Serializer(many=True)
    ap_submitted = _AP_Serializer(many=True)
    gre_submitted = _GRE_Serializer(many=True)
    gmat_submitted = _GMAT_Serializer(many=True)

    class _AltTargetSerializer(serializers.ModelSerializer):
        class Meta:
            model = Target
            fields = ["id", "program_display_name"]

        program_display_name = serializers.CharField()

    alt_admitted_into = _AltTargetSerializer()
