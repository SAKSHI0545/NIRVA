import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MusicPage from './pages/MusicPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="chat" element={<ChatbotPage />} />
        <Route path="music" element={<MusicPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
