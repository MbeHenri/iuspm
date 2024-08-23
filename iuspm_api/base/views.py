# from django.shortcuts import render
from datetime import datetime
import json
from django.http import HttpResponse

# from rest_framework.views import APIView
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from base.generate.rn import year as rn_total, semester as rn_semester
from base.models import SchoolYear, Student, Note
from base.serializers import NoteSerializer, StudentSerializer, StudentDetailSerializer
from base.utils.other import get_student_notes, get_student_notes_2


class DetailViewSetMixing:
    # spécific serializer for get detail
    detail_serializer_class = None

    # function for get serializer to use
    def get_serializer_class(self):
        if self.action == "retrieve" and self.detail_serializer_class is not None:
            return self.detail_serializer_class
        return super().get_serializer_class()


class StudentViewSet(DetailViewSetMixing, viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    detail_serializer_class = StudentDetailSerializer

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

    @action(detail=True, methods=["get"], url_path="note")
    def note(self, request, pk=None):
        try:
            # Récupération de l'étudiant à partir de son id
            student = self.get_object()
            datas = get_student_notes_2(student)
            return Response({"results": datas})

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


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
