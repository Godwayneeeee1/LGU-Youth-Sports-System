from django.db import migrations


def ensure_is_unemployed_column(apps, schema_editor):
    Youth = apps.get_model('monitoring', 'Youth')
    table_name = Youth._meta.db_table
    column_name = Youth._meta.get_field('is_unemployed').column

    with schema_editor.connection.cursor() as cursor:
        columns = schema_editor.connection.introspection.get_table_description(cursor, table_name)

    existing_columns = set()
    for column in columns:
        column_name = getattr(column, 'name', None)
        if column_name is None and column:
            column_name = column[0]
        if column_name:
            existing_columns.add(column_name)
    if column_name in existing_columns:
        return

    schema_editor.add_field(Youth, Youth._meta.get_field('is_unemployed'))


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring', '0009_youth_employment_background'),
    ]

    operations = [
        migrations.RunPython(ensure_is_unemployed_column, migrations.RunPython.noop),
    ]
