# Generated by Django 4.2.4 on 2023-08-28 15:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0010_alter_act_used_for_alter_ap_used_for_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='StudentLog',
        ),
    ]
