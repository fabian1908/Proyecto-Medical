import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'doctor')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isDoctor } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = {
    admin: isAdmin,
    doctor: isDoctor,
  };

  const isAllowed = allowedRoles ? allowedRoles.some(role => userRoles[role]) : true;

  if (!isAllowed) {
    // Redirigir a una página de "No autorizado" o a la home
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;