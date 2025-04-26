import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { user,  loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    if (!user?.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If no roles are specified or the user's role is included
    if (!requiredRoles || requiredRoles.includes(userRole)) {
        return children;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
