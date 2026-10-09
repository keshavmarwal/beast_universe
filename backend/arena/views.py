from django.db import IntegrityError
from django.db.models import Count
from rest_framework import status
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from rest_framework.decorators import (
    api_view,
    authentication_classes,
    throttle_classes,
)
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Challenge, Vote


class VoteThrottle(AnonRateThrottle):
    rate = "20/min"


def get_active_challenge():
    return Challenge.objects.filter(is_active=True).order_by("-created_at").first()


def serialize(challenge):
    options = list(challenge.options.annotate(votes_count=Count("votes")))
    return {
        "id": challenge.id,
        "title": challenge.title,
        "description": challenge.description,
        "total_votes": sum(o.votes_count for o in options),
        "options": [
            {"id": o.id, "label": o.label, "votes": o.votes_count} for o in options
        ],
    }


@api_view(["GET"])
def active_challenge(request):
    challenge = get_active_challenge()
    if challenge is None:
        return Response({"detail": "No active challenge."}, status=status.HTTP_404_NOT_FOUND)
    return Response(serialize(challenge))


@api_view(["POST"])
@authentication_classes([])
@throttle_classes([VoteThrottle])
def cast_vote(request):
    option_id = request.data.get("option_id")
    voter_key = request.data.get("voter_key")

    if not isinstance(voter_key, str) or not (8 <= len(voter_key) <= 64):
        return Response({"detail": "Invalid voter_key."}, status=status.HTTP_400_BAD_REQUEST)

    challenge = get_active_challenge()
    if challenge is None:
        return Response({"detail": "No active challenge."}, status=status.HTTP_404_NOT_FOUND)

    try:
        option = challenge.options.filter(id=int(option_id)).first()
    except (TypeError, ValueError):
        option = None
    if option is None:
        return Response({"detail": "Invalid option."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        Vote.objects.create(challenge=challenge, option=option, voter_key=voter_key)
    except IntegrityError:
        return Response({"detail": "Already voted."}, status=status.HTTP_409_CONFLICT)

        payload = serialize(challenge)
    try:
        async_to_sync(get_channel_layer().group_send)(
            "arena", {"type": "arena.update", "data": payload}
        )
    except Exception:
        pass  # vote already saved; a broadcast failure shouldn't break it

    return Response(payload, status=status.HTTP_201_CREATED)