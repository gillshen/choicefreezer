from django.contrib import admin
from . import models


@admin.register(models.StudentLog)
class StudentLogAdmin(admin.ModelAdmin):
    list_display = "id", "student", "title", "pinned"


@admin.register(models.Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = "id", "student", "school", "program_type", "starts_as"


@admin.register(models.GPA)
class GPA_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "enrollment",
        "progression",
        "term",
        "value",
        "scale",
        "is_cumulative",
    )


@admin.register(models.ClassRank)
class ClassRankAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "enrollment",
        "progression",
        "term",
        "class_size",
        "rank",
        "top_x",
    )


@admin.register(models.TOEFL)
class TOEFL_Admin(admin.ModelAdmin):
    list_display = "id", "student", "result", "date"


@admin.register(models.IELTS)
class IELTS_Admin(admin.ModelAdmin):
    list_display = "id", "student", "result", "date"


@admin.register(models.DET)
class DET_Admin(admin.ModelAdmin):
    list_display = "id", "student", "result", "date"


@admin.register(models.SAT)
class SAT_Admin(admin.ModelAdmin):
    list_display = "id", "student", "result", "date"


@admin.register(models.ACT)
class ACT_Admin(admin.ModelAdmin):
    list_display = "id", "student", "result", "date"


@admin.register(models.AP)
class AP_Admin(admin.ModelAdmin):
    list_display = "id", "student", "subject", "score", "date"


@admin.register(models.GRE)
class GRE_Admin(admin.ModelAdmin):
    list_display = "id", "student", "result", "writing", "date"
