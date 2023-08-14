from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import CfUserManager


class Department(models.TextChoices):
    PLANNING = "顾问", _("顾问")
    ESSAY_ADVISING = "文案", _("文案")
    PLANNING_PLUS = "顾问+", _("顾问+")
    ESSAY_ADVISING_PLUS = "文案+", _("文案+")


class CfUser(AbstractUser):
    # Additional fields
    department = models.CharField(max_length=50, choices=Department.choices)
    public_banner = models.CharField(max_length=100, blank=True)
    private_banner = models.CharField(max_length=100, blank=True)

    objects = CfUserManager()

    def __str__(self):
        return self.email

    @property
    def current_students(self):
        from core.models import Student

        return Student.filter(username=self.username, current_for_user="true")

    @property
    def past_students(self):
        from core.models import Student

        return Student.filter(username=self.username).difference(self.current_students)

    @property
    def applications(self):
        from core.models import Application

        return Application.filter(username=self.username)
