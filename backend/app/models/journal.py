from app.models.base import now_utc


def journal_document(
    user_id: str,
    mood: str,
    content: str,
    sentiment: str,
    visibility: str = "private",
) -> dict:
    return {
        "user_id": user_id,
        "mood": mood,
        "content": content,
        "sentiment": sentiment,
        "visibility": visibility,
        "likes": 0,
        "comments_count": 0,
        "created_at": now_utc(),
        "updated_at": now_utc(),
    }
