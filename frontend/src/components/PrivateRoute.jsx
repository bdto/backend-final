import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './Loader';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
