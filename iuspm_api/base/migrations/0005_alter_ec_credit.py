# Generated by Django 5.1 on 2024-09-20 07:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_remove_note_year_alter_note_updated_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ec',
            name='credit',
            field=models.FloatField(default=1),
        ),
    ]
