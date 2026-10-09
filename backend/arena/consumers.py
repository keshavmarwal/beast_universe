from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .views import get_active_challenge, serialize

GROUP = "arena"


@database_sync_to_async
def current_state():
    challenge = get_active_challenge()
    return serialize(challenge) if challenge else None


class ArenaConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(GROUP, self.channel_name)
        await self.accept()
        await self.send_json(await current_state())

    async def disconnect(self, code):
        await self.channel_layer.group_discard(GROUP, self.channel_name)

    async def arena_update(self, event):
        await self.send_json(event["data"])