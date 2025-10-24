import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';

export default function Dashboard() {
  const { user, signOut, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Conusper Finance</a>
        </div>
        
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    alt="Avatar"
                    src={user.user_metadata.avatar_url}
                  />
                ) : (
                  <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between">
                  Perfil
                  <span className="badge">Nuevo</span>
                </a>
              </li>
              <li><a>Configuración</a></li>
              <li>
                <button 
                  onClick={handleSignOut}
                  disabled={loading}
                  className="text-error"
                >
                  {loading ? 'Cerrando...' : 'Cerrar Sesión'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="hero bg-base-100 rounded-lg shadow-xl">
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

        {/* Cards de funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                💰 Finanzas
                <div className="badge badge-secondary">NUEVO</div>
              </h2>
              <p>Administra tus finanzas personales de manera inteligente.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Ver más</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">📊 Reportes</h2>
              <p>Visualiza tus gastos e ingresos con gráficos detallados.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Ver más</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">🎯 Metas</h2>
              <p>Establece y alcanza tus objetivos financieros.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Ver más</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}