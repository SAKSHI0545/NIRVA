import asyncio
import html
import re
import time
from typing import Any

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.spotify import SpotifyPlaylist, SpotifyRecommendationsResponse


SPOTIFY_MOOD_MAP: dict[str, dict[str, list[str]]] = {
    "happy": {
        "keywords": ["happy hits", "feel good", "good vibes"],
        "categories": ["mood", "pop", "party"],
    },
    "sad": {
        "keywords": ["sad songs", "heartbreak", "comfort music"],
        "categories": ["mood", "chill", "acoustic"],
    },
    "stressed": {
        "keywords": ["stress relief", "calming music", "relaxing piano"],
        "categories": ["wellness", "chill", "ambient"],
    },
    "anxious": {
        "keywords": ["anxiety relief", "calm vibes", "breathing meditation"],
        "categories": ["wellness", "sleep", "ambient"],
    },
    "calm": {
        "keywords": ["peaceful music", "calm instrumental", "soft chill"],
        "categories": ["chill", "ambient", "wellness"],
    },
    "energetic": {
        "keywords": ["energy boost", "workout motivation", "dance hits"],
        "categories": ["workout", "dance", "pop"],
    },
    "focused": {
        "keywords": ["deep focus", "study music", "focus flow"],
        "categories": ["focus", "instrumental", "electronic"],
    },
    "balanced": {
        "keywords": ["balanced mood", "mindful music", "daily wellness"],
        "categories": ["wellness", "chill", "mood"],
    },
}


class SpotifyService:
    """Server-side Spotify client using the OAuth client credentials flow."""

    auth_url = "https://accounts.spotify.com/api/token"
    api_base_url = "https://api.spotify.com/v1"
    _access_token: str | None = None
    _expires_at: float = 0
    _token_lock = asyncio.Lock()

    def __init__(self) -> None:
        self.client_id = settings.spotify_client_id
        self.client_secret = settings.spotify_client_secret
        self.market = settings.spotify_market

    async def recommendations_for_mood(self, mood: str, limit: int = 10) -> SpotifyRecommendationsResponse:
        normalized_mood = self._normalize_mood(mood)
        search_terms = self._search_terms_for(normalized_mood)
        playlists: list[SpotifyPlaylist] = []
        seen_ids: set[str] = set()

        for term in search_terms:
            data = await self._request(
                "GET",
                "/search",
                params={
                    "q": term,
                    "type": "playlist",
                    "limit": min(10, limit),
                    "market": self.market,
                },
            )
            items = data.get("playlists", {}).get("items", [])
            for item in items:
                playlist_id = item.get("id") if item else None
                if not playlist_id or playlist_id in seen_ids:
                    continue
                playlist = await self.playlist_by_id(playlist_id)
                playlists.append(playlist)
                seen_ids.add(playlist.playlist_id)
                if len(playlists) == limit:
                    return SpotifyRecommendationsResponse(
                        mood=normalized_mood,
                        search_terms=search_terms,
                        playlists=playlists,
                    )

        if not playlists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Spotify playlists found for this mood.")

        return SpotifyRecommendationsResponse(mood=normalized_mood, search_terms=search_terms, playlists=playlists)

    async def playlist_by_id(self, playlist_id: str) -> SpotifyPlaylist:
        data = await self._request(
            "GET",
            f"/playlists/{playlist_id}",
            params={
                "market": self.market,
                "fields": "id,name,description,images,external_urls,owner(display_name,id),followers(total)",
            },
        )
        return self._parse_playlist(data)

    def mood_map(self) -> dict[str, dict[str, list[str]]]:
        return SPOTIFY_MOOD_MAP

    async def _request(
        self,
        method: str,
        path: str,
        params: dict[str, Any] | None = None,
        retry_token: bool = True,
    ) -> dict[str, Any]:
        token = await self._get_access_token()
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                response = await client.request(
                    method,
                    f"{self.api_base_url}{path}",
                    params=params,
                    headers={"Authorization": f"Bearer {token}"},
                )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Unable to reach Spotify.") from exc

        if response.status_code == status.HTTP_401_UNAUTHORIZED and retry_token:
            await self._get_access_token(force_refresh=True)
            return await self._request(method, path, params=params, retry_token=False)

        if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
            retry_after = response.headers.get("Retry-After")
            detail = (
                f"Spotify rate limit reached. Try again after {retry_after} seconds."
                if retry_after
                else "Spotify rate limit reached. Try again shortly."
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=detail,
            )

        if response.status_code == status.HTTP_404_NOT_FOUND:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Spotify playlist not found.")

        if response.status_code >= 400:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Spotify returned an unexpected error.")

        return response.json()

    async def _get_access_token(self, force_refresh: bool = False) -> str:
        if not self.client_id or not self.client_secret:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Spotify is not configured. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to backend/.env.",
            )

        if not force_refresh and self._access_token and time.monotonic() < self._expires_at:
            return self._access_token

        async with self._token_lock:
            if not force_refresh and self._access_token and time.monotonic() < self._expires_at:
                return self._access_token

            try:
                async with httpx.AsyncClient(timeout=12.0) as client:
                    response = await client.post(
                        self.auth_url,
                        data={"grant_type": "client_credentials"},
                        auth=(self.client_id, self.client_secret),
                        headers={"Content-Type": "application/x-www-form-urlencoded"},
                    )
            except httpx.RequestError as exc:
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Unable to authenticate with Spotify.") from exc

            if response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
                raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Spotify token rate limit reached.")

            if response.status_code >= 400:
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Spotify credentials are invalid.")

            payload = response.json()
            token = payload.get("access_token")
            expires_in = int(payload.get("expires_in", 3600))
            if not token:
                raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Spotify did not return an access token.")

            self.__class__._access_token = token
            self.__class__._expires_at = time.monotonic() + max(60, expires_in - 60)
            return token

    def _normalize_mood(self, mood: str) -> str:
        normalized = mood.lower().strip()
        aliases = {
            "motivated": "energetic",
            "tired": "calm",
            "angry": "stressed",
            "neutral": "balanced",
        }
        normalized = aliases.get(normalized, normalized)
        if normalized not in SPOTIFY_MOOD_MAP:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported mood. Choose one of: {', '.join(SPOTIFY_MOOD_MAP)}.",
            )
        return normalized

    def _search_terms_for(self, mood: str) -> list[str]:
        mapping = SPOTIFY_MOOD_MAP[mood]
        keywords = mapping["keywords"]
        categories = mapping["categories"]
        return [f"{keyword} {category}" for keyword, category in zip(keywords, categories)]

    def _parse_playlist(self, item: dict[str, Any]) -> SpotifyPlaylist:
        images = item.get("images") or []
        owner = item.get("owner") or {}
        followers = item.get("followers") or {}
        external_urls = item.get("external_urls") or {}
        return SpotifyPlaylist(
            playlist_id=item.get("id", ""),
            playlist_name=item.get("name", "Untitled playlist"),
            description=self._clean_description(item.get("description") or ""),
            image_url=images[0].get("url") if images else None,
            spotify_url=external_urls.get("spotify", ""),
            owner=owner.get("display_name") or owner.get("id") or "Spotify",
            followers=followers.get("total") or 0,
        )

    def _clean_description(self, description: str) -> str:
        text = re.sub(r"<[^>]+>", "", description)
        return html.unescape(text).strip()
