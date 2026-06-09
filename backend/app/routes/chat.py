from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.dependencies.services import get_chatbot_service
from app.schemas.chat import ChatMessageResponse, ChatRequest, ChatResponse
from app.services.chatbot_service import ChatbotService

router = APIRouter()


@router.post("/message", response_model=ChatResponse, status_code=201)
async def send_message(
    payload: ChatRequest,
    current_user: dict = Depends(get_current_user),
    service: ChatbotService = Depends(get_chatbot_service),
) -> dict:
    return await service.send_message(current_user["id"], payload.message)


@router.post("/messages", response_model=ChatMessageResponse, status_code=201)
async def send_message_legacy(
    payload: ChatRequest,
    current_user: dict = Depends(get_current_user),
    service: ChatbotService = Depends(get_chatbot_service),
) -> dict:
    return await service.send_message(current_user["id"], payload.message)


@router.get("/messages", response_model=list[ChatMessageResponse])
async def history(
    current_user: dict = Depends(get_current_user),
    service: ChatbotService = Depends(get_chatbot_service),
) -> list[dict]:
    return await service.history(current_user["id"])
