from django.contrib import admin
from . import models


@admin.register(models.UserLog)
class UserLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "author",
        "title",
        "public",
        "pinned",
        "shared",
        "about_student",
        "updated",
    )
