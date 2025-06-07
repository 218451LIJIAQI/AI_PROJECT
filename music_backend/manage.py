#!/usr/bin/env python
"""
Django's command-line utility for administrative tasks.
Enhanced to support loading environment variables via python-dotenv.
"""

import os
import sys

try:
    import dotenv
    dotenv.load_dotenv()  # Load environment variables from .env file
except ImportError:
    # Graceful fallback if dotenv is not installed
    print("Warning: python-dotenv is not installed. Environment variables from .env won't be loaded.")

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_backend.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Make sure it's installed and available on your PYTHONPATH environment "
            "variable. Did you forget to activate a virtual environment?"
        ) from exc

    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
