# Generated by Django 5.1.7 on 2025-04-09 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storage', '0004_alter_file_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='file',
            field=models.FileField(upload_to='user_files/%Y/%m/%d/'),
        ),
    ]
