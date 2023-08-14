from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from . import models


class UserProfileInline(admin.StackedInline):
    model = models.UserProfile
    can_delete = False
    verbose_name_plural = "profile"


class UserAdmin(BaseUserAdmin):
    inlines = [UserProfileInline]
    list_display = "username", "id", "department", "is_active", "is_superuser"

    def department(self, instance):
        return instance.profile.department


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
