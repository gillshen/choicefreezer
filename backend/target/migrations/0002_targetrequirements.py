# Generated by Django 4.2.4 on 2023-08-06 08:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('target', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TargetRequirements',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('minimum_gpa', models.TextField(blank=True, max_length=5000)),
                ('transcripts', models.TextField(blank=True, max_length=5000)),
                ('requires_english_proficiency', models.BooleanField(blank=True, null=True)),
                ('toefl_report_code', models.CharField(blank=True, max_length=50)),
                ('ielts_mailing_address', models.TextField(blank=True, max_length=200)),
                ('english_proficiency_details', models.TextField(blank=True, max_length=5000)),
                ('number_required_recs', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('number_optional_recs', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('rec_details', models.TextField(blank=True, max_length=5000)),
                ('writing', models.TextField(blank=True, max_length=10000)),
                ('interview', models.TextField(blank=True, max_length=5000)),
                ('financial_docs', models.TextField(blank=True, max_length=5000)),
                ('requires_sat_or_act', models.BooleanField(blank=True, null=True)),
                ('sat_report_code', models.CharField(blank=True, max_length=50)),
                ('act_report_code', models.CharField(blank=True, max_length=50)),
                ('sat_or_act_details', models.TextField(blank=True, max_length=5000)),
                ('requires_wes', models.BooleanField(blank=True, null=True)),
                ('non_wes_evaluation', models.TextField(blank=True, max_length=5000)),
                ('requires_gre', models.BooleanField(blank=True, null=True)),
                ('gre_institution_code', models.CharField(blank=True, max_length=50)),
                ('gre_department_code', models.CharField(blank=True, max_length=50)),
                ('gre_details', models.TextField(blank=True, max_length=5000)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('target', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='requirements', to='target.target')),
            ],
            options={
                'verbose_name_plural': 'target requirements',
            },
        ),
    ]
