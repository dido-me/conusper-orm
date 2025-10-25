import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@app/modules/auth/stores/authStore';

export default function Login() {
  const { signInWithGoogle, loading, user } = useAuthStore();
  const navigate = useNavigate();

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/private/dashboard');
    }
  }, [user, navigate]);

  // Verificar si hay errores en la URL (cuando Supabase redirige de vuelta)
  useEffect(() => {
    const checkForAuthErrors = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      const errorCode = urlParams.get('error_code');
      
      if (error) {
        // Limpiar la URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Mostrar el error apropiado
        if (errorDescription && errorDescription.includes('Email no autorizado')) {
          toast.error('Email no autorizado. Póngase en contacto con el administrador.');
        } else if (errorDescription && errorDescription.includes('access_denied')) {
          toast.error('Acceso denegado. Por favor, inténtalo de nuevo.');
        } else if (errorCode === '500' || error === 'server_error') {
          // Error del servidor (posiblemente del trigger de la DB)
          toast.error('Email no autorizado. Póngase en contacto con el administrador.');
        } else {
          toast.error('Error en la autenticación. Por favor, inténtalo de nuevo.');
        }
      }
    };

    // Listener para capturar eventos de hash que pueden contener errores
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('error=')) {
        const params = new URLSearchParams(hash.substring(1));
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        if (error) {
          window.location.hash = '';
          
          if (errorDescription && errorDescription.includes('Email no autorizado')) {
            toast.error('Email no autorizado. Póngase en contacto con el administrador.');
          } else if (error === 'access_denied') {
            toast.error('Acceso denegado. Por favor, inténtalo de nuevo.');
          } else {
            toast.error('Error en la autenticación. Por favor, inténtalo de nuevo.');
          }
        }
      }
    };

    checkForAuthErrors();
    handleHashChange();
    
    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl font-bold mb-6">
              Iniciar Sesión
            </h2>
            
            <div className="text-center mb-6">
              <p className="text-base-content/70">
                Accede a tu cuenta de Conusper Finance
              </p>
            </div>

            <div className="card-actions justify-center">
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="btn btn-primary btn-wide gap-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Conectando...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuar con Google
                  </>
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-base-content/50">
                Al continuar, aceptas nuestros términos de servicio
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}