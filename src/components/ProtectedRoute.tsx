import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role?.toLowerCase().trim() !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
