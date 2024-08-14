from django.db import models

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
    filiere = models.ForeignKey(
        Sector, on_delete=models.CASCADE, related_name="students"
    )

    def __str__(self):
        return self.name


class SchoolYear(models.Model):
    number = models.IntegerField(unique=True)

    @property
    def label(self):
        return f"{self.number}/{self.number +1}"


class Level(models.Model):
    number = models.IntegerField(unique=True)

    @property
    def label(self):
        return f"Niv {self.number}"

    @property
    def cycle(self):
        if self.number >= 1 and self.number <= 3:
            return "Licence"
        elif self.number >= 4 and self.number <= 5:
            return "Master"
        elif self.number > 5:
            return "Doctorat"
        return "Inconnu"

    def __str__(self):
        return self.label


class StudentLevel(models.Model):
    year = models.ForeignKey(
        SchoolYear, on_delete=models.CASCADE, related_name="studentYears"
    )
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="studentYears"
    )
    level = models.ForeignKey(
        Level, on_delete=models.CASCADE, related_name="studentYears"
    )

    def __str__(self):
        return f"{self.student} / {self.level} / {self.year}"


class Speciality(models.Model):
    label = models.CharField(unique=True, max_length=50)

    def __str__(self):
        return self.label


class Semester(models.Model):
    number = models.IntegerField(unique=True)

    @property
    def label(self):
        return f"Semestre {self.number}"

    def __str__(self):
        return self.label


class UE(models.Model):
    code = models.CharField(max_length=25, unique=True)
    label = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.code}: {self.label}"


class EC(models.Model):
    code = models.CharField(max_length=25, unique=True, blank=True)
    label = models.CharField(max_length=25)

    def __str__(self):
        return f"{self.code}: {self.label}"
