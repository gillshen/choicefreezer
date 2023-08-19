from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CfUserCreationForm, CfUserChangeForm
from .models import CfUser


class CfUserAdmin(UserAdmin):
    ordering = ["username"]
    list_display = (
        "username",
        "id",
        "email",
        "department",
        "is_active",
        "is_staff",
        "is_superuser",
    )

    form = CfUserChangeForm
    add_form = CfUserCreationForm
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ["department", "public_banner", "private_banner"]}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ["department", "public_banner", "private_banner"]}),
    )


admin.site.register(CfUser, CfUserAdmin)
