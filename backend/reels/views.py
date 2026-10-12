import requests
from django.conf import settings
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response

CACHE_KEY, TTL = "reels:v1", 60 * 60  # 1 hour keeps YouTube API quota safe
STATS_KEY = "stats:v1"

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

def fetch_stats():
    r = requests.get(
        "https://www.googleapis.com/youtube/v3/channels",
        params={
            "part": "statistics",
            "id": settings.YOUTUBE_CHANNEL_ID,
            "key": settings.YOUTUBE_API_KEY,
        },
        timeout=10,
    )
    r.raise_for_status()
    s = r.json()["items"][0]["statistics"]
    return {
        "subscribers": int(s.get("subscriberCount", 0)),
        "views": int(s.get("viewCount", 0)),
        "videos": int(s.get("videoCount", 0)),
    }


@api_view(["GET"])
def stats(request):
    data = cache.get(STATS_KEY)
    if data is None:
        if not settings.YOUTUBE_API_KEY:
            return Response({"source": "demo"})
        try:
            data = {"source": "youtube", **fetch_stats()}
        except (requests.RequestException, KeyError, IndexError):
            return Response({"source": "error"})
        cache.set(STATS_KEY, data, TTL)
    return Response(data)