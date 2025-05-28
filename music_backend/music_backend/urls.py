# music_backend/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('music.urls')),  # ✅ 正确连接到 music 应用的路由
]
