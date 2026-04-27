from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring', '0007_youth_sports_competition_levels'),
    ]

    operations = [
        migrations.AddField(
            model_name='youth',
            name='organizations_joined',
            field=models.TextField(blank=True, default='[]'),
        ),
    ]
