from collections import Counter, defaultdict
from datetime import datetime

from app.repositories.journal_repository import JournalRepository
from app.services.emotion_engine import EmotionEngine


class AnalyticsService:
    def __init__(self, journal_repository: JournalRepository, emotion_engine: EmotionEngine):
        self.journal_repository = journal_repository
        self.emotion_engine = emotion_engine

    async def summary(self, user_id: str) -> dict:
        entries = await self.journal_repository.list_for_user(user_id)
        moods = Counter(entry["mood"].lower() for entry in entries)
        sentiments = Counter(entry["sentiment"] for entry in entries)
        weekly = defaultdict(int)
        monthly = defaultdict(int)

        for entry in entries:
            created_at: datetime = entry["created_at"]
            weekly[created_at.strftime("%Y-W%U")] += 1
            monthly[created_at.strftime("%Y-%m")] += 1

        dominant_mood = moods.most_common(1)[0][0] if moods else None
        return {
            "total_journal_entries": len(entries),
            "mood_distribution": dict(moods),
            "sentiment_distribution": dict(sentiments),
            "dominant_mood": dominant_mood,
            "wellness_score": self.emotion_engine.wellness_score(dict(sentiments)),
            "weekly_trends": [{"period": period, "count": count} for period, count in sorted(weekly.items())],
            "monthly_trends": [{"period": period, "count": count} for period, count in sorted(monthly.items())],
        }
