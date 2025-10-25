import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@app/modules/auth/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, initialized, initialize } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // Redireccionar al login si no está autenticado
  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate('/login');
    }
  }, [user, loading, initialized, navigate]);

  // Mostrar loading mientras se inicializa la autenticación
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, no renderizar nada (useEffect se encarga de la redirección)
  if (!user) {
    return null;
  }

  // Si hay usuario autenticado, mostrar el contenido protegido
  return <>{children}</>;
}