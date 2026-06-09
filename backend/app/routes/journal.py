from datetime import datetime

from fastapi import APIRouter, Depends, Query

from app.dependencies.auth import get_current_user
from app.dependencies.services import get_journal_service
from app.schemas.journal import JournalCreate, JournalResponse, JournalUpdate, PublicJournalPage
from app.services.journal_service import JournalService

router = APIRouter()


@router.post("", response_model=JournalResponse, status_code=201)
async def create_entry(
    payload: JournalCreate,
    current_user: dict = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
) -> dict:
    return await service.create(current_user["id"], payload)


@router.get("", response_model=list[JournalResponse])
async def list_entries(
    search: str | None = None,
    mood: str | None = None,
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    current_user: dict = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
) -> list[dict]:
    return await service.list(current_user["id"], search, mood, date_from, date_to)


@router.get("/my", response_model=list[JournalResponse])
async def my_entries(
    search: str | None = None,
    mood: str | None = None,
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    current_user: dict = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
) -> list[dict]:
    return await service.list(current_user["id"], search, mood, date_from, date_to)


@router.get("/public", response_model=PublicJournalPage)
async def public_entries(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
) -> dict:
    return await service.public_feed(page, page_size)


@router.get("/{entry_id}", response_model=JournalResponse)
async def get_entry(
    entry_id: str,
    current_user: dict = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
) -> dict:
    return await service.get(entry_id, current_user["id"])


@router.patch("/{entry_id}", response_model=JournalResponse)
async def update_entry(
    entry_id: str,
    payload: JournalUpdate,
    current_user: dict = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
) -> dict:
    return await service.update(entry_id, current_user["id"], payload)


@router.delete("/{entry_id}", status_code=204)
async def delete_entry(
    entry_id: str,
    current_user: dict = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
) -> None:
    await service.delete(entry_id, current_user["id"])
