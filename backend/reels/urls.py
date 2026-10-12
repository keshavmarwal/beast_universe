from django.urls import path
from .views import reels, stats

urlpatterns = [
    path("reels/", reels),
    path("stats/", stats),
]
