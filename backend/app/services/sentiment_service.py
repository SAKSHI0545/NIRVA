from textblob import TextBlob


class SentimentService:
    """Sentiment adapter that can be replaced by OpenAI, Gemini, or HuggingFace later."""

    def analyze(self, text: str) -> str:
        polarity = TextBlob(text).sentiment.polarity
        if polarity > 0.15:
            return "positive"
        if polarity < -0.15:
            return "negative"
        return "neutral"
