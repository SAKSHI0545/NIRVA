from app.models.chat import chat_message_document
from app.repositories.chat_repository import ChatRepository


class ChatbotService:
    """Simple rule-based supportive chatbot service."""

    SAD_RESPONSE = (
        "Things may feel difficult right now, but difficult emotions can pass. "
        "Try reaching out to someone you trust."
    )
    STRESS_RESPONSE = (
        "It sounds like you're carrying a lot right now. "
        "Consider taking a short break and focusing on one task at a time."
    )
    ANXIOUS_RESPONSE = "Try slowing down and focusing on what you can control in this moment."
    ANGRY_RESPONSE = "Taking a pause before reacting can help you process difficult emotions more clearly."
    HAPPY_RESPONSE = (
        "It's wonderful to hear that you're feeling positive today. "
        "Keep doing what supports your wellbeing."
    )
    DEFAULT_RESPONSE = (
        "Thank you for sharing. Your feelings matter, and taking time to reflect is an important step."
    )

    RULES = (
        (("sad", "unhappy", "depressed"), SAD_RESPONSE),
        (("stress", "stressed", "pressure"), STRESS_RESPONSE),
        (("anxious", "anxiety", "worried"), ANXIOUS_RESPONSE),
        (("angry", "frustrated", "mad"), ANGRY_RESPONSE),
        (("happy", "excited", "great"), HAPPY_RESPONSE),
    )

    def __init__(self, repository: ChatRepository):
        self.repository = repository

    def generate_response(self, message: str) -> str:
        normalized_message = message.lower()
        for keywords, response in self.RULES:
            if any(keyword in normalized_message for keyword in keywords):
                return response
        return self.DEFAULT_RESPONSE

    async def send_message(self, user_id: str, message: str) -> dict:
        response = self.generate_response(message)
        return await self.repository.create(chat_message_document(user_id, message, response))

    async def history(self, user_id: str) -> list[dict]:
        return await self.repository.history_for_user(user_id)
