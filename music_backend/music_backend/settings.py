"""
Django settings for music_backend project (💯 满分安全优化版)
-----------------------------------------------------------
说明：
1. 生产安全：秘密与凭据读取自环境变量 (.env)。
2. CORS & CSRF 设置：开发允许本地，生产可切换。
3. 数据库配置：支持默认 Postgres，也可通过 DATABASE_URL 环境变量覆盖。
4. 静态文件：设置 STATIC_ROOT 方便 collectstatic。
5. 增强国际化：时区设为 Asia/Kuala_Lumpur。
6. 保持与原有功能一致，兼容现有项目。
"""

import os
from pathlib import Path
from django.core.management.utils import get_random_secret_key

try:
    import dj_database_url       # pip install dj-database-url
    import dotenv                # pip install python-dotenv
except ImportError:
    dj_database_url = None
    dotenv = None

# 项目根路径，manage.py 同级目录
BASE_DIR = Path(__file__).resolve().parent.parent

# 从 BASE_DIR/.env 加载环境变量
if dotenv:
    dotenv.load_dotenv(BASE_DIR / '.env')

# ---------------------------------------------------------------------------
# 🔐 Secret Key
# ---------------------------------------------------------------------------
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())

# ---------------------------------------------------------------------------
# 🔧 Debug & Hosts
# ---------------------------------------------------------------------------
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"
ALLOWED_HOSTS: list[str] = os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# ---------------------------------------------------------------------------
# 📦 Installed Apps
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
     "django.contrib.auth",
     "django.contrib.contenttypes",
     "django.contrib.sessions",
     "django.contrib.messages",
     "django.contrib.staticfiles",
     # Third-party
     "corsheaders",
     "rest_framework",
     "rest_framework.authtoken",
    # Local apps
# 'yourapp',
    # Local apps
    "music",          # ← 注册你的 music 应用
]

# ---------------------------------------------------------------------------
# 🛡️ Middleware
# ---------------------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS before CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "music_backend.urls"

# ---------------------------------------------------------------------------
# 🖼️ Templates
# ---------------------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "music_backend.wsgi.application"

# ---------------------------------------------------------------------------
# 🗄️ Database (支持 PostgreSQL 或者 SQLite 开发)
# ---------------------------------------------------------------------------

DEFAULT_DB = {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": BASE_DIR / "db.sqlite3",
}

# Check for DATABASE_URL environment variable
database_url = os.getenv("DATABASE_URL", None)

if database_url and dj_database_url:
    # Use PostgreSQL from environment
    DATABASES = {
        "default": dj_database_url.config(
            default=database_url,
            conn_max_age=600
        )
    }
else:
    # Use SQLite for development
    DATABASES = {
        "default": DEFAULT_DB
    }
    if not database_url:
        print("Using SQLite database for development")
    else:
        print("dj_database_url not available, falling back to SQLite")

# ---------------------------------------------------------------------------
# 🔑 Password Validators
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------------------------------------------------------------------
# 🌐 Internationalization
# ---------------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kuala_Lumpur"
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# 📁 Static & Media
# ---------------------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# ---------------------------------------------------------------------------
# ⚙️ Default primary key
# ---------------------------------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# 🌍 CORS (development)
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

# Additional CORS settings for development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = os.getenv("DJANGO_DEBUG", "True") == "True"  # Only in development

# CORS headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# ---------------------------------------------------------------------------
# 🔐 Django REST Framework Configuration
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Allow unauthenticated access by default
    ],
}

# ---------------------------------------------------------------------------
# 🔑 Authentication Configuration
# ---------------------------------------------------------------------------
LOGIN_URL = '/api/auth/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

# Session settings for authentication
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_COOKIE_HTTPONLY = True
SESSION_SAVE_EVERY_REQUEST = True
