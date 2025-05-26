from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Mood, Song


class MoodifyAPITests(APITestCase):

    def setUp(self):
        # 初始化测试数据
        self.happy_mood = Mood.objects.create(name="Happy")
        self.sad_mood = Mood.objects.create(name="Sad")
        Song.objects.create(title="Happy Song", artist="Artist1", mood=self.happy_mood)
        Song.objects.create(title="Sad Song", artist="Artist2", mood=self.sad_mood)

    def test_get_moods(self):
        """测试获取情绪列表接口"""
        url = reverse("get_moods")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Happy")

    def test_get_songs_by_mood_valid(self):
        """测试根据情绪获取歌曲接口（合法情绪）"""
        url = reverse("get_songs_by_mood")
        response = self.client.get(url, {"mood": "happy"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Happy Song")

    def test_get_songs_by_mood_invalid(self):
        """测试根据情绪获取歌曲接口（非法情绪）"""
        url = reverse("get_songs_by_mood")
        response = self.client.get(url, {"mood": "angry"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detect_mood_from_text(self):
        """测试情绪分析文本输入接口"""
        url = reverse("detect_text_mood")
        response = self.client.post(url, {"text": "I am feeling awesome today!"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("mood", response.data)
