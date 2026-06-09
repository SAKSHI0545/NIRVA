from app.models.base import now_utc


def user_document(username: str, email: str, password_hash: str) -> dict:
    return {
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "created_at": now_utc(),
    }
