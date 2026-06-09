from app.models.base import now_utc


def chat_message_document(user_id: str, user_message: str, bot_response: str) -> dict:
    return {
        "user_id": user_id,
        "user_message": user_message,
        "bot_response": bot_response,
        "created_at": now_utc(),
    }
