from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    """Open the MongoDB connection and prepare indexes."""
    global client, database
    client = AsyncIOMotorClient(settings.mongodb_url)
    database = client[settings.database_name]
    await database.users.create_index("email", unique=True)
    await database.users.create_index("username", unique=True)
    await database.journal_entries.update_many(
        {"visibility": {"$exists": False}},
        {"$set": {"visibility": "private"}},
    )
    await database.journal_entries.update_many(
        {"likes": {"$exists": False}},
        {"$set": {"likes": 0}},
    )
    await database.journal_entries.update_many(
        {"comments_count": {"$exists": False}},
        {"$set": {"comments_count": 0}},
    )
    await database.journal_entries.create_index([("user_id", 1), ("created_at", -1)])
    await database.journal_entries.create_index([("visibility", 1), ("created_at", -1)])
    await database.chat_messages.create_index([("user_id", 1), ("created_at", 1)])
    await database.music_recommendations.create_index([("user_id", 1), ("created_at", -1)])


async def close_mongo_connection() -> None:
    """Close the MongoDB connection."""
    if client:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    """Return the active database connection."""
    if database is None:
        raise RuntimeError("Database has not been initialized")
    return database
