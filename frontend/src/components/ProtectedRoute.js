import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const user = localStorage.getItem('user');

  // If not authenticated, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
}

export default ProtectedRoute;

