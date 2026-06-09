from fastapi import APIRouter, Depends, Query

from app.dependencies.auth import get_current_user
from app.dependencies.services import get_spotify_service
from app.schemas.spotify import SpotifyPlaylist, SpotifyRecommendationsResponse
from app.services.spotify_service import SpotifyService

router = APIRouter()


@router.get("/recommendations/{mood}", response_model=SpotifyRecommendationsResponse)
async def spotify_recommendations(
    mood: str,
    limit: int = Query(default=10, ge=1, le=10),
    _: dict = Depends(get_current_user),
    service: SpotifyService = Depends(get_spotify_service),
) -> SpotifyRecommendationsResponse:
    return await service.recommendations_for_mood(mood, limit=limit)


@router.get("/playlists/{playlist_id}", response_model=SpotifyPlaylist)
async def spotify_playlist(
    playlist_id: str,
    _: dict = Depends(get_current_user),
    service: SpotifyService = Depends(get_spotify_service),
) -> SpotifyPlaylist:
    return await service.playlist_by_id(playlist_id)
