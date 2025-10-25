# Módulo Finance - Control de Gastos

Este módulo contiene la migración completa del proyecto `control-gastos-firebase` al proyecto `conusper-finance`, adaptado para usar Supabase como base de datos y DaisyUI como librería de componentes.

## Estructura del Módulo

```
src/modules/finance/
├── components/           # Componentes UI con DaisyUI
│   ├── Header.tsx
│   ├── Summary.tsx
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   ├── ReportView.tsx
│   ├── Modal.tsx
│   └── Icons.tsx
├── hooks/               # Hooks para Supabase
│   ├── useTransactions.ts
│   └── useEntities.ts
├── stores/              # Estado global con Zustand
│   ├── transactionStore.ts
│   ├── entityStore.ts
│   └── uiStore.ts
├── types/               # Tipos TypeScript
│   └── finance.types.ts
├── constants/           # Constantes
│   └── finance.constants.ts
├── database/            # Scripts SQL
│   └── migration.sql
├── pages/               # Páginas principales
│   └── Finance.tsx
└── index.ts            # Exportaciones
```

## Configuración de la Base de Datos

### 1. Ejecutar el script SQL

1. Ve a tu proyecto de Supabase
2. Abre el editor SQL
3. Ejecuta el script en `database/migration.sql`

Este script creará:
- Tabla `entities` (personas/empresas)
- Tabla `transactions` (transacciones)
- Índices para optimización
- Políticas de seguridad (RLS)
- Funciones auxiliares

### 2. Variables de entorno

Asegúrate de tener configuradas las variables de entorno en tu archivo `.env`:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=tu_supabase_anon_key
```

## Características Principales

### ✅ Migradas del proyecto original

- **Gestión de transacciones**: Crear, editar, eliminar ingresos y gastos
- **Gestión de entidades**: Personas y empresas involucradas en transacciones
- **Reportes**: Filtros por entidad y visualización detallada
- **Exportar/Importar**: Backup y restauración de datos
- **Categorías**: Clasificación de transacciones
- **Interfaz responsive**: Adaptada para móviles y desktop

### 🆕 Mejoras implementadas

- **Supabase**: Base de datos PostgreSQL en la nube
- **DaisyUI**: Componentes modernos y accesibles
- **Zustand**: Estado global simplificado
- **TypeScript**: Tipado completo
- **React Hot Toast**: Notificaciones mejoradas
- **Optimización**: Queries eficientes y caching
- **Seguridad**: Row Level Security (RLS) en Supabase

## Uso

### Importar y usar el módulo

```tsx
import { Finance } from './modules/finance';

function App() {
  return <Finance />;
}
```

### Usar componentes individuales

```tsx
import { 
  TransactionList, 
  Summary, 
  useTransactions 
} from './modules/finance';
```

## API y Hooks

### useTransactions
```tsx
const {
  transactions,        // Lista de transacciones
  loading,            // Estado de carga
  createTransaction,  // Crear transacción
  deleteTransaction,  // Eliminar transacción
  getStats,          // Obtener estadísticas
} = useTransactions();
```

### useEntities
```tsx
const {
  entities,           // Lista de entidades
  loading,            // Estado de carga
  createEntity,       // Crear entidad
  findOrCreateEntity, // Buscar o crear entidad
} = useEntities();
```

## Stores (Zustand)

### Transaction Store
- Gestiona el estado de las transacciones
- Filtros y operaciones locales
- Sincronización con hooks

### Entity Store
- Gestiona el estado de las entidades
- Búsqueda y creación optimizada

### UI Store
- Estado de la interfaz (vistas, modales, filtros)
- Navegación y UX

## Tipos Principales

```typescript
interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  amount: number;
  description: string;
  date: string;
  entity_id: string;
  entity?: Entity;
}

interface Entity {
  id: string;
  name: string;
}
```

## Migración de Datos

Si tienes datos del proyecto original, puedes:

1. **Exportar** desde el proyecto original (función export)
2. **Importar** en este módulo (botón importar en la interfaz)

El sistema mantendrá la compatibilidad con el formato original.

## Desarrollo

### Agregar nuevas características

1. **Componentes**: Usar DaisyUI para consistencia
2. **Estado**: Preferir Zustand stores para estado global
3. **Base de datos**: Usar hooks de Supabase
4. **Tipos**: Mantener tipado estricto

### Estructura recomendada

```tsx
// Nuevo componente
function MiComponente() {
  const { transactions } = useTransactions();
  const { currentView } = useUIStore();
  
  return (
    <div className="card bg-base-100 shadow-xl">
      {/* Contenido */}
    </div>
  );
}
```

## Troubleshooting

### Errores comunes

1. **RLS policies**: Verificar que el usuario esté autenticado
2. **Variables de entorno**: Validar configuración de Supabase
3. **Importación**: Verificar formato de datos JSON

### Logs útiles

- Console del navegador para errores de cliente
- Logs de Supabase para errores de base de datos
- Network tab para problemas de conexión

## Contribuir

1. Mantener la estructura de carpetas
2. Documentar nuevas funciones
3. Agregar tests cuando sea posible
4. Seguir convenciones de TypeScript
5. Usar DaisyUI para nuevos componentes