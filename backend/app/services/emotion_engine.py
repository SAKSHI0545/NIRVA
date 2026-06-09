class EmotionEngine:
    """Central emotional reasoning engine for journals, chat, and recommendations."""

    mood_targets = {
        "sad": ("uplifting", "Gentle momentum may help. Try one small nourishing action."),
        "anxious": ("calming", "A grounding routine could reduce intensity right now."),
        "angry": ("cool-down", "Create a pause before responding and release tension safely."),
        "happy": ("maintain positivity", "Notice what is working and protect that energy."),
        "motivated": ("productivity", "Convert the energy into one focused next step."),
        "tired": ("restorative", "Recovery is productive when your body asks for it."),
    }

    def detect_emotional_state(self, mood: str | None, text: str = "", sentiment: str = "neutral") -> str:
        normalized = (mood or "").lower().strip()
        if normalized in self.mood_targets:
            return normalized
        lowered = text.lower()
        keyword_map = {
            "anxious": ["worry", "panic", "overwhelmed", "nervous"],
            "sad": ["sad", "lonely", "empty", "down"],
            "angry": ["angry", "frustrated", "irritated"],
            "motivated": ["focused", "motivated", "ready"],
            "happy": ["happy", "grateful", "good"],
        }
        for state, keywords in keyword_map.items():
            if any(keyword in lowered for keyword in keywords):
                return state
        return "sad" if sentiment == "negative" else "happy" if sentiment == "positive" else "balanced"

    def insight_for(self, emotional_state: str) -> dict[str, str]:
        target, recommendation = self.mood_targets.get(
            emotional_state, ("balanced", "Keep checking in and choose one supportive action.")
        )
        return {
            "emotional_state": emotional_state,
            "target_mood": target,
            "recommendation": recommendation,
        }

    def wellness_score(self, sentiment_distribution: dict[str, int]) -> int:
        total = sum(sentiment_distribution.values())
        if total == 0:
            return 72
        positive = sentiment_distribution.get("positive", 0)
        neutral = sentiment_distribution.get("neutral", 0)
        negative = sentiment_distribution.get("negative", 0)
        score = 50 + (positive * 12 + neutral * 4 - negative * 10) / total
        return max(1, min(100, round(score)))
