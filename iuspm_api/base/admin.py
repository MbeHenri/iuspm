from django.contrib import admin
from base.models import (
    Student,
    Sector,
    UEProgramming,
    Note,
    Speciality,
    SchoolYear,
    UE,
    EC,
)

# Register your models here.


class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "register_number",
        "name",
        "birth_at",
        "birth_place",
        "current_level",
        "sector",
        "cycle",
    )


class SectorAdmin(admin.ModelAdmin):
    list_display = (
        "label",
        "description",
    )


class UEProgrammingAdmin(admin.ModelAdmin):
    list_display = ("code", "label", "year", "speciality", "semester")

    @admin.display(description="UE code")
    def code(self, obj):
        return obj.ue.code

    @admin.display(description="UE label")
    def label(self, obj):
        return obj.ue.label


class NoteAdmin(admin.ModelAdmin):
    list_display = ("student", "ue", "ec", "state")

    @admin.display(description="UE code")
    def ue(self, obj):
        return obj.ec.ue


class SpecialityAdmin(admin.ModelAdmin):
    list_display = ("label", "level", "sector")


class SchoolYearAdmin(admin.ModelAdmin):
    list_display = ("label",)


class UEAdmin(admin.ModelAdmin):
    list_display = ("code", "label")


class ECAdmin(admin.ModelAdmin):
    list_display = ("code", "label", "ue", "credit")


admin.site.register(Student, StudentAdmin)
admin.site.register(Sector, SectorAdmin)
admin.site.register(UEProgramming, UEProgrammingAdmin)
admin.site.register(Note, NoteAdmin)
admin.site.register(Speciality, SpecialityAdmin)
admin.site.register(UE, UEAdmin)
admin.site.register(EC, ECAdmin)
admin.site.register(SchoolYear, SchoolYearAdmin)
