import requests
from django.conf import settings
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response

CACHE_KEY, TTL = "reels:v1", 60 * 60  # 1 hour keeps YouTube API quota safe


def fetch_shorts():
    # Shorts-only playlist: "UUSH" + channel id without its leading "UC"
    playlist = "UUSH" + settings.YOUTUBE_CHANNEL_ID[2:]
    r = requests.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        params={"part": "snippet", "playlistId": playlist, "maxResults": 12, "key": settings.YOUTUBE_API_KEY},
        timeout=10,
    )
    r.raise_for_status()
    return [
        {"id": i["snippet"]["resourceId"]["videoId"], "title": i["snippet"]["title"]}
        for i in r.json().get("items", [])
    ]


@api_view(["GET"])
def reels(request):
    data = cache.get(CACHE_KEY)
    if data is None:
        if not settings.YOUTUBE_API_KEY:
            return Response({"source": "demo", "items": []})
        try:
            data = {"source": "youtube", "items": fetch_shorts()}
        except requests.RequestException:
            return Response({"source": "error", "items": []})
        cache.set(CACHE_KEY, data, TTL)
    return Response(data)
