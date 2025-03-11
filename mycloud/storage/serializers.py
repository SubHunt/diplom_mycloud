from rest_framework import serializers
from .models import File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'file', 'comment', 'size', 'link_download',
                  'published', 'lastload', 'slug', 'user']
