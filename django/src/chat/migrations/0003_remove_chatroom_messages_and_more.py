# Generated by Django 5.0.3 on 2024-09-12 08:06

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_remove_chatmessage_receiver_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chatroom',
            name='messages',
        ),
        migrations.AddIndex(
            model_name='activechatroom',
            index=models.Index(fields=['user'], name='chat_active_user_id_ba77e4_idx'),
        ),
        migrations.AddIndex(
            model_name='activechatroom',
            index=models.Index(fields=['room'], name='chat_active_room_id_f9011e_idx'),
        ),
        migrations.AddIndex(
            model_name='chatmessage',
            index=models.Index(fields=['room'], name='chat_chatme_room_id_95b551_idx'),
        ),
        migrations.AddIndex(
            model_name='chatmessage',
            index=models.Index(fields=['sender'], name='chat_chatme_sender__3a9411_idx'),
        ),
    ]
