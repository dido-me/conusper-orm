import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@app/modules/auth/stores/authStore';

export default function RedirectHandler() {
  const { user, initialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized) {
      if (user) {
        navigate('/private/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [user, initialized, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4 text-lg">Redirigiendo...</p>
      </div>
    </div>
  );
}