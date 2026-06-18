# 🌿 NIRVA| Emotional Wellness Platform

NIRVA is a full-stack emotional wellness platform that helps users track their emotions, maintain personal journals, analyze mood trends, and receive personalized music recommendations. The platform focuses on promoting mental well-being through secure journaling, sentiment analysis, analytics, and community sharing.

---

## ✨ Features

- 🔐 Secure User Authentication (JWT)
- 📝 Personal Journal Management
- 🌍 Public & Private Journaling
- 📊 Mood Analytics Dashboard
- 😊 Sentiment Analysis using TextBlob
- 🎵 Mood-Based Spotify Playlist Recommendations
- 👤 User Profile Management
- 📱 Responsive User Interface
- 💾 MongoDB Database Integration
- ⚡ RESTful APIs built with FastAPI

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python

### Database
- MongoDB

### Authentication
- JWT (JSON Web Token)

### External APIs
- Spotify Web API

### Sentiment Analysis
- TextBlob

---

## 📂 Project Structure

```
NIRVA-T
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── database
│   │   ├── dependencies
│   │   ├── middleware
│   │   ├── models
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## 🧠 Application Workflow

```
React Frontend
      │
      ▼
Axios API Calls
      │
      ▼
FastAPI Backend
      │
      ▼
Routes
      │
      ▼
Services
      │
      ▼
Repositories
      │
      ▼
MongoDB
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/SAKSHI0545/NIRVA-T.git
cd NIRVA-T
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```
http://localhost:8000
```

API Documentation:

```
http://localhost:8000/docs
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
APP_NAME=NIRVA API
ENVIRONMENT=development

MONGODB_URL=your_mongodb_url
DATABASE_NAME=nirva

JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

FRONTEND_ORIGIN=http://localhost:5173

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_MARKET=IN
```

---

## 📸 Screenshots

Add screenshots here:

- Login Page
- Dashboard
- Journal Page
- Community Journals
- Analytics Dashboard
- Spotify Recommendations

---

## 🌱 Future Enhancements

- AI-powered chatbot
- Emotion-aware journal insights
- Personalized wellness recommendations
- Community interactions (likes & comments)
- Daily wellness reminders
- Mood prediction using machine learning

---

## 👩‍💻 Developer

**Sakshi Marne**

GitHub: https://github.com/SAKSHI0545

---

## 📄 License

This project is developed for educational and learning purposes.