#!/usr/bin/env python
"""
Script to add mood-improvement songs to the database
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')
django.setup()

from music.models import Mood, Song

def add_mood_improvement_songs():
    """添加能改善心情的歌曲"""
    
    # 获取情绪对象
    happy_mood = Mood.objects.get(name='Happy')
    calm_mood = Mood.objects.get(name='Calm')
    energetic_mood = Mood.objects.get(name='Energetic')
    party_mood = Mood.objects.get(name='Party')
    
    # 更多快乐/积极的歌曲 - 用于改善负面情绪
    mood_improvement_songs = [
        # Happy 类型 - 用于改善悲伤情绪
        {
            'title': 'Happy',
            'artist': 'Pharrell Williams',
            'album': 'G I R L',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH',
        },
        {
            'title': 'Can\'t Stop the Feeling!',
            'artist': 'Justin Timberlake',
            'album': 'Trolls',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/20I6sIOMTCkB6w7ryavxtO',
        },
        {
            'title': 'Walking on Sunshine',
            'artist': 'Katrina and the Waves',
            'album': 'Walking on Sunshine',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/2q3rBKV48hJJrQc6JRPKjy',
        },
        {
            'title': 'Good as Hell',
            'artist': 'Lizzo',
            'album': 'Cuz I Love You',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/6KJcoZtCLwNIbEGhSDKV8a',
        },
        
        # Calm 类型 - 用于缓解愤怒和恐惧
        {
            'title': 'Breathe Me',
            'artist': 'Sia',
            'album': 'Colour the Small One',
            'mood': calm_mood,
            'spotify_url': 'https://open.spotify.com/track/4VdBDdmTGdhgW3FKrfj3QZ',
        },
        {
            'title': 'Mad World',
            'artist': 'Gary Jules',
            'album': 'Donnie Darko Soundtrack',
            'mood': calm_mood,
            'spotify_url': 'https://open.spotify.com/track/3JOVTQ5h8HGFnDdp4VT3MP',
        },
        {
            'title': 'River',
            'artist': 'Joni Mitchell',
            'album': 'Blue',
            'mood': calm_mood,
            'spotify_url': 'https://open.spotify.com/track/4Tj38fdBhSLCaYRqZAiXnA',
        },
        
        # Energetic 类型 - 用于激发活力
        {
            'title': 'Uptown Funk',
            'artist': 'Mark Ronson ft. Bruno Mars',
            'album': 'Uptown Special',
            'mood': energetic_mood,
            'spotify_url': 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS',
        },
        {
            'title': 'Don\'t Stop Me Now',
            'artist': 'Queen',
            'album': 'Jazz',
            'mood': energetic_mood,
            'spotify_url': 'https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i',
        },
        
        # Party 类型 - 用于中性情绪
        {
            'title': 'I Gotta Feeling',
            'artist': 'Black Eyed Peas',
            'album': 'The E.N.D.',
            'mood': party_mood,
            'spotify_url': 'https://open.spotify.com/track/29l9eumG0WOVkzWBjCEcPt',
        },
        {
            'title': 'Party in the USA',
            'artist': 'Miley Cyrus',
            'album': 'The Time of Our Lives',
            'mood': party_mood,
            'spotify_url': 'https://open.spotify.com/track/5Q0Nhxo0l2bP3pNjpGJwV1',
        },
    ]
    
    created_count = 0
    for song_data in mood_improvement_songs:
        song, created = Song.objects.get_or_create(
            title=song_data['title'],
            artist=song_data['artist'],
            defaults={
                'album': song_data['album'],
                'mood': song_data['mood'],
                'spotify_url': song_data['spotify_url'],
            }
        )
        if created:
            created_count += 1
            print(f"✅ 添加歌曲: {song.title} by {song.artist} -> {song.mood.name}")
        else:
            print(f"⚪ 歌曲已存在: {song.title} by {song.artist}")
    
    print(f"\n📊 统计信息:")
    print(f"新添加歌曲: {created_count}")
    print(f"数据库总歌曲数: {Song.objects.count()}")
    
    # 显示各情绪的歌曲数量
    for mood in Mood.objects.all():
        count = mood.songs.count()
        print(f"  {mood.name}: {count} 首歌曲")

if __name__ == '__main__':
    print("🎵 添加改善心情的歌曲到数据库...")
    print("=" * 50)
    add_mood_improvement_songs()
    print("=" * 50)
    print("✅ 心情改善歌曲添加完成！") 