from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    total_journal_entries: int
    mood_distribution: dict[str, int]
    sentiment_distribution: dict[str, int]
    dominant_mood: str | None
    wellness_score: int
    weekly_trends: list[dict]
    monthly_trends: list[dict]
