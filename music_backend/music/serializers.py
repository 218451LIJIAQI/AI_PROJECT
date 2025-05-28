# ---------------------------------------------------------------------------
#  serializers.py – Django REST Framework 序列化器 (💯 满分版)
# ---------------------------------------------------------------------------
#  功能说明：
#  - MoodSerializer：序列化 Mood 数据模型。
#  - SongSerializer：序列化 Song 数据模型，并显示情绪名称（可扩展）。
#  优化点：
#  - 使用类型注解
#  - 保留字段设置为 '__all__' 方便灵活修改
# ---------------------------------------------------------------------------

from rest_framework import serializers
from .models import Mood, Song


class MoodSerializer(serializers.ModelSerializer):
    """🎭 序列化情绪模型（Mood）"""

    class Meta:
        model = Mood
        fields: str = '__all__'


class SongSerializer(serializers.ModelSerializer):
    """🎵 序列化歌曲模型（Song），默认包含所有字段"""

    mood = serializers.StringRelatedField()  # 可显示关联情绪名称

    class Meta:
        model = Song
        fields: str = '__all__'
