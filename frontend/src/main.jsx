import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import * as Sentry from "@sentry/react"
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Initialize Sentry for error tracking and performance monitoring
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    // Tracks React component errors
    Sentry.browserTracingIntegration(),
    // Sends console.log, console.warn, and console.error to Sentry
    Sentry.captureConsoleIntegration({ levels: ["log", "warn", "error"] }),
    // Tracks user interactions (clicks, navigation)
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Debug mode (only in development)
  debug: import.meta.env.VITE_SENTRY_DEBUG === 'true',
  // Environment
  environment: import.meta.env.MODE,
})

// Make touch/wheel events passive by default to improve scroll performance
// This prevents the warning about non-passive event listeners
if (typeof window !== 'undefined') {
  const supportsPassive = (() => {
    let support = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() { support = true; }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {}
    return support;
  })();

  if (supportsPassive) {
    // Override addEventListener to make scroll-blocking events passive by default
    const addEvent = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (['touchstart', 'touchmove', 'wheel', 'mousewheel'].includes(type)) {
        const opts = typeof options === 'object' ? options : {};
        if (opts.passive === undefined) {
          opts.passive = true;
        }
        return addEvent.call(this, type, listener, opts);
      }
      return addEvent.call(this, type, listener, options);
    };
  }
}

export const API_URL = import.meta.env.VITE_API_URL;

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

// Create root only once and reuse it
const rootElement = document.getElementById('root');
let root;

if (!rootElement._reactRoot) {
  root = createRoot(rootElement);
  rootElement._reactRoot = root;
} else {
  root = rootElement._reactRoot;
}

root.render(
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
