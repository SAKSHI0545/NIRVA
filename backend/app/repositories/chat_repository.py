from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.base import object_id_to_str


class ChatRepository:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.collection = database.chat_messages

    async def create(self, document: dict[str, Any]) -> dict[str, Any]:
        result = await self.collection.insert_one(document)
        return object_id_to_str(await self.collection.find_one({"_id": result.inserted_id}))

    async def history_for_user(self, user_id: str, limit: int = 50) -> list[dict[str, Any]]:
        cursor = self.collection.find({"user_id": user_id}).sort("created_at", 1).limit(limit)
        messages = []
        async for item in cursor:
            if "bot_response" not in item and "ai_response" in item:
                item["bot_response"] = item["ai_response"]
            messages.append(object_id_to_str(item))
        return messages
