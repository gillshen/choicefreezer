# Generated by Django 4.2.4 on 2023-09-25 07:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_remove_applicationlog_unique_applicationlog_application_status_comments_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='applicationlog',
            name='status',
            field=models.CharField(choices=[('Started', 'Started'), ('Ready to Submit', 'Ready to Submit'), ('Submitted', 'Submitted'), ('Under Review', 'Under Review'), ('Deferred', 'Deferred'), ('On Waitlist', 'On Waitlist'), ('Admitted', 'Admitted'), ('Rejected', 'Rejected'), ('Offer Rescinded', 'Offer Rescinded'), ('Canceled', 'Canceled'), ('Withdrawn', 'Withdrawn'), ('Disqualified', 'Disqualified'), ('Application Closed', 'Application Closed'), ('Enrolled', 'Enrolled')], max_length=50),
        ),
    ]
