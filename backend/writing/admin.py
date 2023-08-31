from django.contrib import admin
from . import models


@admin.register(models.UserLog)
class UserLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "author",
        "date",
        "text",
        "public",
        "pinned",
        "shared",
        "relevant_student",
        "updated",
    )
