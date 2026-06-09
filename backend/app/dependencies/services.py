from app.database.connection import get_database
from app.repositories.chat_repository import ChatRepository
from app.repositories.journal_repository import JournalRepository
from app.repositories.music_repository import MusicRepository
from app.repositories.user_repository import UserRepository
from app.services.analytics_service import AnalyticsService
from app.services.auth_service import AuthService
from app.services.chatbot_service import ChatbotService
from app.services.emotion_engine import EmotionEngine
from app.services.journal_service import JournalService
from app.services.music_service import MusicService
from app.services.sentiment_service import SentimentService
from app.services.spotify_service import SpotifyService


def get_auth_service() -> AuthService:
    return AuthService(UserRepository(get_database()))


def get_journal_service() -> JournalService:
    return JournalService(JournalRepository(get_database()), SentimentService())


def get_chatbot_service() -> ChatbotService:
    return ChatbotService(ChatRepository(get_database()))


def get_music_service() -> MusicService:
    return MusicService(MusicRepository(get_database()), EmotionEngine())


def get_spotify_service() -> SpotifyService:
    return SpotifyService()


def get_analytics_service() -> AnalyticsService:
    return AnalyticsService(JournalRepository(get_database()), EmotionEngine())
