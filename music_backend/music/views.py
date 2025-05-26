# ---------------------------------------------------------------------------
#  views.py – Moodify Django REST API (💯 满分修订版)
# ---------------------------------------------------------------------------
#  说明：
#  • 保留原有 3 个 API 功能。
#  • 将 MOOD_MAP 与数据库中的情绪保持一致，避免返回无数据的情绪。
#  • 其余结构、错误处理保持不变。
# ---------------------------------------------------------------------------

from __future__ import annotations

from django.http import HttpRequest
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from textblob import TextBlob

from .models import Song, Mood
from .serializers import MoodSerializer, SongSerializer

# ---------------------------------------------------------------------------
# 🎵  Utility helpers
# ---------------------------------------------------------------------------

# 仅保留数据库实际存在的情绪，按极性阈值从高到低排序
MOOD_MAP: list[tuple[float, str]] = [
    (0.3, "Happy"),       # polarity ≥ 0.3
    (0.1, "Energetic"),   # 0.1 ≤ polarity < 0.3
    (0.0, "Calm"),        # 0   ≤ polarity < 0.1
    (-0.1, "Sad"),        # -0.1 ≤ polarity < 0
    # 其余全部归为 Party
]

def polarity_to_mood(polarity: float) -> str:
    """将 TextBlob polarity 映射为数据库中存在的情绪标签。"""
    for threshold, label in MOOD_MAP:
        if polarity >= threshold:
            return label
    return "Party"  # fallback mood


# ---------------------------------------------------------------------------
# 🎧  API Endpoints
# ---------------------------------------------------------------------------

@api_view(["GET"])
def get_moods(_: HttpRequest) -> Response:
    """返回所有可用情绪。"""
    moods = Mood.objects.all()
    serializer = MoodSerializer(moods, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_songs_by_mood(request: HttpRequest) -> Response:
    """根据情绪名称（不区分大小写）返回歌曲列表。"""
    mood_name = request.GET.get("mood", "").strip()
    if not mood_name:
        return Response({"error": "Missing 'mood' query parameter."},
                        status=status.HTTP_400_BAD_REQUEST)

    mood = Mood.objects.filter(name__iexact=mood_name).first()
    if not mood:
        return Response({"error": "Mood not found."},
                        status=status.HTTP_404_NOT_FOUND)

    songs = Song.objects.filter(mood=mood)
    serializer = SongSerializer(songs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def detect_mood_from_text(request: HttpRequest) -> Response:
    """使用 TextBlob 分析文本情绪并返回对应情绪标签。"""
    user_text: str = request.data.get("text", "").strip()
    if not user_text:
        return Response({"error": "No text provided."},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        polarity = TextBlob(user_text).sentiment.polarity
        detected_mood = polarity_to_mood(polarity)
        return Response({"mood": detected_mood, "polarity": polarity},
                        status=status.HTTP_200_OK)
    except Exception as exc:  # pragma: no cover
        return Response({"error": str(exc)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------------------------------------------------------------------------
# 🚧  (Optional) Face emotion detection – kept for future use
# ---------------------------------------------------------------------------
# from tensorflow.keras.models import load_model
# import cv2, numpy as np
# EMOTION_MODEL_PATH = Path(__file__).resolve().parent / "models" / "emotion_model.h5"
# emotion_model = load_model(EMOTION_MODEL_PATH)
#
# @api_view(["POST"])
# def detect_mood_from_face(request):
#     ...
# ---------------------------------------------------------------------------
