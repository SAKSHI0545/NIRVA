from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.base import object_id_to_str, to_object_id


class UserRepository:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.collection = database.users

    async def create(self, document: dict[str, Any]) -> dict[str, Any]:
        result = await self.collection.insert_one(document)
        created = await self.collection.find_one({"_id": result.inserted_id})
        return object_id_to_str(created)

    async def find_by_email(self, email: str) -> dict[str, Any] | None:
        return object_id_to_str(await self.collection.find_one({"email": email}))

    async def find_by_username(self, username: str) -> dict[str, Any] | None:
        return object_id_to_str(await self.collection.find_one({"username": username}))

    async def find_by_id(self, user_id: str) -> dict[str, Any] | None:
        return object_id_to_str(await self.collection.find_one({"_id": to_object_id(user_id)}))

    async def update(self, user_id: str, updates: dict[str, Any]) -> dict[str, Any] | None:
        await self.collection.update_one({"_id": to_object_id(user_id)}, {"$set": updates})
        return await self.find_by_id(user_id)
