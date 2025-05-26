from django.apps import AppConfig


class MusicConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'music'
    verbose_name = '🎵 Moodify Music Module'

    def ready(self):
        """
        Called when the app is loaded.
        Used to register signals or startup code.
        """
        import music.signals  # noqa: F401
