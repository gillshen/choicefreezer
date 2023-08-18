from django.contrib import admin
from . import models


@admin.register(models.CfProduct)
class CfProductAdmin(admin.ModelAdmin):
    list_display = "id", "name"


@admin.register(models.Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = "id", "name", "gender", "citizenship", "is_current"


@admin.register(models.Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = "id", "student", "type", "target_year", "status"


@admin.register(models.Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = "id", "contract", "cf_person", "role", "is_current", "end_date"


@admin.register(models.Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = "id", "student", "subtarget"


@admin.register(models.MajorChoice)
class MajorChoiceAdmin(admin.ModelAdmin):
    list_display = "id", "application", "major", "rank"


@admin.register(models.ApplicationLog)
class ApplicationLogAdmin(admin.ModelAdmin):
    list_display = "id", "application", "date", "status"
