#!/usr/bin/env python
"""
Script to populate initial mood data for the MusicAI application
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')
django.setup()

from music.models import Mood, Song

def create_initial_moods():
    """Create initial mood categories"""
    moods_data = [
        {'name': 'Happy', 'description': 'Upbeat and joyful music'},
        {'name': 'Sad', 'description': 'Melancholic and emotional tracks'},
        {'name': 'Energetic', 'description': 'High-energy and motivating songs'},
        {'name': 'Calm', 'description': 'Peaceful and relaxing melodies'},
        {'name': 'Party', 'description': 'Fun and danceable music'},
        {'name': 'Romantic', 'description': 'Love songs and romantic ballads'},
        {'name': 'Focus', 'description': 'Concentration and study music'},
        {'name': 'Angry', 'description': 'Intense and aggressive tracks'},
    ]
    
    created_count = 0
    for mood_data in moods_data:
        mood, created = Mood.objects.get_or_create(
            name=mood_data['name'],
            defaults={'description': mood_data['description']}
        )
        if created:
            created_count += 1
            print(f"Created mood: {mood.name}")
    
    print(f"Total moods created: {created_count}")
    print(f"Total moods in database: {Mood.objects.count()}")

def create_sample_songs():
    """Create some sample songs for testing"""
    # Get mood objects
    happy_mood = Mood.objects.get(name='Happy')
    sad_mood = Mood.objects.get(name='Sad')
    energetic_mood = Mood.objects.get(name='Energetic')
    calm_mood = Mood.objects.get(name='Calm')
    
    sample_songs = [
        {
            'title': 'Good 4 U',
            'artist': 'Olivia Rodrigo',
            'album': 'SOUR',
            'mood': happy_mood,
            'spotify_url': 'https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG',
        },
        {
            'title': 'Drivers License',
            'artist': 'Olivia Rodrigo',
            'album': 'SOUR',
            'mood': sad_mood,
            'spotify_url': 'https://open.spotify.com/track/7lPN2DXiMsVn7XUKtOW1CS',
        },
        {
            'title': 'Levitating',
            'artist': 'Dua Lipa',
            'album': 'Future Nostalgia',
            'mood': energetic_mood,
            'spotify_url': 'https://open.spotify.com/track/463CkQjx2Zk1yXoBuierM9',
        },
        {
            'title': 'Weightless',
            'artist': 'Marconi Union',
            'album': 'Ambient',
            'mood': calm_mood,
            'spotify_url': 'https://open.spotify.com/track/7iCZVjVDwwJqGXLvjQpWao',
        },
        {
            'title': 'Blinding Lights',
            'artist': 'The Weeknd',
            'album': 'After Hours',
            'mood': energetic_mood,
            'spotify_url': 'https://open.spotify.com/track/0VjIjW4GlULA4LGoDOLVdR',
        },
    ]
    
    created_count = 0
    for song_data in sample_songs:
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
            print(f"Created song: {song.title} by {song.artist}")
    
    print(f"Total songs created: {created_count}")
    print(f"Total songs in database: {Song.objects.count()}")

if __name__ == '__main__':
    print("Setting up initial data for MusicAI...")
    print("=" * 50)
    
    # Create moods
    print("Creating initial moods...")
    create_initial_moods()
    
    print("\nCreating sample songs...")
    create_sample_songs()
    
    print("\n" + "=" * 50)
    print("Initial data setup complete!") 