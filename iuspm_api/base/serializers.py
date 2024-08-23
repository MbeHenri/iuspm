# serializers.py

from rest_framework import serializers
from django.utils import timezone
from .models import Sector, Speciality, Student, Note


class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = [
            "id",
            "label",
        ]


class NoteSerializer(serializers.ModelSerializer):
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "cc", "ef", "ec", "student", "updated_at", "is_normal"]

    def validate_cc(self, value):
        if not (0 <= value and value <= 20):
            raise serializers.ValidationError("cc must be in 0 to 20")
        return value

    def validate_ef(self, value):
        if not (0 <= value and value <= 20):
            raise serializers.ValidationError("ef must be in 0 to 20")
        return value

    def create(self, validated_data):
        # Lors de la création d'une note, on met à jour 'updated_at'
        validated_data["updated_at"] = timezone.now()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Lors de la mise à jour d'une note, on met à jour 'updated_at'
        validated_data["updated_at"] = timezone.now()
        return super().update(instance, validated_data)


class StudentSerializer(serializers.ModelSerializer):
    cycle = serializers.CharField(read_only=True)
    sector = SectorSerializer(read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "register_number",
            "sector",
            "current_level",
            "cycle",
        ]


class StudentDetailSerializer(serializers.ModelSerializer):
    cycle = serializers.CharField(read_only=True)
    sector = SectorSerializer(read_only=True)

    def get_sector(self, instance):
        # queryset = instance.products.filter(active= True)
        serializer = SectorSerializer(instance.sector)
        return serializer.data

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


class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = [
            "id",
            "label",
            "level",
        ]


class SectorDetailSerializer(serializers.ModelSerializer):
    # imbricate a Speciality serialisers for include fieltering
    # "specialities" is the realted name of the relation
    specialities = serializers.SerializerMethodField()

    def get_specialities(self, instance):
        # queryset = instance.products.filter(active= True)
        queryset = instance.specialities.filter(active=True)
        serializer = SpecialitySerializer(queryset, many=True)
        return serializer.data

    class Meta:
        model = Sector
        fields = ["id", "label", "specialities"]
