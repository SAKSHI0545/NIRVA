from fastapi import HTTPException, status

from app.models.base import now_utc
from app.models.journal import journal_document
from app.repositories.journal_repository import JournalRepository
from app.schemas.journal import JournalCreate, JournalUpdate
from app.services.sentiment_service import SentimentService


class JournalService:
    def __init__(self, repository: JournalRepository, sentiment_service: SentimentService):
        self.repository = repository
        self.sentiment_service = sentiment_service

    async def create(self, user_id: str, payload: JournalCreate) -> dict:
        sentiment = self.sentiment_service.analyze(payload.content)
        return await self.repository.create(
            journal_document(user_id, payload.mood, payload.content, sentiment, payload.visibility)
        )

    async def list(
        self,
        user_id: str,
        search: str | None = None,
        mood: str | None = None,
        date_from=None,
        date_to=None,
    ) -> list[dict]:
        return await self.repository.list_for_user(user_id, search, mood, date_from, date_to)

    async def public_feed(self, page: int = 1, page_size: int = 10) -> dict:
        items, total = await self.repository.list_public(page, page_size)
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    async def community_journals(
        self,
        page: int = 1,
        page_size: int = 10,
        search: str | None = None,
        mood: str | None = None,
    ) -> dict:
        items, total = await self.repository.list_community_public(page, page_size, search, mood)
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    async def get(self, entry_id: str, user_id: str) -> dict:
        entry = await self.repository.find_by_id(entry_id)
        if not entry:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found")

        if entry.get("visibility", "private") == "private" and entry["user_id"] != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found")

        return entry

    async def update(self, entry_id: str, user_id: str, payload: JournalUpdate) -> dict:
        existing = await self.repository.find_owned(entry_id, user_id)
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found")
        updates = payload.model_dump(exclude_unset=True)
        if "content" in updates:
            updates["sentiment"] = self.sentiment_service.analyze(updates["content"])
        updates["updated_at"] = now_utc()
        updated = await self.repository.update_owned(entry_id, user_id, updates)
        return updated

    async def delete(self, entry_id: str, user_id: str) -> None:
        if not await self.repository.delete_owned(entry_id, user_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found")
