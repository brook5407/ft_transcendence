# Generated by Django 5.0.3 on 2024-09-01 04:21

import base.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game_history', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamehistory',
            name='id',
            field=base.fields.RandomStringIDField(editable=False, max_length=32, primary_key=True, serialize=False, unique=True),
        ),
    ]
