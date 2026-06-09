import re
from datetime import datetime
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.base import object_id_to_str, to_object_id


class JournalRepository:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.collection = database.journal_entries
        self.users_collection = database.users

    def _normalize_entry(self, entry: dict[str, Any] | None) -> dict[str, Any] | None:
        if not entry:
            return None
        entry.setdefault("visibility", "private")
        return object_id_to_str(entry)

    async def create(self, document: dict[str, Any]) -> dict[str, Any]:
        result = await self.collection.insert_one(document)
        return self._normalize_entry(await self.collection.find_one({"_id": result.inserted_id}))

    async def list_for_user(
        self,
        user_id: str,
        search: str | None = None,
        mood: str | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> list[dict[str, Any]]:
        query: dict[str, Any] = {"user_id": user_id}
        if mood:
            query["mood"] = {"$regex": f"^{mood}$", "$options": "i"}
        if search:
            query["content"] = {"$regex": search, "$options": "i"}
        if date_from or date_to:
            query["created_at"] = {}
            if date_from:
                query["created_at"]["$gte"] = date_from
            if date_to:
                query["created_at"]["$lte"] = date_to

        cursor = self.collection.find(query).sort("created_at", -1)
        return [self._normalize_entry(item) async for item in cursor]

    async def list_public(self, page: int, page_size: int) -> tuple[list[dict[str, Any]], int]:
        skip = (page - 1) * page_size
        pipeline: list[dict[str, Any]] = [
            {"$match": {"visibility": "public"}},
            {"$sort": {"created_at": -1}},
            {
                "$facet": {
                    "items": [
                        {"$skip": skip},
                        {"$limit": page_size},
                        {
                            "$lookup": {
                                "from": "users",
                                "let": {"author_id": {"$toObjectId": "$user_id"}},
                                "pipeline": [
                                    {"$match": {"$expr": {"$eq": ["$_id", "$$author_id"]}}},
                                    {"$project": {"_id": 0, "username": 1}},
                                ],
                                "as": "author",
                            }
                        },
                        {
                            "$addFields": {
                                "author_display_name": {
                                    "$ifNull": [{"$arrayElemAt": ["$author.username", 0]}, "NIRVA member"]
                                }
                            }
                        },
                        {"$project": {"author": 0, "user_id": 0, "sentiment": 0, "updated_at": 0}},
                    ],
                    "total": [{"$count": "count"}],
                }
            },
        ]
        result = await self.collection.aggregate(pipeline).to_list(length=1)
        if not result:
            return [], 0

        items = [object_id_to_str(item) for item in result[0].get("items", [])]
        total_rows = result[0].get("total", [])
        total = total_rows[0]["count"] if total_rows else 0
        return items, total

    async def list_community_public(
        self,
        page: int,
        page_size: int,
        search: str | None = None,
        mood: str | None = None,
    ) -> tuple[list[dict[str, Any]], int]:
        skip = (page - 1) * page_size
        filters: list[dict[str, Any]] = []
        if mood:
            filters.append({"mood": {"$regex": f"^{re.escape(mood)}$", "$options": "i"}})
        if search:
            escaped_search = re.escape(search)
            filters.append(
                {
                    "$or": [
                        {"username": {"$regex": escaped_search, "$options": "i"}},
                        {"mood": {"$regex": escaped_search, "$options": "i"}},
                        {"content": {"$regex": escaped_search, "$options": "i"}},
                    ]
                }
            )

        pipeline: list[dict[str, Any]] = [
            {"$match": {"visibility": "public"}},
            {
                "$lookup": {
                    "from": "users",
                    "let": {"author_id": {"$toObjectId": "$user_id"}},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$author_id"]}}},
                        {"$project": {"_id": 0, "username": 1}},
                    ],
                    "as": "author",
                }
            },
            {
                "$addFields": {
                    "username": {"$ifNull": [{"$arrayElemAt": ["$author.username", 0]}, "NIRVA member"]}
                }
            },
            *[{"$match": item} for item in filters],
            {"$sort": {"created_at": -1}},
            {
                "$facet": {
                    "items": [
                        {"$skip": skip},
                        {"$limit": page_size},
                        {
                            "$project": {
                                "_id": 1,
                                "username": 1,
                                "mood": 1,
                                "entry": "$content",
                                "sentiment": 1,
                                "created_at": 1,
                                "likes": {"$ifNull": ["$likes", 0]},
                                "comments_count": {"$ifNull": ["$comments_count", 0]},
                            }
                        },
                    ],
                    "total": [{"$count": "count"}],
                }
            },
        ]
        result = await self.collection.aggregate(pipeline).to_list(length=1)
        if not result:
            return [], 0

        items = [object_id_to_str(item) for item in result[0].get("items", [])]
        total_rows = result[0].get("total", [])
        total = total_rows[0]["count"] if total_rows else 0
        return items, total

    async def find_by_id(self, entry_id: str) -> dict[str, Any] | None:
        return self._normalize_entry(await self.collection.find_one({"_id": to_object_id(entry_id)}))

    async def find_owned(self, entry_id: str, user_id: str) -> dict[str, Any] | None:
        return self._normalize_entry(
            await self.collection.find_one({"_id": to_object_id(entry_id), "user_id": user_id})
        )

    async def update_owned(
        self, entry_id: str, user_id: str, updates: dict[str, Any]
    ) -> dict[str, Any] | None:
        await self.collection.update_one(
            {"_id": to_object_id(entry_id), "user_id": user_id}, {"$set": updates}
        )
        return await self.find_owned(entry_id, user_id)

    async def delete_owned(self, entry_id: str, user_id: str) -> bool:
        result = await self.collection.delete_one({"_id": to_object_id(entry_id), "user_id": user_id})
        return result.deleted_count == 1
