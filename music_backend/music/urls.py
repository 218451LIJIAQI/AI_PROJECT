from django.urls import path
from .views import (
    get_moods,
    get_songs_by_mood,
    detect_mood_from_text,
    detect_mood_from_image,  # ✅ 添加图像情绪识别视图
)

urlpatterns = [
    path('api/moods/', get_moods, name='get_moods'),
    path('api/songs/', get_songs_by_mood, name='get_songs_by_mood'),
    path('api/detect-text-mood/', detect_mood_from_text, name='detect_text_mood'),
    path('api/detect-image-emotion/', detect_mood_from_image, name='detect_mood_from_image'),  # ✅ 新接口
]