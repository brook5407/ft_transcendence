# Generated by Django 5.0.3 on 2024-09-19 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pong', '0011_alter_match_type'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tournamentplayer',
            options={'ordering': [models.ExpressionWrapper(models.OrderBy(models.F('last_match_at'), nulls_first=True), output_field=models.DateTimeField())]},
        ),
        migrations.AddField(
            model_name='tournamentplayer',
            name='last_match_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='match',
            name='type',
            field=models.CharField(blank=True, choices=[('P', 'PVP'), ('E', 'PVE'), ('F', 'Friend'), ('T', 'Tournament')], default='P', max_length=1, null=True),
        ),
        migrations.AlterField(
            model_name='tournamentroom',
            name='matches',
            field=models.ManyToManyField(related_name='tournament_matches', to='pong.match'),
        ),
        migrations.DeleteModel(
            name='TournamentMatch',
        ),
    ]
