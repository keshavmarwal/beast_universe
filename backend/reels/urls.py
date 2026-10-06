from django.urls import path
from .views import reels
urlpatterns = [path("reels/", reels)]
