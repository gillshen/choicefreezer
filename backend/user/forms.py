from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CfUser


class CfUserCreationForm(UserCreationForm):
    class Meta:
        model = CfUser
        fields = "__all__"


class CfUserChangeForm(UserChangeForm):
    class Meta:
        model = CfUser
        fields = "__all__"
