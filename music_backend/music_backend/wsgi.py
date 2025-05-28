import os
import dotenv  # Load environment variables from .env file early

# Load .env before any settings get used
dotenv.load_dotenv()

"""
WSGI config for music_backend project.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It exposes a WSGI callable as a module-level
variable named `application`.

For more information on WSGI and deployment, see:
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

from django.core.wsgi import get_wsgi_application

# Set the default Django settings module for the 'wsgi' command
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')

# WSGI application
application = get_wsgi_application()
