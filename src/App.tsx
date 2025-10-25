import { useEffect } from 'react';
import { useAuthStore } from '@app/modules/auth/stores/authStore';
import AppRoutes from '@app/modules/general/routes/AppRoutes';

function App() {
  const { initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
