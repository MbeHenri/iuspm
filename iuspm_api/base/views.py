# from django.shortcuts import render
from datetime import datetime
import json
from django.http import HttpResponse

# from rest_framework.views import APIView
from rest_framework import status, viewsets
from rest_framework.decorators import action

from base.generate.rn import year as rn_total, semester as rn_semester
from base.models import SchoolYear, Student
from base.serializers import StudentSerializer
from base.utils.other import get_student_notes


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    @action(detail=True, methods=["get"], url_path="rn/(?P<year>\d{4})")
    def rn(self, request, pk=None, year=None):
        try:
            # Récupération de l'étudiant à partir de son id
            student = self.get_object()

            # Récupération de ses notes pour un semestre donné ou pour tous les semestres durant l'année donnée
            datas = get_student_notes(
                student,
                int(year) if year else datetime.now().year,
            )

            # creation de la reponse
            response = HttpResponse(content_type="application/pdf")

            # Construction du relevé de notes
            rn_total.RN(student, datas, response)

            return response

        except Student.DoesNotExist:
            return HttpResponse(
                json.dumps({"detail": "Student not found"}),
                status=status.HTTP_404_NOT_FOUND,
                content_type="json",
            )
        except SchoolYear.DoesNotExist:
            return HttpResponse(
                json.dumps({"detail": "Transcript is not available for tnis year"}),
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
                content_type="json",
            )

    @action(
        detail=True, methods=["get"], url_path="rn/(?P<year>\d{4})/(?P<semester>[12])"
    )
    def rn_semester(self, request, pk=None, year=None, semester=None):
        try:
            # Récupération de l'étudiant à partir de son id
            student = self.get_object()

            # Récupération de ses notes pour un semestre donné ou pour tous les semestres durant l'année donnée
            print("semester ", semester)
            datas = get_student_notes(
                student,
                int(year) if year else datetime.now().year,
                semester=int(semester) if semester else None,
            )

            # creation de la reponse
            response = HttpResponse(content_type="application/pdf")

            # Construction du relevé de notes
            rn_semester.RN(student, datas, response)

            return response

        except Student.DoesNotExist:
            return HttpResponse(
                json.dumps({"detail": "Student not found"}),
                status=status.HTTP_404_NOT_FOUND,
                content_type="json",
            )

        except SchoolYear.DoesNotExist:
            return HttpResponse(
                json.dumps({"detail": "Transcript is not available for tnis year"}),
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
                content_type="json",
            )
