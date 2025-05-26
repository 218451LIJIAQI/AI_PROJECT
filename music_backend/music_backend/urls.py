# ---------------------------------------------------------------------------
#  music/urls.py – URLConf (💯 满分版本)
# ---------------------------------------------------------------------------
#  说明：
#  1. 统一风格：import 同行，路径全部以 api/ 开头。
#  2. 预留人脸情绪识别接口，可随时解注释启用。
#  3. 无分号结尾，遵守 Python PEP8。
# ---------------------------------------------------------------------------

from django.urls import path

from music import views
  # 统一从 views 导入，保持简洁

urlpatterns = [
    path("api/moods/", views.get_moods, name="get_moods"),
    path("api/songs/", views.get_songs_by_mood, name="get_songs_by_mood"),
    path("api/detect-text-mood/", views.detect_mood_from_text, name="detect_text_mood"),
    # path("api/detect-face-mood/", views.detect_mood_from_face, name="detect_face_mood"),
]
