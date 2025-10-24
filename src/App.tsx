import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RedirectHandler from './components/RedirectHandler';

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

  return (
    <Routes>
      {/* Ruta pública para login */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta por defecto - index route */}
      <Route index element={<RedirectHandler />} />
      
      {/* Ruta catch-all para URLs no encontradas */}
      <Route path="*" element={<RedirectHandler />} />
    </Routes>
  );
}

export default App;
