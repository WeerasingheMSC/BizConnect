import { Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireUserType?: 'user' | 'business';
}

const ProtectedRoute = ({ children, requireUserType }: ProtectedRouteProps) => {
  const authenticated = isAuthenticated();
  const user = getStoredUser();

  // If not authenticated, redirect to sign in
  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If specific user type is required, check if user matches
  if (requireUserType && user?.userType !== requireUserType) {
    // Redirect to appropriate dashboard
    if (user?.userType === 'business') {
      return <Navigate to="/business/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
