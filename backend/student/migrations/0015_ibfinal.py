# Generated by Django 4.2.4 on 2023-09-14 11:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0014_rename_ib_ibpredicted_alter_ibpredicted_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='IBFinal',
            fields=[
                ('ibpredicted_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='student.ibpredicted')),
            ],
            options={
                'verbose_name_plural': 'IB final scores',
            },
            bases=('student.ibpredicted',),
        ),
    ]