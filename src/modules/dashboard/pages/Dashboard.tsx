import { useAuthStore } from '@app/modules/auth/stores/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <>
      {/* Hero Section */}
      <div className="hero bg-base-100 rounded-lg shadow-xl mb-6">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">¡Bienvenido!</h1>
            <p className="py-6">
              Hola {user?.user_metadata?.full_name || user?.email}!
              Has iniciado sesión exitosamente en Conusper Finance.
            </p>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Último acceso</div>
                <div className="stat-value text-primary">
                  {user?.last_sign_in_at ? 
                    new Date(user.last_sign_in_at).toLocaleDateString('es-ES') : 
                    'Hoy'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}