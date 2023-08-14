from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

from core.models import Student, Application


class UserProfile(models.Model):
    """
    Fields:
        id: number;
        user: number;
        department: <UserProfile.Department>;
        public_banner?: string;
        private_banner?: string;

    Computed fields:
        username: string;
        is_active: boolean;
        current_students: [core.Student];
        past_students: [core.Student];
        applications: [core.Applications];
    """

    class Department(models.TextChoices):
        PLANNING = "顾问", _("顾问")
        ESSAY_ADVISING = "文案", _("文案")
        PLANNING_PLUS = "顾问+", _("顾问+")
        ESSAY_ADVISING_PLUS = "文案+", _("文案+")

    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    department = models.CharField(max_length=50, choices=Department.choices)

    public_banner = models.CharField(max_length=100, blank=True)
    private_banner = models.CharField(max_length=100, blank=True)

    def __str__(self) -> str:
        return self.username

    @property
    def username(self):
        return self.user.username

    @property
    def is_active(self):
        return self.user.is_active

    @property
    def current_students(self):
        return Student.filter(username=self.username, current_for_user="true")

    @property
    def past_students(self):
        return Student.filter(username=self.username).difference(self.current_students)

    @property
    def applications(self):
        return Application.filter(username=self.username)
