# Generated by Django 5.1.4 on 2024-12-16 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_user_role'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blog',
            name='photo_url',
        ),
        migrations.AddField(
            model_name='blog',
            name='photo',
            field=models.BinaryField(default=b''),
        ),
    ]
