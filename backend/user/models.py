from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    Fields:
        user: number;
        department: <UserProfile.Department>;
        public_banner?: string;
        private_banner?: string;
    """

    class Department(models.TextChoices):
        G = "顾问", _("顾问")
        W = "文案", _("文案")
        G_PLUS = "顾问+", _("顾问+")
        W_PLUS = "文案+", _("文案+")

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=50, choices=Department.choices)

    public_banner = models.CharField(max_length=100, blank=True)
    private_banner = models.CharField(max_length=100, blank=True)

    def __str__(self) -> str:
        return self.user.username
