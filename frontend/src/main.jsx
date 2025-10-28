import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');

    if (token && userParam) {
      localStorage.setItem('token', token);
      const userData = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">Autenticando...</div>;
}

function AppWrapper() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    // Check if this is a Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');

    if (token && userParam) {
      localStorage.setItem('token', token);
      const userData = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem('user', JSON.stringify(userData));
      // Clean URL and reload to update state
      window.history.replaceState({}, document.title, '/');
      window.location.reload();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return <App user={user} onLogout={handleLogout} />;
}

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    navigate('/', { replace: true });
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginWrapper />
            </PublicRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <AppWrapper />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
