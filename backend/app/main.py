from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.connection import close_mongo_connection, connect_to_mongo
from app.middleware.error_handler import register_error_handlers
from app.routes import analytics, auth, chat, community, journal, music, settings as settings_routes, spotify_routes


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(title=settings.app_name, version="1.0.0")

    allowed_origins = {
        settings.frontend_origin,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    }

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(allowed_origins),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_error_handlers(app)

    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])
    app.include_router(journal.router, prefix="/api/journals", tags=["Journals"])
    app.include_router(community.router, prefix="/api/community", tags=["Community"])
    app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
    app.include_router(music.router, prefix="/api/music", tags=["Music"])
    app.include_router(spotify_routes.router, prefix="/api/music", tags=["Spotify Music"])
    app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
    app.include_router(settings_routes.router, prefix="/api/settings", tags=["Settings"])

    app.add_event_handler("startup", connect_to_mongo)
    app.add_event_handler("shutdown", close_mongo_connection)

    @app.get("/health", tags=["System"])
    async def health_check() -> dict[str, str]:
        return {"status": "healthy", "service": settings.app_name}

    return app


app = create_app()
