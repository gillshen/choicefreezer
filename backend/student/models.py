from abc import abstractmethod
from decimal import Decimal
from contextlib import suppress

from django.db import models
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from core.models import Student, Progression, Application
from target.models import School, Program, Target


class Enrollment(models.Model):
    """
    Fields:
        id: number;
        student: number;
        school: number;

        program_type: Program.Type;
        starting_progression: <core.Progression>;

        start_date: string; // date
        end_date?: string; // date

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
    starting_progression = models.CharField(max_length=50, choices=Progression.choices)

    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)

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
        progression: <core.Progression>;
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
        verbose_name_plural = "GPAs"
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
        progression: <core.Progression>;
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

        reading?: number | null;
        listening?: number | null;
        speaking?: number | null;
        writing?: number | null;

    Computed fields:
        result: number;
    """

    reading = models.SmallIntegerField(blank=True, null=True)
    listening = models.SmallIntegerField(blank=True, null=True)
    speaking = models.SmallIntegerField(blank=True, null=True)
    writing = models.SmallIntegerField(blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="toefl_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "TOEFL scores"

    @property
    def result(self) -> int | None:
        with suppress(TypeError):
            return sum([self.reading, self.listening, self.speaking, self.writing])


class IELTS(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        listening?: number | null;
        reading?: number | null;
        writing?: number | null;
        speaking?: number | null;

    Computed fields:
        result: number;
    """

    listening = models.DecimalField(
        max_digits=2, decimal_places=1, blank=True, null=True
    )
    reading = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    writing = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    speaking = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        blank=True,
        null=True,
    )

    used_for = models.ManyToManyField(
        Application,
        related_name="ielts_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "IELTS scores"

    @property
    def result(self) -> Decimal | None:
        with suppress(TypeError):
            total = sum([self.listening, self.reading, self.writing, self.speaking])
            return Decimal(int(total / 2 + Decimal(0.5)) / 2)


class DET(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        overall?: number | null;
        literacy?: number | null;
        comprehension?: number | null;
        conversation?: number | null;
        production?: number | null;

    Computed fields:
        result: number;
    """

    overall = models.PositiveSmallIntegerField(blank=True, null=True)
    literacy = models.PositiveSmallIntegerField(blank=True, null=True)
    comprehension = models.PositiveSmallIntegerField(blank=True, null=True)
    conversation = models.PositiveSmallIntegerField(blank=True, null=True)
    production = models.PositiveSmallIntegerField(blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="det_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "DET scores"

    @property
    def result(self) -> int | None:
        return self.overall


class SAT(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        ebrw?: number | null;
        math?: number | null;

    Computed fields:
        result: number;
    """

    ebrw = models.PositiveSmallIntegerField(blank=True, null=True)
    math = models.PositiveSmallIntegerField(blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="sat_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "SAT scores"

    @property
    def result(self) -> int | None:
        with suppress(TypeError):
            return self.ebrw + self.math


class ACT(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        english?: number | null;
        math?: number | null;
        reading?: number | null;
        science?: number | null;
        writing?: number | null;

    Computed fields:
        result: number;
    """

    english = models.PositiveSmallIntegerField(blank=True, null=True)
    math = models.PositiveSmallIntegerField(blank=True, null=True)
    reading = models.PositiveSmallIntegerField(blank=True, null=True)
    science = models.PositiveSmallIntegerField(blank=True, null=True)
    writing = models.PositiveSmallIntegerField(blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="act_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "ACT scores"

    @property
    def result(self) -> Decimal | None:
        with suppress(TypeError):
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
        score?: number | null;

    Computed fields:
        result: number;
    """

    subject = models.CharField(max_length=100)
    score = models.PositiveSmallIntegerField(blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="ap_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "AP scores"

    @property
    def result(self) -> int | None:
        return self.score


class IBPredicted(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        subject: string;
        grade?: number | null;

    Computed fields:
        result: number;
    """

    subject = models.CharField(max_length=100)
    grade = models.PositiveSmallIntegerField(blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="ib_predicted_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "IB predicted grades"

    @property
    def result(self) -> int | None:
        return self.grade


class IBFinal(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        subject: string;
        grade?: number | null;

    Computed fields:
        result: number;
    """

    subject = models.CharField(max_length=100)
    grade = models.PositiveSmallIntegerField(blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="ib_final_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "IB final grades"

    @property
    def result(self) -> int | None:
        return self.grade


class AlevelPredicted(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        subject: string;
        percentage?: number | null;
        grade?: string;

    Computed fields:
        result: number;
    """

    subject = models.CharField(max_length=100)
    percentage = models.SmallIntegerField(blank=True, null=True)
    grade = models.CharField(max_length=10, blank=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="alevel_predicted_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "A-level predicted grades"

    @property
    def result(self) -> str | None:
        return self.grade or None


class AlevelFinal(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        subject: string;
        percentage?: number | null;
        grade?: string;

    Computed fields:
        result: number;
    """

    subject = models.CharField(max_length=100)
    percentage = models.SmallIntegerField(blank=True, null=True)
    grade = models.CharField(max_length=10, blank=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="alevel_final_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "A-level final grades"

    @property
    def result(self) -> str | None:
        return self.grade or None


class GRE(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        verbal?: number | null;
        quant?: number | null;
        writing?: number | null;

    Computed fields:
        result: number;
    """

    verbal = models.PositiveSmallIntegerField(blank=True, null=True)
    quant = models.PositiveSmallIntegerField(blank=True, null=True)
    writing = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="gre_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "GRE scores"

    @property
    def result(self) -> int | None:
        with suppress(TypeError):
            return self.verbal + self.quant


class GMAT(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        total?: number | null;
        verbal?: number | null;
        quant?: number | null;
        reasoning?: number | null;
        writing?: number | null;

    Computed fields:
        result: number;
    """

    total = models.PositiveSmallIntegerField(blank=True, null=True)
    verbal = models.SmallIntegerField(blank=True, null=True)
    quant = models.SmallIntegerField(blank=True, null=True)
    reasoning = models.SmallIntegerField(blank=True, null=True)
    writing = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="gmat_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "GMAT scores"

    @property
    def result(self) -> int | None:
        return self.total


class LSAT(BaseTest):
    """
    Fields:
        id: number;
        student: number;
        date?: string | null; // date
        comments?: string;

        total?: number | null;

    Computed fields:
        result: number;
    """

    total = models.PositiveSmallIntegerField(blank=True, null=True)

    used_for = models.ManyToManyField(
        Application,
        related_name="lsat_submitted",
        blank=True,
    )

    class Meta:
        verbose_name_plural = "LSAT scores"

    @property
    def result(self) -> int | None:
        return self.total
