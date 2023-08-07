from abc import abstractmethod
from decimal import Decimal

from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from core.models import Student
from target.models import School, Program, Target


class StudentLog(models.Model):
    """
    Fields:
        id: number;
        student: number;
        title: string;
        text?: string;
        pinned: boolean;
        updated: string; // datetime
    """

    student = models.ForeignKey(
        Student,
        related_name="logs",
        on_delete=models.CASCADE,
    )

    title = models.CharField(max_length=50)
    text = models.TextField(max_length=1000, blank=True)
    pinned = models.BooleanField(default=False)

    updated = models.DateTimeField(auto_now=True)

    class Meta:
        # Pinned logs before non-pinned ones, then order by recency
        ordering = ["-pinned", "-updated"]
        get_latest_by = ["pinned", "updated"]

        indexes = [
            models.Index(fields=["-pinned", "-updated"]),
        ]

    def __str__(self) -> str:
        return f"{self.student}: {self.title}"


class Progression(models.TextChoices):
    GRADE_9 = "Grade 9", _("Grade 9")
    GRADE_9R = "Grade 9 (Retake)", _("Grade 9 (Retake)")

    GRADE_10 = "Grade 10", _("Grade 10")
    GRADE_10R = "Grade 10 (Retake)", _("Grade 10 (Retake)")

    GRADE_11 = "Grade 11", _("Grade 11")
    GRADE_11R = "Grade 11 (Retake)", _("Grade 11 (Retake)")

    GRADE_12 = "Grade 12", _("Grade 12")
    GRADE_12R = "Grade 12 (Retake)", _("Grade 12 (Retake)")

    YEAR_1 = "Year 1", _("Year 1")
    YEAR_1R = "Year 1 (Retake)", _("Year 1 (Retake)")

    YEAR_2 = "Year 2", _("Year 2")
    YEAR_2R = "Year 2 (Retake)", _("Year 2 (Retake)")

    YEAR_3 = "Year 3", _("Year 3")
    YEAR_3R = "Year 3 (Retake)", _("Year 3 (Retake)")

    YEAR_4 = "Year 4", _("Year 4")
    YEAR_4R = "Year 4 (Retake)", _("Year 4 (Retake)")


class Enrollment(models.Model):
    """
    Fields:
        id: number;
        student: number;
        school: number;

        program_type: Program.Type;
        starts_as: <.Progression>;

        start_year: number;
        start_term: Target.Term;
        end_year?: number;
        end_term?: Target.Term | "";

        curriculum: Enrollment.Curriculum | "";
        majors: string;

    Related fields:
        grades: [GPA];
        class_ranks: [ClassRank];
    """

    class Curriculum(models.TextChoices):
        AP = "AP", _("AP")
        IBDP = "IBDP", _("IBDP")
        ALEVEL = "A-Level", _("A-Level")
        IGCSE = "IGCSE", _("IGCSE")
        GAOKAO = "Gaokao", _("Gaokao")

    student = models.ForeignKey(
        Student,
        related_name="enrollments",
        on_delete=models.CASCADE,
    )
    school = models.ForeignKey(
        School,
        related_name="enrollments",
        on_delete=models.RESTRICT,
    )

    program_type = models.CharField(max_length=100, choices=Program.Type.choices)
    starts_as = models.CharField(max_length=50, choices=Progression.choices)

    start_year = models.IntegerField()
    start_term = models.CharField(max_length=50, choices=Target.Term.choices)
    end_year = models.IntegerField(blank=True, null=True)
    end_term = models.CharField(max_length=50, blank=True, choices=Target.Term.choices)

    # For high school students
    curriculum = models.CharField(max_length=50, blank=True, choices=Curriculum.choices)

    # For college students
    majors = models.CharField(max_length=100, blank=True)

    def __str__(self) -> str:
        return f"{self.student} @ {self.school}"


class GPA(models.Model):
    """
    Fields:
        id: number;
        enrollment: number;
        progression: <.Progression>;
        term: <target.Target.Term>;
        value: number;
        scale: number;
        is_cumulative: boolean;
    """

    enrollment = models.ForeignKey(
        Enrollment,
        related_name="grades",
        on_delete=models.CASCADE,
    )

    progression = models.CharField(max_length=50, choices=Progression.choices)
    term = models.CharField(max_length=50, choices=Target.Term.choices)

    value = models.DecimalField(max_digits=6, decimal_places=3)
    scale = models.DecimalField(max_digits=6, decimal_places=3)

    is_cumulative = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "GPA"
        constraints = [
            models.UniqueConstraint(
                "enrollment",
                "progression",
                "term",
                "is_cumulative",
                name="unique_gpa_enrollment_progression_term_iscumulative",
            )
        ]

    def __str__(self) -> str:
        return f"{self.enrollment} | {self.progression} {self.term} GPA: {self.value}"

    @classmethod
    def of_student(cls, student_id: int):
        return cls.objects.filter(enrollment__student=student_id)


class ClassRank(models.Model):
    """
    Fields:
        id: number;
        enrollment: number;
        progression: <.Progression>;
        term: <target.Target.Term>;
        class_size?: number | null;
        rank?: number | null;
        top_x?: number | null;
    """

    enrollment = models.ForeignKey(
        Enrollment,
        related_name="class_ranks",
        on_delete=models.CASCADE,
    )

    progression = models.CharField(max_length=50, choices=Progression.choices)
    term = models.CharField(max_length=50, choices=Target.Term.choices)

    class_size = models.PositiveIntegerField(null=True, blank=True)
    rank = models.PositiveIntegerField(null=True, blank=True)
    # top-x percent of the class
    top_x = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "enrollment",
                "progression",
                "term",
                name="unique_classrank_enrollment_progression_term",
            ),
            models.CheckConstraint(
                check=Q(rank__isnull=False)
                | (Q(top_x__isnull=False) & Q(top_x__lte=100)),
                name="classrank_requires_either_rank_or_valid_topx",
            ),
            models.CheckConstraint(
                check=Q(rank__isnull=True) | Q(class_size__isnull=False),
                name="classrank_requires_classsize_if_given_rank",
            ),
        ]

    def __str__(self) -> str:
        prefix = f"{self.enrollment} | {self.progression} {self.term} Rank:"
        if self.rank is not None:
            return f"{prefix} {self.rank}/{self.class_size}"
        else:
            return f"{prefix} {self.top_x}%"

    @classmethod
    def of_student(cls, student_id: int):
        return cls.objects.filter(enrollment__student=student_id)


class BaseTest(models.Model):
    "Abstract base class for test models"

    class Meta:
        abstract = True

    student = models.ForeignKey(
        Student,
        related_name="%(class)s_scores",
        on_delete=models.CASCADE,
    )
    date = models.DateField(blank=True, null=True)
    comments = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.student.name} | {self.__class__.__name__}: {self.result}"

    @property
    @abstractmethod
    def result(self):
        pass


class TOEFL(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        reading: number;
        listening: number;
        speaking: number;
        writing: number;

    Computed fields:
        result: number;
    """

    reading = models.PositiveSmallIntegerField()
    listening = models.PositiveSmallIntegerField()
    speaking = models.PositiveSmallIntegerField()
    writing = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name_plural = "TOEFL"

    @property
    def result(self):
        return sum([self.reading, self.listening, self.speaking, self.writing])


class IELTS(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        listening: number;
        reading: number;
        writing: number;
        speaking: number;

    Computed fields:
        result: number;
    """

    listening = models.DecimalField(max_digits=2, decimal_places=1)
    reading = models.DecimalField(max_digits=2, decimal_places=1)
    writing = models.DecimalField(max_digits=2, decimal_places=1)
    speaking = models.DecimalField(max_digits=2, decimal_places=1)

    class Meta:
        verbose_name_plural = "IELTS"

    @property
    def result(self):
        total = sum([self.listening, self.reading, self.writing, self.speaking])
        return Decimal(int(total / 2 + Decimal(0.5)) / 2)


class DET(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        overall: number;
        literacy?: number | null;
        comprehension?: number | null;
        conversation?: number | null;
        production?: number | null;

    Computed fields:
        result: number;
    """

    overall = models.PositiveSmallIntegerField()
    literacy = models.PositiveSmallIntegerField(null=True, blank=True)
    comprehension = models.PositiveSmallIntegerField(null=True, blank=True)
    conversation = models.PositiveSmallIntegerField(null=True, blank=True)
    production = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "DET"

    @property
    def result(self):
        return self.overall


class SAT(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        ebrw: number;
        math: number;

    Computed fields:
        result: number;
    """

    ebrw = models.PositiveSmallIntegerField()
    math = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name_plural = "SAT"

    def result(self):
        return self.ebrw + self.math


class ACT(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        english: number;
        math: number;
        reading: number;
        science: number;
        writing?: number;

    Computed fields:
        result: number;
    """

    english = models.PositiveSmallIntegerField()
    math = models.PositiveSmallIntegerField()
    reading = models.PositiveSmallIntegerField()
    science = models.PositiveSmallIntegerField()
    writing = models.PositiveSmallIntegerField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "ACT"

    @property
    def result(self):
        total = sum([self.math, self.science, self.english, self.reading])
        return round(Decimal(total / 4) + Decimal(0.1))


class AP(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        subject: string;
        score: number;

    Computed fields:
        result: number;
    """

    subject = models.CharField(max_length=100)
    score = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name_plural = "AP"

    @property
    def result(self):
        return self.score


class GRE(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        verbal: number;
        quant: number;
        writing: number;

    Computed fields:
        result: number;
    """

    verbal = models.PositiveSmallIntegerField()
    quant = models.PositiveSmallIntegerField()
    writing = models.DecimalField(max_digits=2, decimal_places=1)

    class Meta:
        verbose_name_plural = "GRE"

    @property
    def result(self):
        return self.verbal + self.quant
