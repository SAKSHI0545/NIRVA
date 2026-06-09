# NIRVA

NIRVA is a local-development AI-powered mental wellness platform built with FastAPI, MongoDB, React, Vite, Tailwind CSS, Axios, JWT authentication, TextBlob sentiment analysis, and Recharts.

This scaffold is intentionally organized like a professional product, not a single-file CRUD demo. The backend keeps routes thin, pushes business behavior into services, and isolates MongoDB access in repositories. The frontend uses routed pages, an Axios service layer, React Context for auth/theme state, and reusable interface components.

## Project Structure

```text
backend/
  app/
    api/              Reserved for future API version composition.
    core/             Settings and security primitives such as JWT and bcrypt.
    database/         MongoDB connection lifecycle and index creation.
    models/           MongoDB document factories and document normalization.
    schemas/          Pydantic request and response contracts.
    services/         Business logic for auth, journals, chat, emotion, music, and analytics.
    repositories/     Persistence layer for users, journal entries, chat messages, and music recommendations.
    utils/            Shared helpers.
    middleware/       Centralized application error handling.
    dependencies/     FastAPI dependency providers for auth and services.
    routes/           HTTP endpoints for each product module.
    main.py           FastAPI application factory and router registration.
frontend/
  src/
    components/       Reusable UI building blocks.
    pages/            Login, register, dashboard, journal, analytics, chat, music, settings, profile, and 404 pages.
    layouts/          Authenticated app shell with navigation.
    services/         Axios API integration layer.
    hooks/            Shared data-fetching hooks.
    context/          Auth and theme state providers.
    routes/           Protected route wrapper.
    utils/            Formatting and chart helpers.
    assets/           Place for images, icons, and static assets.
    App.jsx           React route tree.
```

## MongoDB Collections

`users`

- `id`, `username`, `email`, `password_hash`, `created_at`

`journal_entries`

- `id`, `user_id`, `mood`, `content`, `sentiment`, `created_at`, `updated_at`

`chat_messages`

- `id`, `user_id`, `user_message`, `ai_response`, `created_at`

`music_recommendations`

- `id`, `user_id`, `detected_mood`, `target_mood`, `recommendation_type`, `playlists`, `created_at`

## Backend Responsibilities

- `app/core/config.py` loads environment configuration through Pydantic settings.
- `app/core/security.py` hashes passwords with bcrypt and signs JWT access tokens.
- `app/database/connection.py` manages Motor, database selection, and indexes.
- `app/schemas/*.py` define validated API input and output models.
- `app/repositories/*.py` contain MongoDB queries and ownership checks.
- `app/services/auth_service.py` handles registration, login, profile updates, and password changes.
- `app/services/journal_service.py` creates, edits, deletes, searches, and filters journal entries.
- `app/services/sentiment_service.py` wraps TextBlob so it can later be replaced by OpenAI, Gemini, or HuggingFace.
- `app/services/chatbot_service.py` provides rule-based chat responses behind an AI-ready service boundary.
- `app/services/emotion_engine.py` detects emotional state and produces wellness guidance.
- `app/services/music_service.py` maps emotional state to playlist categories and can later call Spotify.
- `app/services/analytics_service.py` builds summary metrics, distributions, and time trends.
- `app/routes/*.py` expose the REST API while delegating logic to services.

## Frontend Responsibilities

- `src/services/apiClient.js` centralizes Axios base URL and JWT headers.
- `src/context/AuthContext.jsx` owns login, register, logout, current user, and token persistence.
- `src/context/ThemeContext.jsx` stores local theme preference.
- `src/layouts/AppLayout.jsx` provides the authenticated SaaS navigation shell.
- `src/pages/JournalPage.jsx` handles create, edit, delete, search, mood filter, and date filter workflows.
- `src/pages/AnalyticsPage.jsx` renders mood, sentiment, weekly, and monthly charts.
- `src/pages/ChatbotPage.jsx` sends messages and reloads persistent conversation history.
- `src/pages/MusicPage.jsx` generates and lists mood-based music recommendations.
- `src/pages/SettingsPage.jsx` updates profile, email, password, theme, and account settings.

## Local Setup

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python -m textblob.download_corpora
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Swagger docs are available at `http://localhost:8000/docs`.

MongoDB must be running locally at `mongodb://localhost:27017`, or update `backend/.env`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Security Notes

- Passwords are never stored as plain text.
- JWTs are sent with `Authorization: Bearer <token>`.
- Protected routes require a valid token and current user lookup.
- User-owned resources are queried with both resource id and `user_id`.
- The sample `.env.example` secret must be replaced for any real deployment.

## Future Extension Points

- Replace `SentimentService` with an OpenAI, Gemini, or HuggingFace adapter.
- Replace `ChatbotService.generate_response` with an LLM client while keeping route contracts stable.
- Extend `MusicService` with Spotify OAuth and playlist search.
- Add export/delete account workflows.
- Add automated tests and CI once the local app behavior is finalized.
