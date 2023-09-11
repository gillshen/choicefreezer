from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.functions import Lower


class School(models.Model):
    """
    Fields:
        id: number;
        name: string;
        abbreviation?: string;
        type: <School.Type>;
        country: string;

    Related fields:
        programs: [Program];
        rankings: [Ranking];
        enrollments: [student.Enrollment];

    Computed fields:
        applications: Application[];
    """

    class Type(models.TextChoices):
        UNIVERSITY = "University", _("University")
        SECONDARY = "Secondary", _("Secondary School")
        OTHER = "Other", _("Other")

    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=50, blank=True)
    type = models.CharField(max_length=50, choices=Type.choices)
    country = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(Lower("name"), name="unique_school_name"),
            models.UniqueConstraint(
                Lower("abbreviation"), name="unique_school_abbreviation"
            ),
        ]

    def __str__(self) -> str:
        return self.name

    @staticmethod
    def format_names(schools):
        return " | ".join(school.name for school in schools)

    @property
    def applications(self):
        from core.models import Application

        return Application.filter(school_id=self.id)


class SchoolRanking(models.Model):
    """
    Fields:
        id: number;
        school: number;
        rank: number;
        source: <SchoolRanking.Source>;
        pub_year: number;
        category?: string;
    """

    class Source(models.TextChoices):
        US_NEWS = "US News", _("US News")
        QS_WORLD = "QS World", _("QS World")

    school = models.ForeignKey(
        School,
        related_name="rankings",
        on_delete=models.CASCADE,
    )

    rank = models.PositiveIntegerField()
    source = models.CharField(max_length=50, choices=Source.choices)
    pub_year = models.IntegerField()

    # "National Universities", "Liberal Arts Colleges", etc.
    category = models.CharField(max_length=50, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "school",
                "rank",
                "source",
                "pub_year",
                Lower("category"),
                name="unique_schoolranking_school_rank_source_pubyear_category",
            )
        ]

    def __str__(self) -> str:
        return f"{self.school} @ {self.rank} ({self.source} {self.pub_year})"


class Program(models.Model):
    """
    Fields:
        id: number;
        type: <Program.Type>;
        name?: string;
        degree?: string;
        schools: [number];

    Related fields:
        targets: [Target];

    Computed fields:
        display_name: string;
        applications: Application[];
    """

    class Type(models.TextChoices):
        PRE_COLLEGE = "Pre-College", _("Pre-College")
        UG_FRESHMAN = "UG Freshman", _("UG Freshman")
        UG_TRANSFER = "UG Transfer", _("UG Transfer")
        MASTER = "Master", _("Master")
        PHD = "Doctorate", _("Doctorate")
        OTHER = "Other", _("Other")

    type = models.CharField(max_length=100, choices=Type.choices)
    name = models.CharField(max_length=100, blank=True)
    degree = models.CharField(max_length=100, blank=True)

    schools = models.ManyToManyField(School, related_name="programs")

    # We have to rely on serializers to ensure program uniqueness.
    # It would be nice to have a unique constraint at the database level,
    # but this is not possible because `schools` is a many-to-many field
    # and as such is not permitted in constraints.

    def __str__(self) -> str:
        schools = School.format_names(self.schools.all())
        return f"{schools} | ({self.type}) {self.name} {self.degree}".strip()

    @property
    def display_name(self):
        if self.degree:
            degree = f" ({self.degree})"
        else:
            degree = ""
        return f"{self.name or self.type}{degree}"

    @property
    def applications(self):
        from core.models import Application

        return Application.filter(program_id=self.id)

    @classmethod
    def of_exact_schools(cls, *schools):
        """Return programs hosted by exactly the specified schools"""
        # Narrow down to programs hosted by *at least* the given schools.
        programs = cls.objects.all()
        for school in schools:
            programs = programs.filter(schools=school)

        # Exclude programs hosted by schools in addition to the given ones.
        excluded_schools = School.objects.exclude(id__in=[s.id for s in schools])
        programs = programs.exclude(schools__in=excluded_schools)

        return programs


class Target(models.Model):
    """
    Fields:
        id: number;
        program: number;
        year: number;
        term: <Target.Term>;
        subjective_rank?: number;

    Related fields:
        subtargets: [SubTarget];
    """

    class Term(models.TextChoices):
        FALL = "Fall", _("Fall")
        SPRING = "Spring", _("Spring")
        SUMMER = "Summer", _("Summer")
        SPRING_SUMMER = "Spring-Summer", _("Spring-Summer")
        WINTER = "Winter", _("Winter")

    program = models.ForeignKey(
        Program,
        related_name="targets",
        on_delete=models.CASCADE,
    )
    year = models.IntegerField()
    term = models.CharField(max_length=50, choices=Term.choices)

    # Allow users to assign whatever rank they please; the database does
    # not enforce any checks (except that the values must be positive).
    subjective_rank = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "program",
                "year",
                "term",
                name="unique_target_program_year_term",
            )
        ]

    def __str__(self) -> str:
        return f"{self.program} ({self.term} {self.year})"

    @property
    def program_display_name(self) -> str:
        # A convenience method for avoiding deep nesting:
        # see application serializers in core.serializers
        return self.program.display_name

    @classmethod
    def of_school(cls, school_id: int):
        return cls.objects.filter(program__schools=school_id)


class TargetRequirements(models.Model):
    """
    Fields (all optional except `target` and `updated`):
        target: number;

        minimum_gpa: string;
        transcripts: string;

        requires_english_proficiency: boolean | null;
        toefl_report_code: string;
        ielts_mailing_address: string;
        english_proficiency_details: string;

        number_required_recs: number | null;
        number_optional_recs: number | null;
        rec_details: string;

        requires_writing: boolean | null;
        writing_details: string;

        requires_interview: boolean | null;
        interview_details: string;

        financial_docs: string;

        // Undergraduate-only
        requires_sat_or_act: boolean | null;
        sat_report_code: string;
        act_report_code: string;
        sat_or_act_details: string;

        // Graduate-only
        requires_wes: boolean | null;
        non_wes_evaluation: string;
        requires_gre: boolean | null;
        gre_institution_code: string;
        gre_department_code: string;
        gre_details: string;

        // Misc
        anything_else: string;
        updated: string; // datetime
    """

    target = models.OneToOneField(
        Target,
        related_name="requirements",
        on_delete=models.CASCADE,
    )

    # GPA and transcripts
    minimum_gpa = models.TextField(max_length=5000, blank=True)
    transcripts = models.TextField(max_length=5000, blank=True)

    # English proficiency
    requires_english_proficiency = models.BooleanField(blank=True, null=True)
    toefl_report_code = models.CharField(max_length=50, blank=True)
    ielts_mailing_address = models.TextField(max_length=200, blank=True)
    english_proficiency_details = models.TextField(max_length=5000, blank=True)

    # Recommendations
    number_required_recs = models.PositiveSmallIntegerField(blank=True, null=True)
    number_optional_recs = models.PositiveSmallIntegerField(blank=True, null=True)
    rec_details = models.TextField(max_length=5000, blank=True)

    # Writing
    requires_writing = models.BooleanField(null=True, blank=True)
    writing_details = models.TextField(max_length=10_000, blank=True)

    # Interview
    requires_interview = models.BooleanField(null=True, blank=True)
    interview_details = models.TextField(max_length=5000, blank=True)

    # Financial documents
    financial_docs = models.TextField(max_length=5000, blank=True)

    # Undergraduate-only
    requires_sat_or_act = models.BooleanField(blank=True, null=True)
    sat_report_code = models.CharField(max_length=50, blank=True)
    act_report_code = models.CharField(max_length=50, blank=True)
    sat_or_act_details = models.TextField(max_length=5000, blank=True)

    # Graduate-only
    requires_wes = models.BooleanField(blank=True, null=True)
    non_wes_evaluation = models.TextField(max_length=5000, blank=True)
    requires_gre = models.BooleanField(blank=True, null=True)
    gre_institution_code = models.CharField(max_length=50, blank=True)
    gre_department_code = models.CharField(max_length=50, blank=True)
    gre_details = models.TextField(max_length=5000, blank=True)

    # Misc
    anything_else = models.TextField(max_length=5000, blank=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "target requirements"

    def __str__(self) -> str:
        return f"Requirements of ${self.target}"


class SubTarget(models.Model):
    """
    Fields:
        id: number;
        target: number;
        admission_plan: <SubTarget.AdmissionPlan>;

        deadline_date?: string | null; // date
        deadline_time?: string | null; // time
        deadline_timezone?: string;

        decision_date?: string | null; // date
        comments?: string;

    Related fields:
        applications: [core.Applications];
    """

    class AdmissionPlan(models.TextChoices):
        # Undergraduate
        EARLY_DECISION = "ED", _("ED")
        EARLY_ACTION = "EA", _("EA")
        RESTRICTIVE_EARLY_ACTION = "REA", _("REA")
        EARLY_DECISION_2 = "ED II", _("ED II")
        REGULAR_DECISION = "RD", _("RD")
        # Non-UG
        REGULAR = "Regular", _("Regular")
        PRIORITY = "Priority", _("Priority")
        ROUND_1 = "Round 1", _("Round 1")
        ROUND_2 = "Round 2", _("Round 2")
        ROUND_3 = "Round 3", _("Round 3")
        ROUND_4 = "Round 4", _("Round 4")
        ROUND_5 = "Round 5", _("Round 5")
        # Common
        ROLLING = "Rolling", _("Rolling")
        TBD = "To Be Decided", _("To Be Decided")

    target = models.ForeignKey(
        Target,
        related_name="subtargets",
        on_delete=models.CASCADE,
    )
    admission_plan = models.CharField(max_length=100, choices=AdmissionPlan.choices)

    deadline_date = models.DateField(blank=True, null=True)
    deadline_time = models.TimeField(blank=True, null=True)
    deadline_timezone = models.CharField(max_length=50, blank=True)

    decision_date = models.DateField(blank=True, null=True)
    comments = models.CharField(max_length=1000, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "target",
                "admission_plan",
                name="unique_subtarget_target_admissionplan",
            )
        ]

    def __str__(self) -> str:
        return f"{self.target} | {self.admission_plan}"

    @classmethod
    def filter(cls, target_id: int = None):
        subtargets = cls.objects.all()
        if target_id is not None:
            subtargets = subtargets.filter(target=target_id)
        return subtargets
