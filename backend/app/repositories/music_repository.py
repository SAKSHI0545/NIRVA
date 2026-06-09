from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.base import object_id_to_str


class MusicRepository:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.collection = database.music_recommendations

    async def create(self, document: dict[str, Any]) -> dict[str, Any]:
        result = await self.collection.insert_one(document)
        return object_id_to_str(await self.collection.find_one({"_id": result.inserted_id}))

    async def list_for_user(self, user_id: str, limit: int = 20) -> list[dict[str, Any]]:
        cursor = self.collection.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
        return [object_id_to_str(item) async for item in cursor]
