from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring', '0006_youth_talent_sports_preferences'),
    ]

    operations = [
        migrations.AddField(
            model_name='youth',
            name='sports_competition_levels',
            field=models.TextField(blank=True, default='[]'),
        ),
    ]
