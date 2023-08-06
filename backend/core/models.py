from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
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

        gender: "Female" | "Male" | "Other";
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
    def of_user(cls, username: str):
        return cls.objects.filter(
            contract__service__cf_person__username__exact=username
        )


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
    """

    class Role(models.TextChoices):
        W = "文案", _("文案")
        G = "顾问", _("顾问")
        ZG = "战略顾问", _("战略顾问")
        FG = "服务顾问", _("服务顾问")

    contract = models.ForeignKey(
        Contract,
        related_name="services",
        on_delete=models.CASCADE,
    )
    cf_person = models.ForeignKey(
        User,
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


class Application(models.Model):
    """
    Fields:
        id: number;
        student: number;
        subtarget: number;
        cf_exclude: [number];

        scholarship_amount?: number;
        scholarship_currency?: string;

        alt_admitted_into?: number;

    Related fields:
        major_choices: [MajorChoice];
        logs: [ApplicationLog];
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
        User,
        related_name="excluded_applications",
        blank=True,
    )

    scholarship_amount = models.PositiveIntegerField(blank=True, null=True)
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

    def __str__(self) -> str:
        return f"{self.student} > {self.subtarget}"

    @classmethod
    def of_user(cls, username: str):
        via_student = Q(student__contract__service__cf_person__username__exact=username)
        exclude = Q(cf_exclude__username__exact=username)
        return cls.objects.filter(via_student).exclude(exclude)

    @classmethod
    def of_school(cls, school_id: int):
        return cls.objects.filter(subtarget__target__program__schools=school_id)

    @classmethod
    def of_program(cls, program_id: int):
        return cls.objects.filter(subtarget__target__program=program_id)

    @classmethod
    def of_target(cls, target_id: int):
        return cls.objects.filter(subtarget__target=target_id)


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
        status: <Application.Status>;
        comments?: string;
        updated: string; // datetime
    """

    class Status(models.TextChoices):
        STARTED = "Started", _("Started")
        READY = "Ready to Submit", _("Ready to Submit")
        SUBMITTED = "Submitted", _("Submitted")
        REVIEW = "Under Review", _("Under Review")
        ADMITTED = "Admitted", _("Admitted")
        DEFERRED = "Deferred", _("Deferred")
        WAITLISTED = "On Waitlist", _("On Waitlist")
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
