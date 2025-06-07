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
import dj_database_url       # pip install dj-database-url
import dotenv                # pip install python-dotenv

# 项目根路径，manage.py 同级目录
BASE_DIR = Path(__file__).resolve().parent.parent

# 从 BASE_DIR/.env 加载环境变量
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
# 🗄️ Database (PostgreSQL by default)
# ---------------------------------------------------------------------------
DEFAULT_DB = {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": os.getenv("POSTGRES_DB", "moodify_db"),
    "USER": os.getenv("POSTGRES_USER", "postgres"),
    "PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
    "HOST": os.getenv("POSTGRES_HOST", "localhost"),
    "PORT": os.getenv("POSTGRES_PORT", "5432"),
}

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL", None),
        conn_max_age=600
    ) or DEFAULT_DB
}

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
    "http://localhost:3000"
).split(",")
