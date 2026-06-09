def normalize_mood(mood: str) -> str:
    """Normalize mood labels before analysis or display."""
    return mood.strip().lower()
