# Generated by Django 4.2.4 on 2023-08-31 23:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('writing', '0004_rename_about_student_userlog_relevant_student'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='userlog',
            options={'get_latest_by': ['pinned', 'date'], 'ordering': ['-pinned', '-date']},
        ),
        migrations.RemoveIndex(
            model_name='userlog',
            name='writing_use_pinned_4c54cd_idx',
        ),
        migrations.AddIndex(
            model_name='userlog',
            index=models.Index(fields=['-pinned', '-date'], name='writing_use_pinned_2a4f32_idx'),
        ),
    ]
