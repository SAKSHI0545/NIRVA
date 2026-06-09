from app.models.music import music_recommendation_document
from app.repositories.music_repository import MusicRepository
from app.services.emotion_engine import EmotionEngine


class MusicService:
    """Music recommendation engine with a future Spotify integration boundary."""

    catalog = {
        "uplifting": [
            {"title": "Bright Reset", "description": "Warm pop and hopeful acoustic tracks."},
            {"title": "Small Wins", "description": "Light songs for rebuilding momentum."},
        ],
        "calming": [
            {"title": "Breath Space", "description": "Ambient textures for nervous system settling."},
            {"title": "Soft Focus", "description": "Quiet instrumental tracks for gentle attention."},
        ],
        "productivity": [
            {"title": "Deep Work Flow", "description": "Low-lyric beats for sustained focus."},
            {"title": "Momentum Builder", "description": "Steady electronic music for task energy."},
        ],
        "maintain positivity": [
            {"title": "Gratitude Glow", "description": "Feel-good tracks that keep the mood open."},
            {"title": "Sunlit Drive", "description": "Upbeat music for preserving a good day."},
        ],
        "balanced": [
            {"title": "Evening Balance", "description": "A centered mix for reflection and ease."},
            {"title": "Mindful Minutes", "description": "Short calm tracks for check-ins."},
        ],
    }

    def __init__(self, repository: MusicRepository, emotion_engine: EmotionEngine):
        self.repository = repository
        self.emotion_engine = emotion_engine

    async def recommend(self, user_id: str, mood: str, target_mood: str | None = None) -> dict:
        emotional_state = self.emotion_engine.detect_emotional_state(mood=mood)
        insight = self.emotion_engine.insight_for(emotional_state)
        target = target_mood or insight["target_mood"]
        playlists = self.catalog.get(target, self.catalog["balanced"])
        document = music_recommendation_document(
            user_id=user_id,
            detected_mood=emotional_state,
            target_mood=target,
            recommendation_type="playlist",
            playlists=playlists,
        )
        return await self.repository.create(document)

    async def history(self, user_id: str) -> list[dict]:
        return await self.repository.list_for_user(user_id)
