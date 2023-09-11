from django.db import models
from django.db.models.functions import Lower
from django.utils.translation import gettext_lazy as _

from user.models import CfUser
from core.models import Student
from target.models import Program


class UserLog(models.Model):
    """
    Fields:
        id: number;
        author: number; // CfUser
        date: string; // date
        title: string;
        text?: string;
        pinned: boolean;
        shared: boolean;
        task_status: <TaskStatus>;
        task_due: string | null; // datetime
        relevant_student: number | null; // Student
        updated: string; // datetime
    """

    class TaskStatus(models.TextChoices):
        NONE = "", _("")
        TODO = "TODO", _("TODO")
        DONE = "Done", _("Done")

    author = models.ForeignKey(CfUser, related_name="logs", on_delete=models.CASCADE)

    date = models.DateField()
    title = models.CharField(max_length=100, blank=True)
    text = models.TextField(max_length=1000)

    pinned = models.BooleanField(default=False)
    shared = models.BooleanField(default=False)

    task_status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.NONE,
    )
    task_due = models.TimeField(null=True, blank=True)

    relevant_student = models.ForeignKey(
        Student,
        related_name="logs",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    updated = models.DateTimeField(auto_now=True)

    class Meta:
        # Pinned logs before non-pinned ones, then order by recency
        ordering = ["-pinned", "-date", "-updated"]
        get_latest_by = ["pinned", "date", "updated"]

        indexes = [
            models.Index(fields=["-pinned", "-date", "-updated"]),
        ]

    def __str__(self) -> str:
        if len(self.text) > 20:
            display_text = f"{self.text[:17]}..."
        else:
            display_text = self.text
        return f"{self.author.username}: {display_text}"


class EssayTag(models.Model):
    """
    Fields:
        id: number;
        name: string;
        owner: number;
    """

    name = models.CharField(max_length=50)

    # Tags not owned by any user are considered public
    owner = models.ForeignKey(
        CfUser,
        related_name="essay_tags",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower("name"),
                "owner",
                name="unique_tag_name_owner",
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} by {self.owner.username}"


class Essay(models.Model):
    """
    Fields:
        id: number;
        prompt?: string;
        content: string;
        title?: string;

        author?: Student;
        contributors?: CfUser[]; // many-to-many
        tags?: EssayTag[]; // many-to-many

        target_year?: number;
        submitted_to: Program[]; // many-to-many

        updated_by?: CfUser;
        updated: string; // datetime
    """

    prompt = models.CharField(max_length=1000, blank=True)

    title = models.CharField(max_length=200, blank=True)
    text = models.TextField(max_length=10000)

    author = models.ForeignKey(
        Student,
        related_name="essays",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    contributors = models.ManyToManyField(
        CfUser,
        related_name="contributed_essays",
        blank=True,
    )
    tags = models.ManyToManyField(EssayTag, related_name="essays", blank=True)

    target_year = models.IntegerField(blank=True, null=True)
    submitted_to = models.ManyToManyField(Program, related_name="essays", blank=True)

    updated_by = models.ForeignKey(
        CfUser,
        related_name="updated_essays",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.preview

    @property
    def preview(self):
        """
        Return the slice of text from the beginning up to the last word
        break in the first 300 characters.
        """
        preview_length = 300
        if len(self.text) <= preview_length:
            return self.text

        # Take the first 297 characters, making room for the ellipsis
        preview = self.text[: preview_length - 4]
        if (
            # If the 297th character is not a natural word break
            self.text[preview_length - 4] != " "
            # and there is at least one word break in the first 297 characters
            and (last_space_index := preview.rfind(" ")) > -1
        ):
            preview = preview[:last_space_index]

        return f"{preview} ..."
