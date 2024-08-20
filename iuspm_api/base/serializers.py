# serializers.py

from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    cycle = serializers.CharField(read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "register_number",
            "birth_place",
            "inserted_at",
            "birth_at",
            "sector",
            "current_level",
            "cycle",
        ]
