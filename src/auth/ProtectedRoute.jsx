import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function AuthLoading() {
  return <main className="auth-loading"><div className="auth-spinner"/><p>Loading your progress hub…</p></main>;
}

export default function ProtectedRoute({ role }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoading/>;
  if (!user || !profile) return <Navigate to="/login" replace state={{ from: location.pathname }}/>;
  if (profile.role !== role) {
    return <Navigate to={profile.role === 'student' ? '/student/my-progress' : '/teacher/dashboard'} replace/>;
  }
  return <Outlet/>;
}
