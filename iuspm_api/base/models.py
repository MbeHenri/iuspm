from django.db import models
from django.utils.timezone import now

from base.utils.enums import Levels, Semesters
from base.utils.policy import get_cycle, get_grade, get_point, get_state
# Create your models here.


# modele de Filière
class Sector(models.Model):
    label = models.CharField(max_length=25, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.label


# modele d'étudiant
class Student(models.Model):
    name = models.CharField(max_length=255)
    # matricule
    register_number = models.CharField(max_length=25, unique=True)
    birth_place = models.CharField(max_length=25)

    inserted_at = models.DateTimeField(auto_now_add=True)
    birth_at = models.DateTimeField()
    sector = models.ForeignKey(
        Sector, on_delete=models.CASCADE, related_name="students"
    )

    current_level = models.IntegerField(
        choices=Levels,
        default=1,
    )

    @property
    def cycle(self):
        return get_cycle(self.current_level)

    def __str__(self):
        return self.name


class SchoolYear(models.Model):
    number = models.IntegerField(unique=True, default=now().year)

    @property
    def label(self):
        return f"{self.number}/{self.number +1}"

    def __str__(self):
        return self.label


class Speciality(models.Model):
    label = models.CharField(unique=True, max_length=50)
    level = models.IntegerField(choices=Levels)

    sector = models.ForeignKey(
        Sector, on_delete=models.CASCADE, related_name="specialities"
    )

    def __str__(self):
        return f"{self.label} / {self.level}"


class UE(models.Model):
    code = models.CharField(max_length=6, unique=True)
    label = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.code}: {self.label}"


class UEProgramming(models.Model):
    semester = models.IntegerField(
        choices=Semesters,
        default=1,
    )
    year = models.ForeignKey(
        SchoolYear, on_delete=models.CASCADE, related_name="uesProgramedYear"
    )
    ue = models.ForeignKey(UE, on_delete=models.CASCADE, related_name="uesProgramed")
    speciality = models.ForeignKey(
        Speciality, on_delete=models.CASCADE, related_name="uesProgramedSpeciality"
    )


class EC(models.Model):
    code = models.CharField(max_length=6, unique=True, blank=True)
    label = models.CharField(max_length=50)

    ue = models.ForeignKey(UE, on_delete=models.CASCADE, related_name="ecs")
    credit = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.code}: {self.label}"


class Note(models.Model):
    cc = models.FloatField(default=0)  # note de cc sur 20
    ef = models.FloatField(default=0)  # note de session normal ou rattrapage sur 20
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="notes")
    year = models.ForeignKey(
        SchoolYear, on_delete=models.CASCADE, related_name="notesYear"
    )
    ec = models.ForeignKey(EC, on_delete=models.CASCADE, related_name="notesEC")
    is_normal = models.BooleanField(default=True)
    inserted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(default=now())

    @property
    def value(self):  # note total sur 100
        return (3 * self.cc + 7 * self.ef) / 2

    @property
    def state(self):
        return get_state(self.value)

    @property
    def grade(self):
        return get_grade(self.value)

    @property
    def point(self):
        return get_point(self.value)
