from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from user.models import CfUser
from target.models import Target, SubTarget


class Student(models.Model):
    """
    Fields:
        id: number;
        last_name: string;
        first_name: string;
        name_in_chinese: boolean;

        last_name_romanized?: string;
        first_name_romanized?: string;

        gender: <Student.Gender>;
        citizenship: string;
        date_of_birth?: string | null; // date

        city?: string;
        state?: string;

        comments?: string;

    Related fields:
        contracts: [Contract];
        logs: [StudentLog];
        applications: [app.Application];

    Computed fields:
        name: string;
        is_current: boolean;
        services: [Service];
    """

    class Gender(models.TextChoices):
        FEMALE = "Female", _("Female")
        MALE = "Male", _("Male")
        OTHER = "Other", _("Other")

    last_name = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    name_in_chinese = models.BooleanField(default=True)

    last_name_romanized = models.CharField(max_length=50, blank=True)
    first_name_romanized = models.CharField(max_length=50, blank=True)

    gender = models.CharField(max_length=50, choices=Gender.choices)
    citizenship = models.CharField(max_length=100)
    date_of_birth = models.DateField(blank=True, null=True)

    # Residence
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=50, blank=True)

    comments = models.TextField(max_length=1000, blank=True)

    def __str__(self) -> str:
        return self.name

    @property
    def name(self):
        if self.name_in_chinese:
            return f"{self.last_name}{self.first_name}"
        else:
            return f"{self.first_name} {self.last_name}"

    @property
    def is_current(self) -> bool:
        return self.contracts.filter(status=Contract.Status.EFFECTIVE).exists()

    @property
    def services(self):
        return Service.objects.filter(contract__student=self)

    @classmethod
    def filter(
        cls,
        username: str = None,
        current_for_user: str = None,
        is_current: str = None,
        target_year: int = None,
    ):
        students = cls.objects.all()

        of_user = Q(contracts__services__cf_person__username__iexact=username)
        contract_effective = Q(contracts__status=Contract.Status.EFFECTIVE)
        service_ongoing = Q(contracts__services__end_date__isnull=True)

        if username and current_for_user == "true":
            students = students.filter(of_user & contract_effective & service_ongoing)
        elif username:
            students = students.filter(of_user)

        if is_current == "true":
            students = students.filter(contracts__status=Contract.Status.EFFECTIVE)
        elif is_current == "false":
            students = students.exclude(contracts__status=Contract.Status.EFFECTIVE)

        if target_year is not None:
            students = students.filter(contracts__target_year=target_year)

        return students.distinct()


class Contract(models.Model):
    """
    Fields:
        id: number;
        student: number;

        type: <Contract.Type>;
        target_year: number;
        date_signed?: string | null;
        status: <Contract.Status>;

    Related fields:
        services: [Service]
    """

    class Type(models.TextChoices):
        UG_FRESHMAN = "UG Freshman", _("UG Freshman")
        UG_TRANSFER = "UG Transfer", _("UG Transfer")
        GRADUATE = "Graduate", _("Graduate")

    class Status(models.TextChoices):
        EFFECTIVE = "Effective", _("Effective")
        FULFILED = "Fulfilled", _("Fulfilled")
        TERMINATED = "Terminated", _("Terminated")

    student = models.ForeignKey(
        Student,
        related_name="contracts",
        on_delete=models.CASCADE,
    )
    type = models.CharField(max_length=100, choices=Type.choices)
    target_year = models.IntegerField()
    date_signed = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=Status.choices)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "student",
                "type",
                "target_year",
                name="unique_contract_student_type_targetyear",
            )
        ]

    def __str__(self) -> str:
        return f"{self.student} >> {self.type}"

    @property
    def is_current(self):
        return self.status == self.Status.EFFECTIVE

    @classmethod
    def filter(cls, student_id: int = None):
        contracts = cls.objects.all()
        if student_id is not None:
            contracts = contracts.filter(student=student_id)
        return contracts


class Service(models.Model):
    """
    Fields:
        id: number;
        contract: number;

        cf_person: number;
        role: <Service.Role>;
        start_date: string | null; // date
        end_date?: string | null; // date

    Computed fields:
        is_current: boolean;
        cf_username: string;
    """

    class Role(models.TextChoices):
        ESSAY_ADVISOR = "文案", _("文案")
        PLANNER = "顾问", _("顾问")
        ASSISTANT_PLANNER = "服务顾问", _("服务顾问")
        PLANNER_PLUS = "战略顾问", _("战略顾问")

    contract = models.ForeignKey(
        Contract,
        related_name="services",
        on_delete=models.CASCADE,
    )
    cf_person = models.ForeignKey(
        CfUser,
        related_name="services",
        on_delete=models.CASCADE,
    )
    role = models.CharField(max_length=50, choices=Role.choices)

    # In case the person starts later than the contract did,
    # or quits before the contract ends
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "contract",
                "cf_person",
                "role",
                name="unique_service_contract_cfperson_role",
            )
        ]

    def __str__(self) -> str:
        return f"{self.cf_person} @@ {self.contract}"

    @property
    def is_current(self):
        return self.contract.is_current and self.end_date is None

    @property
    def cf_username(self):
        return self.cf_person.username


class Application(models.Model):
    """
    Fields:
        id: number;
        student: number;
        subtarget: number;
        cf_exclude: [number];

        scholarship_amount: number; // default 0
        scholarship_currency?: string;

        alt_admitted_into?: number;

    Related fields:
        major_choices: [MajorChoice];
        logs: [ApplicationLog];

    Computed fields:
        cf_people: [CfUser];
        schools: [target.School];
        program: target.Program;
        target: target.Target;
        majors_list: [string];
        latest_log: ApplicationLog | null;
        general_status: string;
    """

    student = models.ForeignKey(
        Student,
        related_name="applications",
        on_delete=models.CASCADE,
    )
    subtarget = models.ForeignKey(
        SubTarget,
        related_name="applications",
        on_delete=models.RESTRICT,
    )

    # By default, a CF person who serves a student is considered a party
    # to all the applications filed by the student. But when this is not
    # the case, they need to be manually excluded by specifying this field.
    cf_exclude = models.ManyToManyField(
        CfUser,
        related_name="excluded_applications",
        blank=True,
    )

    scholarship_amount = models.PositiveIntegerField(default=0)
    scholarship_currency = models.CharField(max_length=50, blank=True)

    # When the student is offered admission to a different prorgam than
    # the one they applied to, specify the alternative program here.
    alt_admitted_into = models.ForeignKey(
        Target,
        blank=True,
        null=True,
        related_name="alt_admissions",
        on_delete=models.RESTRICT,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "student",
                "subtarget",
                name="unique_application_student_subtarget",
            )
        ]

    def __str__(self) -> str:
        return f"{self.student} > {self.subtarget}"

    @property
    def cf_people(self):
        in_service = Q(services__contract__student=self.student)
        excluded_users = Q(id__in=self.cf_exclude.all())
        return CfUser.objects.filter(in_service).exclude(excluded_users)

    @property
    def schools(self):
        return self.subtarget.target.program.schools

    @property
    def program(self):
        return self.subtarget.target.program

    @property
    def target(self):
        return self.subtarget.target

    @property
    def majors_list(self) -> list:
        return [choice.major for choice in self.major_choices.order_by("rank")]

    @property
    def latest_log(self):
        return self.logs.latest()

    @property
    def general_status(self) -> str:
        """
        Return one of three strings:
            - "in progress"
            - "result pending"
            - "final"
        """
        if self.latest_log is None:
            # log-less applications presumably have just started
            return "in progress"

        if (status := self.latest_log.status) in [
            ApplicationLog.Status.STARTED,
            ApplicationLog.Status.READY,
        ]:
            return "in progress"

        if status in [
            ApplicationLog.Status.SUBMITTED,
            ApplicationLog.Status.REVIEW,
            ApplicationLog.Status.WAITLISTED,
            ApplicationLog.Status.DEFERRED,
        ]:
            return "result pending"

        return "final"

    @classmethod
    def filter(
        cls,
        username: str = None,
        student_id: int = None,
        school_id: int = None,
        program_id: int = None,
        target_id: int = None,
        subtarget_id: int = None,
    ):
        applications = cls.objects.all()

        if username:
            of_user = Q(
                student__contracts__services__cf_person__username__iexact=username
            )
            excluded_users = Q(cf_exclude__username__iexact=username)
            applications = applications.filter(of_user).exclude(excluded_users)

        if student_id is not None:
            applications = applications.filter(student=student_id)

        if school_id is not None:
            applications = applications.filter(
                subtarget__target__program__schools=school_id
            )

        if program_id is not None:
            applications = applications.filter(subtarget__target__program=program_id)

        if target_id is not None:
            applications = applications.filter(subtarget__target=target_id)

        if subtarget_id is not None:
            applications = applications.filter(subtarget=subtarget_id)

        return applications.distinct()


class MajorChoice(models.Model):
    """
    Fields:
        id: number;
        application: number;
        major: string;
        rank: number;
    """

    application = models.ForeignKey(
        Application,
        related_name="major_choices",
        on_delete=models.CASCADE,
    )

    major = models.CharField(max_length=100)
    rank = models.PositiveIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "application", "major", name="unique_majorchoice_application_major"
            ),
            models.UniqueConstraint(
                "application", "rank", name="unique_majorchoice_application_rank"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.application} > {self.major} ({self.rank})"


class ApplicationLog(models.Model):
    """
    Fields:
        id: number;
        application: number;
        date: string; // date
        status: <ApplicationLog.Status>;
        comments?: string;
        updated: string; // datetime
    """

    class Status(models.TextChoices):
        STARTED = "Started", _("Started")
        READY = "Ready to Submit", _("Ready to Submit")
        SUBMITTED = "Submitted", _("Submitted")
        REVIEW = "Under Review", _("Under Review")
        DEFERRED = "Deferred", _("Deferred")
        WAITLISTED = "On Waitlist", _("On Waitlist")
        ADMITTED = "Admitted", _("Admitted")
        REJECTED = "Rejected", _("Rejected")
        CANCELED = "Canceled", _("Canceled")
        WITHDRAWN = "Withdrawn", _("Withdrawn")
        DISQUALIFIED = "Disqualified", _("Disqualified")
        CLOSED = "Application Closed", _("Application Closed")
        DECLINED = "Offer Declined", _("Offer Declined")
        ENROLLED = "Enrolled", _("Enrolled")

    application = models.ForeignKey(
        Application,
        related_name="logs",
        on_delete=models.CASCADE,
    )

    date = models.DateField()
    status = models.CharField(max_length=50, choices=Status.choices)
    comments = models.TextField(max_length=1000, blank=True)

    updated = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-updated"]
        get_latest_by = ["date", "updated"]

        indexes = [
            models.Index(fields=["-date", "-updated"]),
        ]

        constraints = [
            # `status`` must be unique for an application, unless explained in `comments`
            models.UniqueConstraint(
                "application",
                "status",
                "comments",
                name="unique_applicationlog_application_status_comments",
            )
        ]

    def __str__(self) -> str:
        return f"{self.status} | {self.application}"

    @classmethod
    def filter(cls, application_id: int = None):
        logs = cls.objects.all()
        if application_id is not None:
            logs = logs.filter(application=application_id)
        return logs
