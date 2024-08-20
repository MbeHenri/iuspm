# Generated by Django 5.1 on 2024-08-20 13:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="note",
            old_name="value",
            new_name="cc",
        ),
        migrations.AddField(
            model_name="note",
            name="ef",
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name="note",
            name="ec",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="notesEC",
                to="base.ec",
            ),
        ),
        migrations.AlterField(
            model_name="schoolyear",
            name="number",
            field=models.IntegerField(default=2024, unique=True),
        ),
    ]