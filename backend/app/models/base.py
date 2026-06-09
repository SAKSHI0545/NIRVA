from datetime import datetime, timezone
from typing import Any

from bson import ObjectId


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def object_id_to_str(document: dict[str, Any] | None) -> dict[str, Any] | None:
    """Normalize MongoDB _id into an API-friendly id field."""
    if not document:
        return None
    document["id"] = str(document.pop("_id"))
    return document


def to_object_id(value: str) -> ObjectId:
    return ObjectId(value)
