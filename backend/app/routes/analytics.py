from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.dependencies.services import get_analytics_service
from app.schemas.analytics import AnalyticsSummary
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummary)
async def summary(
    current_user: dict = Depends(get_current_user),
    service: AnalyticsService = Depends(get_analytics_service),
) -> dict:
    return await service.summary(current_user["id"])
