# Generated by Django 3.2.12 on 2023-02-26 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configure', '0003_auto_20230226_1013'),
    ]

    operations = [
        migrations.AddField(
            model_name='difficulty',
            name='score',
            field=models.IntegerField(default=True),
            preserve_default=False,
        ),
    ]
