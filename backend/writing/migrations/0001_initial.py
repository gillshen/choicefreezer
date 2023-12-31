# Generated by Django 4.2.4 on 2023-08-28 15:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0011_alter_applicationlog_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(max_length=100)),
                ('text', models.TextField(blank=True, max_length=1000)),
                ('public', models.BooleanField(default=False)),
                ('pinned', models.BooleanField(default=False)),
                ('shared', models.BooleanField(default=False)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('about_student', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='core.student')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-pinned', '-updated'],
                'get_latest_by': ['pinned', 'updated'],
                'indexes': [models.Index(fields=['-pinned', '-updated'], name='writing_use_pinned_4c54cd_idx')],
            },
        ),
    ]
