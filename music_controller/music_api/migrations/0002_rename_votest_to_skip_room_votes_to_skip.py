# Generated by Django 4.1.7 on 2023-03-09 09:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('music_api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='votest_to_skip',
            new_name='votes_to_skip',
        ),
    ]
