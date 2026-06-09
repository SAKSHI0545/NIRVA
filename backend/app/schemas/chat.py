from datetime import datetime

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    user_message: str
    bot_response: str


class ChatMessageResponse(BaseModel):
    id: str
    user_id: str
    user_message: str
    bot_response: str
    created_at: datetime
