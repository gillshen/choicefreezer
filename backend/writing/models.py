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
        relevant_student: number | null; // Student
        updated: string; // datetime
    """

    author = models.ForeignKey(CfUser, related_name="logs", on_delete=models.CASCADE)

    date = models.DateField()
    title = models.CharField(max_length=100, blank=True)
    text = models.TextField(max_length=1000)

    public = models.BooleanField(default=False)
    pinned = models.BooleanField(default=False)

    # If an entry is to be shared, it should be public,
    # but the database does not enforce this requirement
    shared = models.BooleanField(default=False)

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
        ordering = ["-pinned", "-date"]
        get_latest_by = ["pinned", "date"]

        indexes = [
            models.Index(fields=["-pinned", "-date"]),
        ]

    def __str__(self) -> str:
        if len(self.text) > 20:
            display_text = f"{self.text[:17]}..."
        else:
            display_text = self.text
        return f"{self.author.username}: {display_text}"
