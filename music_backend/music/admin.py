from django.contrib import admin
from .models import Profile, Mood, Song, UserMood


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'favorite_mood')
    search_fields = ('user__username',)
    list_filter = ('favorite_mood',)


@admin.register(Mood)
class MoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'mood', 'spotify_url')
    list_filter = ('mood',)
    search_fields = ('title', 'artist')
    ordering = ('title',)


@admin.register(UserMood)
class UserMoodAdmin(admin.ModelAdmin):
    list_display = ('user', 'mood', 'timestamp')
    list_filter = ('mood', 'timestamp')
    search_fields = ('user__username',)
    ordering = ('-timestamp',)
