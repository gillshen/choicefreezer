# Generated by Django 4.2.4 on 2023-08-17 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cfuser',
            name='department',
            field=models.CharField(choices=[('顾问', '顾问'), ('文案', '文案'), ('顾问+', '顾问+'), ('文案+', '文案+'), ('顾问/文案', '顾问/文案'), ('顾问/文案+', '顾问/文案+')], max_length=50),
        ),
    ]
