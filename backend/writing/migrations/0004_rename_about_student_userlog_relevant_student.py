# Generated by Django 4.2.4 on 2023-08-31 22:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('writing', '0003_userlog_date_alter_userlog_text_alter_userlog_title'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userlog',
            old_name='about_student',
            new_name='relevant_student',
        ),
    ]
