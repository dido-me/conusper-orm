import { useAuthStore } from "@app/modules/auth/stores/authStore";
import { useState } from "react";
import toast from "react-hot-toast";
import { Outlet, useNavigate, NavLink } from "react-router";
import ProtectedRoute from "@app/modules/general/components/ProtectedRoute";

export default function Layout() {
  const { user, signOut, loading } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  const menuItems = [
    {
      icon: "🏠",
      label: "Dashboard",
      path: "/private/dashboard",
    },
    { icon: "💰", label: "Finanzas", path: "/private/finance" },
    { icon: "📊", label: "Reportes", path: "/reportes" },
    { icon: "🎯", label: "Metas", path: "/metas" },
    { icon: "🏷️", label: "Categorías", path: "/categorias" },
    { icon: "⚙️", label: "Configuración", path: "/configuracion" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-200">
        {/* Navbar */}
        <div className="navbar bg-base-100 shadow-lg relative z-50 h-16">
          {/* Mobile menu button */}
          <div className="navbar-start">
            <button
              className="btn btn-square btn-ghost lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop sidebar toggle */}
            <button
              className="btn btn-square btn-ghost hidden lg:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={sidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                />
              </svg>
            </button>

            <a className="btn btn-ghost text-xl font-bold text-primary">
              Conusper Finance
            </a>
          </div>
          

          {/* Right side - User menu */}
          <div className="navbar-end">
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="indicator">
                <button className="btn btn-ghost btn-circle">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <span className="badge badge-xs badge-primary indicator-item">
                  3
                </span>
              </div>

              {/* User dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    {user?.user_metadata?.avatar_url ? (
                      <img alt="Avatar" src={user.user_metadata.avatar_url} />
                    ) : (
                      <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li className="menu-title">
                    <span>{user?.user_metadata?.full_name || user?.email}</span>
                  </li>
                  <li>
                    <a className="justify-between">
                      Perfil
                      <span className="badge badge-sm">Nuevo</span>
                    </a>
                  </li>
                  <li>
                    <a>Configuración</a>
                  </li>
                  <li>
                    <a>Ayuda</a>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="text-error"
                    >
                      {loading ? "Cerrando..." : "Cerrar Sesión"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
          bg-base-100 shadow-lg transition-all duration-300 ease-in-out fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
          >
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <div className="h-full bg-base-100 relative z-50 overflow-y-auto">
              {/* Sidebar header */}
              <div className="p-4 border-b border-base-200 lg:hidden">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Menú</h2>
                  <button
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Menu */}
              <ul
                className={`menu space-y-2 ${sidebarCollapsed ? "p-1" : "p-4"}`}
              >
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <div
                      className={
                        sidebarCollapsed ? "tooltip tooltip-right" : ""
                      }
                      data-tip={sidebarCollapsed ? item.label : ""}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `flex items-center rounded-lg transition-colors ${
                          isActive 
                            ? "bg-primary text-primary-content hover:bg-primary/90" 
                            : "hover:bg-base-200"
                        } ${
                          sidebarCollapsed
                            ? "lg:justify-center lg:p-3 lg:w-14 lg:h-14 lg:mx-auto lg:mb-1"
                            : "gap-3 px-4 py-3"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span
                          className={`shrink-0 ${
                            sidebarCollapsed ? "lg:text-xl" : "text-xl"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span
                          className={`font-medium transition-opacity duration-300 ${
                            sidebarCollapsed ? "lg:hidden" : ""
                          }`}
                        >
                          {item.label}
                        </span>
                      </NavLink>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Collapsed help button */}
              {sidebarCollapsed && (
                <div className="absolute bottom-4 left-1 right-1 hidden lg:block">
                  <button
                    className="btn btn-primary btn-sm w-14 h-14 rounded-lg mx-auto block p-0"
                    title="¿Necesitas ayuda?"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main
            className={`
          flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:ml-0" : "lg:ml-0"}
        `}
          >
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
