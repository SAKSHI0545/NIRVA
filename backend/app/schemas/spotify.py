from pydantic import BaseModel, Field


class SpotifyPlaylist(BaseModel):
    playlist_id: str
    playlist_name: str
    description: str
    image_url: str | None = None
    spotify_url: str
    owner: str
    followers: int = Field(default=0, ge=0)


class SpotifyRecommendationsResponse(BaseModel):
    mood: str
    search_terms: list[str]
    playlists: list[SpotifyPlaylist]
