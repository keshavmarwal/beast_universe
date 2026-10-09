from django.urls import path
from . import views

urlpatterns = [
    path("arena/active/", views.active_challenge),
    path("arena/vote/", views.cast_vote),
]