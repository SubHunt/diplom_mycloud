# Удаляем токены при удалении пользователя
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

User = get_user_model()


@receiver(pre_delete, sender=User)
def delete_user_tokens(sender, instance, **kwargs):
    tokens = OutstandingToken.objects.filter(user=instance)
    if tokens.exists():
        tokens.delete()
