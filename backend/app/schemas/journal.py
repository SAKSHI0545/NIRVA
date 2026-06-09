from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

JournalVisibility = Literal["public", "private"]


class JournalCreate(BaseModel):
    mood: str = Field(min_length=2, max_length=40)
    content: str = Field(min_length=3, max_length=5000)
    visibility: JournalVisibility = "private"


class JournalUpdate(BaseModel):
    mood: str | None = Field(default=None, min_length=2, max_length=40)
    content: str | None = Field(default=None, min_length=3, max_length=5000)
    visibility: JournalVisibility | None = None


class JournalResponse(BaseModel):
    id: str
    mood: str
    content: str
    sentiment: str
    visibility: JournalVisibility = "private"
    created_at: datetime
    updated_at: datetime | None = None


class PublicJournalResponse(BaseModel):
    id: str
    mood: str
    content: str
    visibility: Literal["public"]
    author_display_name: str
    created_at: datetime


class PublicJournalPage(BaseModel):
    items: list[PublicJournalResponse]
    total: int
    page: int
    page_size: int


class CommunityJournalResponse(BaseModel):
    id: str
    username: str
    mood: str
    entry: str
    sentiment: str
    created_at: datetime
    likes: int = 0
    comments_count: int = 0


class CommunityJournalPage(BaseModel):
    items: list[CommunityJournalResponse]
    total: int
    page: int
    page_size: int


class JournalFilters(BaseModel):
    search: str | None = None
    mood: str | None = None
    date_from: datetime | None = None
    date_to: datetime | None = None
