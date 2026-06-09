from app.models.base import now_utc


def music_recommendation_document(
    user_id: str,
    detected_mood: str,
    target_mood: str,
    recommendation_type: str,
    playlists: list[dict],
) -> dict:
    return {
        "user_id": user_id,
        "detected_mood": detected_mood,
        "target_mood": target_mood,
        "recommendation_type": recommendation_type,
        "playlists": playlists,
        "created_at": now_utc(),
    }
