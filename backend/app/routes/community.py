from fastapi import APIRouter, Depends, Query

from app.dependencies.auth import get_current_user
from app.dependencies.services import get_journal_service
from app.schemas.journal import CommunityJournalPage
from app.services.journal_service import JournalService

router = APIRouter()


@router.get("/journals", response_model=CommunityJournalPage)
async def community_journals(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    search: str | None = Query(default=None, max_length=120),
    mood: str | None = Query(default=None, max_length=40),
    current_user: dict = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
) -> dict:
    return await service.community_journals(page, page_size, search, mood)
