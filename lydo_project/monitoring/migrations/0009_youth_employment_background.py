from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring', '0008_youth_organizations_joined'),
    ]

    operations = [
        migrations.AddField(
            model_name='youth',
            name='employment_company_name',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AddField(
            model_name='youth',
            name='employment_company_address',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
