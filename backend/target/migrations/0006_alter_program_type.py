# Generated by Django 4.2.4 on 2023-08-21 03:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('target', '0005_alter_program_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='program',
            name='type',
            field=models.CharField(choices=[('Pre-College', 'Pre-College'), ('UG Freshman', 'UG Freshman'), ('UG Transfer', 'UG Transfer'), ('Master', 'Master'), ('Doctorate', 'Doctorate'), ('Other', 'Other')], max_length=100),
        ),
    ]
