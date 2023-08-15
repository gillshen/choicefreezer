# Generated by Django 4.2.4 on 2023-08-15 15:50

from django.db import migrations, models
import django.db.models.functions.text


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_student_unique_student_names_dateofbirth'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='student',
            name='unique_student_names_dateofbirth',
        ),
        migrations.AddConstraint(
            model_name='student',
            constraint=models.UniqueConstraint(django.db.models.functions.text.Lower('last_name'), django.db.models.functions.text.Lower('first_name'), django.db.models.functions.text.Lower('last_name_romanized'), django.db.models.functions.text.Lower('first_name_romanized'), condition=models.Q(('date_of_birth__isnull', True)), name='unique_student_names'),
        ),
        migrations.AddConstraint(
            model_name='student',
            constraint=models.UniqueConstraint(django.db.models.functions.text.Lower('last_name'), django.db.models.functions.text.Lower('first_name'), django.db.models.functions.text.Lower('last_name_romanized'), django.db.models.functions.text.Lower('first_name_romanized'), models.F('date_of_birth'), condition=models.Q(('date_of_birth__isnull', False)), name='unique_student_names_dateofbirth'),
        ),
    ]
