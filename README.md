# Conusper Finance

Una aplicación de finanzas personales construida con React, TypeScript, Supabase y DaisyUI.

## Características

- 🔐 Autenticación con Google mediante Supabase
- 🎨 UI moderna con DaisyUI y TailwindCSS
- 🛡️ Rutas protegidas por autenticación
- 📊 Dashboard personalizado
- 🏪 Estado global con Zustand

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica_de_supabase
```

### 2. Configuración de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **Authentication > Providers**
4. Habilita **Google** como proveedor:
   - Obtén las credenciales de Google Cloud Console
   - Configura el Client ID y Client Secret
   - Añade las URLs de redirección autorizadas:
     - Para desarrollo: `http://localhost:5173`
     - Para producción: `https://tu-dominio.com`

5. En **Authentication > URL Configuration**:
   - Site URL: `http://localhost:5173` (desarrollo) o tu dominio de producción
   - Redirect URLs: 
     - `http://localhost:5173/dashboard`
     - `https://tu-dominio.com/dashboard`

### 3. Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Dashboard.tsx       # Página principal después del login
│   ├── Login.tsx          # Componente de login con Google
│   └── ProtectedRoute.tsx # Componente para proteger rutas
├── stores/
│   └── authStore.ts       # Store de Zustand para autenticación
├── supabase/
│   └── client.tsx         # Cliente de Supabase
└── App.tsx               # Componente principal con rutas
```

## Tecnologías Utilizadas

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Supabase** - Backend como servicio
- **DaisyUI** - Componentes de UI
- **TailwindCSS** - Utilidades de CSS
- **Zustand** - Gestión de estado
- **React Router** - Enrutamiento

## Funcionalidades de Autenticación

- ✅ Login con Google OAuth
- ✅ Protección de rutas
- ✅ Estado global de autenticación
- ✅ Redirección automática
- ✅ Persistencia de sesión
- ✅ Logout seguro

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta el linter
- `npm run preview` - Previsualiza la build de producción

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
