from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.dependencies.services import get_music_service
from app.schemas.music import MusicRecommendationResponse, MusicRequest
from app.services.music_service import MusicService

router = APIRouter()


@router.post("/recommendations", response_model=MusicRecommendationResponse, status_code=201)
async def recommend(
    payload: MusicRequest,
    current_user: dict = Depends(get_current_user),
    service: MusicService = Depends(get_music_service),
) -> dict:
    return await service.recommend(current_user["id"], payload.mood, payload.target_mood)


@router.get("/recommendations", response_model=list[MusicRecommendationResponse])
async def history(
    current_user: dict = Depends(get_current_user),
    service: MusicService = Depends(get_music_service),
) -> list[dict]:
    return await service.history(current_user["id"])
