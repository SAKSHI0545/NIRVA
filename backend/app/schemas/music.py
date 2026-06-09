from datetime import datetime

from pydantic import BaseModel


class PlaylistRecommendation(BaseModel):
    title: str
    description: str
    url: str | None = None


class MusicRequest(BaseModel):
    mood: str
    target_mood: str | None = None


class MusicRecommendationResponse(BaseModel):
    id: str
    user_id: str
    detected_mood: str
    target_mood: str
    recommendation_type: str
    playlists: list[PlaylistRecommendation]
    created_at: datetime
