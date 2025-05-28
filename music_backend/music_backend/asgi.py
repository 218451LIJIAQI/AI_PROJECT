"""
ASGI config for music_backend project.

This file exposes the ASGI callable as a module-level variable named `application`.

For more information on this file, see:
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import dotenv  # ✅ Load environment variables for ASGI-based deployments

# Load environment variables from .env file
dotenv.load_dotenv()

from django.core.asgi import get_asgi_application

# Set default settings module for ASGI
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')

# ASGI application
application = get_asgi_application()
