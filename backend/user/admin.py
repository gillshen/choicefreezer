from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CfUserCreationForm, CfUserChangeForm
from .models import CfUser


class CfUserAdmin(UserAdmin):
    add_form = CfUserCreationForm
    form = CfUserChangeForm
    list_display = "username", "id", "email", "department", "is_active", "is_superuser"
    ordering = ["username"]


admin.site.register(CfUser, CfUserAdmin)
