# Deployment Guide - GitHub + Vercel

## Flujo de Deployment: GitHub → Vercel

Este proyecto usa GitHub como repositorio y Vercel para el deployment automático.

### 1. Configuración Inicial en Vercel

#### A. Conectar Repositorio GitHub
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "New Project"
3. Selecciona "Import Git Repository"
4. Conecta tu cuenta de GitHub si no lo has hecho
5. Selecciona este repositorio: `conusper-finance`

#### B. Configuración de Variables de Entorno
En el dashboard de Vercel, ve a Settings > Environment Variables y agrega:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Importante**: Asegúrate de marcar estas variables para todos los entornos (Production, Preview, Development).

### 2. Configuración Automática del Build

Vercel detectará automáticamente que es un proyecto Vite con esta configuración:

- **Framework Preset**: Vite
- **Build Command**: `npm run build` (detectado automáticamente)
- **Output Directory**: `dist` (detectado automáticamente)
- **Install Command**: `npm install` (detectado automáticamente)

### 3. Deployment Automático

#### Branches y Deployments
- **Production**: Los commits a la rama `main` (o `master`) se deployarán automáticamente a producción
- **Preview**: Los commits a otras ramas generarán deployments de preview
- **Pull Requests**: Cada PR tendrá su propio deployment de preview

#### Proceso de Deployment
1. **Push a GitHub**:
   ```bash
   git add .
   git commit -m "feat: prepare for vercel deployment"
   git push origin main
   ```

2. **Vercel Build Automático**:
   - Vercel detecta el push al repositorio
   - Ejecuta `npm install`
   - Ejecuta `npm run prebuild` (verifica variables de entorno)
   - Ejecuta `npm run build`
   - Deploya automáticamente

3. **Confirmación**:
   - Recibirás una notificación en GitHub (si está configurado)
   - El deployment estará disponible en tu dominio de Vercel

### 4. Configuración de Routing

El archivo `vercel.json` está configurado para manejar el client-side routing de React Router:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Esto asegura que todas las rutas (`/private/dashboard`, `/private/finance`, etc.) se redirijan al `index.html` y React Router maneje la navegación.

### 5. Optimizaciones para GitHub + Vercel

#### A. Code Splitting
El build está configurado para dividir el código en chunks separados:
- `vendor`: React y React DOM
- `router`: React Router
- `supabase`: Supabase cliente

#### B. Build Optimizations
- **Source Maps**: Deshabilitados en producción para mejor rendimiento
- **Vercel Ignore**: Archivos innecesarios excluidos del deployment

### 6. Workflow Recomendado

#### Para Desarrollo:
```bash
# 1. Crear nueva rama para feature
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar y hacer commits
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Push para crear deployment preview
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub
# 5. Vercel creará automáticamente un deployment preview
```

#### Para Producción:
```bash
# 1. Merge del PR a main
git checkout main
git pull origin main

# 2. Vercel deployará automáticamente a producción
```

### 7. Monitoreo y Logs

#### En Vercel Dashboard:
- **Deployments**: Ver historial de deployments
- **Functions**: Logs de funciones serverless (si las usas)
- **Analytics**: Métricas de performance
- **Settings**: Configuración del proyecto

#### En GitHub:
- **Actions**: Si tienes GitHub Actions configuradas
- **Pull Requests**: Ver deployments preview en cada PR
- **Commits**: Estado de deployment en cada commit

### 8. Troubleshooting

#### Build Errors:
1. **Variables de entorno faltantes**: 
   - Verificar en Vercel Settings > Environment Variables
   - El script `prebuild` te avisará si faltan

2. **TypeScript errors**:
   - Ejecutar `npm run build` localmente primero
   - Verificar que no hay errores de tipos

3. **404 en rutas**:
   - Verificar que `vercel.json` esté en la raíz del repositorio
   - Confirmar que se subió a GitHub

#### GitHub Integration Issues:
1. **Deployments no automáticos**:
   - Verificar permisos de GitHub en Vercel
   - Re-conectar el repositorio si es necesario

2. **Preview deployments no funcionan**:
   - Verificar configuración de branches en Vercel

### 9. Comandos Útiles

#### Desarrollo Local:
```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build local para testing
npm run build

# Preview local del build
npm run preview

# Lint del código antes de commit
npm run lint
```

#### Git Workflow:
```bash
# Verificar estado antes de commit
git status

# Ver cambios
git diff

# Commit con mensaje descriptivo
git commit -m "feat: descripción del cambio"

# Push para trigger deployment
git push origin main
```

### 10. Variables de Entorno para Diferentes Ambientes

Si necesitas diferentes configuraciones para preview vs producción:

#### En Vercel:
- **Production**: Variables para tu base de datos de producción
- **Preview**: Variables para base de datos de staging/testing
- **Development**: Variables para desarrollo local

Ejemplo:
```bash
# Production
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=prod_key_here

# Preview  
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=staging_key_here
```