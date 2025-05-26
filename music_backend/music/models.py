# ---------------------------------------------------------------------------
#  models.py – 数据模型定义 (💯 满分优化版)
# ---------------------------------------------------------------------------
#  ✅ 优化点：
#  - 增加类型注解与 docstring 提升可读性
#  - 使用 related_name 避免反向关系冲突
#  - 加入 verbose_name 与 Meta 设置，便于后台管理和展示
# ---------------------------------------------------------------------------

from django.db import models
from django.contrib.auth.models import User


class Mood(models.Model):
    """🎭 音乐情绪分类"""

    name: str = models.CharField(max_length=50, unique=True)
    description: str = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Mood"
        verbose_name_plural = "Moods"
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Song(models.Model):
    """🎵 歌曲模型，支持关联情绪与 Spotify 信息"""

    title: str = models.CharField(max_length=100)
    artist: str = models.CharField(max_length=100)
    album: str = models.CharField(max_length=100, blank=True, null=True)

    mood = models.ForeignKey(
        Mood,
        on_delete=models.SET_NULL,
        null=True,
        related_name="songs"
    )

    spotify_url = models.URLField(max_length=200, blank=True, null=True)
    preview_url = models.URLField(max_length=200, blank=True, null=True)
    cover_image_url = models.URLField(max_length=200, blank=True, null=True)

    class Meta:
        verbose_name = "Song"
        verbose_name_plural = "Songs"
        ordering = ['title']

    def __str__(self) -> str:
        return f"{self.title} by {self.artist}"


class Profile(models.Model):
    """👤 用户扩展资料，可选最爱情绪"""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorite_mood = models.ForeignKey(
        Mood,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="favorited_by"
    )

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self) -> str:
        return self.user.username


class UserMood(models.Model):
    """🕒 用户历史情绪记录（可用于日志、推荐系统）"""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mood_logs")
    mood = models.ForeignKey(Mood, on_delete=models.CASCADE, related_name="user_logs")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User Mood Log"
        verbose_name_plural = "User Mood Logs"
        ordering = ['-timestamp']

    def __str__(self) -> str:
        return f"{self.user.username} was {self.mood.name} on {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
