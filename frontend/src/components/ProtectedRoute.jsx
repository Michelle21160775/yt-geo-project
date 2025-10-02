import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // Check if this is a Google OAuth callback
  const urlParams = new URLSearchParams(location.search);
  const hasOAuthParams = urlParams.has('token') && urlParams.has('user');

  // Allow access if authenticated OR if it's an OAuth callback
  if (!token || !user) {
    if (!hasOAuthParams) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
