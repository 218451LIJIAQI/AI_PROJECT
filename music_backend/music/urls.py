from django.urls import path
from .views import (
    # Authentication views
    register_user,
    login_user,
    logout_user,
    check_auth,
    # Music views (existing)
    get_moods,
    get_songs_by_mood,
    detect_mood_from_text,
    detect_mood_from_image,  # ✅ 添加图像情绪识别视图
)

urlpatterns = [
    # Authentication endpoints
    path('api/auth/register/', register_user, name='register_user'),
    path('api/auth/login/', login_user, name='login_user'),
    path('api/auth/logout/', logout_user, name='logout_user'),
    path('api/auth/check/', check_auth, name='check_auth'),
    
    # Music endpoints (existing)
    path('api/moods/', get_moods, name='get_moods'),
    path('api/songs/', get_songs_by_mood, name='get_songs_by_mood'),
    path('api/detect-text-mood/', detect_mood_from_text, name='detect_text_mood'),
    path('api/detect-image-emotion/', detect_mood_from_image, name='detect_mood_from_image'),  # ✅ 新接口
]