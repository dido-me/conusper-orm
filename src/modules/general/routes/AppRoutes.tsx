import Login from "@app/modules/auth/pages/Login";
import Dashboard from "@app/modules/dashboard/pages/Dashboard";
import Finance from "@app/modules/finance/pages/Finance";
import RedirectHandler from "@app/modules/general/components/RedirectHandler";
import { Route, Routes } from "react-router";
import Layout from "@app/modules/general/layouts/Layout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública para login */}
      <Route path="/login" element={<Login />} />

      {/* Rutas privadas - todas usan el mismo layout */}
      <Route path="/private" element={<Layout />}>
        {/* Rutas hijas que se renderizan en el <Outlet /> del PrivateLayout */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="finance" element={<Finance />} />
      </Route>

      {/* Ruta por defecto - index route */}
      <Route index element={<RedirectHandler />} />

      {/* Ruta catch-all para URLs no encontradas */}
      <Route path="*" element={<RedirectHandler />} />
    </Routes>
  );
}
