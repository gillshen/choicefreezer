from django.contrib import admin
from . import models


@admin.register(models.School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = "id", "name", "abbreviation", "type", "country"


@admin.register(models.SchoolRanking)
class SchoolRankingAdmin(admin.ModelAdmin):
    list_display = "id", "school", "rank", "source", "pub_year"


@admin.register(models.Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = "id", "host_schools", "type", "name", "degree"

    def host_schools(self, instance) -> str:
        return models.School.format_names(instance.schools.all())


@admin.register(models.Target)
class TargetAdmin(admin.ModelAdmin):
    list_display = "id", "program", "year", "term"


@admin.register(models.TargetRequirements)
class TargetRequirementsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "target_id",
        "target",
        "requires_sat_or_act",
        "requires_gre",
        "requires_english_proficiency",
        "number_required_recs",
        "requires_writing",
        "requires_interview",
        "updated",
    )

    def target_id(self, instance):
        return instance.target.id


@admin.register(models.SubTarget)
class SubTargetAdmin(admin.ModelAdmin):
    list_display = "id", "target", "admission_plan", "deadline", "deadline_timezone"
