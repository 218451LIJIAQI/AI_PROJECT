# ---------------------------------------------------------------------------
#  views.py – Moodify Django REST API (💯 满分修订版 + 图像情绪识别接口 + 异常追踪)
# ---------------------------------------------------------------------------

from __future__ import annotations

from django.http import HttpRequest
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from textblob import TextBlob

import numpy as np
import cv2
import traceback  # ✅ 用于打印详细异常堆栈

from .models import Song, Mood
from .serializers import MoodSerializer, SongSerializer

# ---------------------------------------------------------------------------
# 🎵  Utility helpers
# ---------------------------------------------------------------------------

MOOD_MAP: list[tuple[float, str]] = [
    (0.3, "Happy"),
    (0.1, "Energetic"),
    (0.0, "Calm"),
    (-0.1, "Sad"),
]

def polarity_to_mood(polarity: float) -> str:
    for threshold, label in MOOD_MAP:
        if polarity >= threshold:
            return label
    return "Party"

# ---------------------------------------------------------------------------
# 🎧  API Endpoints
# ---------------------------------------------------------------------------

@api_view(["GET"])
def get_moods(_: HttpRequest) -> Response:
    """返回所有可用情绪标签"""
    moods = Mood.objects.all()
    serializer = MoodSerializer(moods, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_songs_by_mood(request: HttpRequest) -> Response:
    """根据情绪名称返回对应歌曲列表"""
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
    """使用 TextBlob 分析文本情绪"""
    user_text: str = request.data.get("text", "").strip()
    if not user_text:
        return Response({"error": "No text provided."},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        polarity = TextBlob(user_text).sentiment.polarity
        detected_mood = polarity_to_mood(polarity)
        return Response({"mood": detected_mood, "polarity": polarity},
                        status=status.HTTP_200_OK)
    except Exception as exc:
        return Response({"error": str(exc)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ---------------------------------------------------------------------------
# 🧠 Detect Mood from Face Image (via FER)
# ---------------------------------------------------------------------------

@api_view(["POST"])
def detect_mood_from_image(request: HttpRequest) -> Response:
    """使用 FER 分析上传图像中的情绪"""
    if 'image' not in request.FILES:
        return Response({'error': 'No image uploaded.'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        from fer import FER  # ✅ 延迟导入避免启动时报错

        image_file = request.FILES['image']
        img_array = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            return Response({'error': 'Invalid image file.'},
                            status=status.HTTP_400_BAD_REQUEST)

        detector = FER(mtcnn=True)
        results = detector.detect_emotions(img)

        if not results:
            return Response({'error': 'No face or emotion detected.'},
                            status=status.HTTP_400_BAD_REQUEST)

        top_emotions = results[0]["emotions"]
        dominant_emotion = max(top_emotions, key=top_emotions.get)

        return Response({"emotion": dominant_emotion}, status=status.HTTP_200_OK)
    except Exception as e:
        traceback.print_exc()  # ✅ 打印完整异常信息到终端
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
