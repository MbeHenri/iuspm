# Generated by Django 5.1 on 2024-09-20 07:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_ec_credit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ec',
            name='label',
            field=models.CharField(max_length=100),
        ),
    ]
