# Generated by Django 4.2.4 on 2023-08-18 13:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_application_submitting_act_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='student',
            old_name='name_in_chinese',
            new_name='last_name_first',
        ),
    ]