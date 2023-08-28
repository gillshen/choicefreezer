from django.db import models
from user.models import CfUser
from core.models import Student


class UserLog(models.Model):
    """
    Fields:
        id: number;
        author: number; // CfUser
        title: string;
        text?: string;
        public: boolean;
        pinned: boolean;
        shared: boolean;
        about_student: number | null; // Student
        updated: string; // datetime
    """

    author = models.ForeignKey(CfUser, related_name="logs", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    text = models.TextField(max_length=1000, blank=True)

    public = models.BooleanField(default=False)
    pinned = models.BooleanField(default=False)

    # If an entry is to be shared, it should be public,
    # but the database does not enforce this requirement
    shared = models.BooleanField(default=False)

    about_student = models.ForeignKey(
        Student,
        related_name="logs",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    updated = models.DateTimeField(auto_now=True)

    class Meta:
        # Pinned logs before non-pinned ones, then order by recency
        ordering = ["-pinned", "-updated"]
        get_latest_by = ["pinned", "updated"]

        indexes = [
            models.Index(fields=["-pinned", "-updated"]),
        ]

    def __str__(self) -> str:
        return f"{self.author.username}: {self.title}"
