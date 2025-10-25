# Categorías Personalizadas - Guía de Implementación

## 📋 Resumen
Se ha implementado un sistema completo de categorías personalizadas que permite a los usuarios crear, gestionar y usar categorías dinámicas además de las categorías por defecto del sistema.

## 🗄️ Base de Datos

### Script de Migración
Ejecutar en Supabase SQL Editor:
```sql
-- Ver archivo: src/modules/finance/database/categories_migration.sql
```

### Tabla `categories`
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Ingreso', 'Gasto')),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, type)
);
```

### Funciones Disponibles
- `get_categories_by_type(transaction_type)` - Obtiene categorías por tipo
- `find_or_create_category(name, type)` - Encuentra o crea una categoría
- `categories_with_usage` - Vista con conteo de uso de categorías

## 🧩 Componentes

### CategoryComboBox
Componente similar a `EntityComboBox` pero para categorías:

```tsx
<CategoryComboBox
  categories={customCategories}
  value={category}
  onChange={setCategory}
  onAddCategory={findOrCreateCategory}
  transactionType={type}
  placeholder="Buscar o crear categoría..."
  disabled={isSubmitting}
/>
```

**Props:**
- `categories` - Array de categorías personalizadas
- `value` - Categoría seleccionada
- `onChange` - Callback cuando cambia la selección
- `onAddCategory` - Función para crear nueva categoría
- `transactionType` - Tipo de transacción (Ingreso/Gasto)
- `placeholder` - Texto del placeholder
- `disabled` - Estado deshabilitado

### Características
- ✅ Búsqueda en tiempo real
- ✅ Creación rápida de categorías
- ✅ Filtrado por tipo de transacción
- ✅ Integración con categorías por defecto
- ✅ Posicionamiento inteligente (arriba del modal)
- ✅ Z-index correcto para aparecer sobre modales

## 🔧 Hook useCategories

### Funciones Disponibles
```typescript
const {
  categories,           // Array de todas las categorías
  loading,             // Estado de carga
  fetchCategories,     // Refrescar categorías
  getCategoriesByType, // Obtener por tipo
  findOrCreateCategory,// Encontrar o crear
  deleteCategory       // Eliminar categoría personalizada
} = useCategories();
```

### Ejemplo de Uso
```typescript
// Crear nueva categoría
const newCategory = await findOrCreateCategory('Mi Categoría', 'Gasto');

// Obtener categorías por tipo
const incomeCategories = await getCategoriesByType('Ingreso');

// Eliminar categoría personalizada
await deleteCategory('Mi Categoría', 'Gasto');
```

## 🔄 Integración

### En TransactionForm
El formulario ahora usa `CategoryComboBox` en lugar del `select` tradicional:

```tsx
// Antes (select estático)
<select value={category} onChange={...}>
  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
</select>

// Ahora (combobox dinámico)
<CategoryComboBox
  categories={customCategories}
  value={category}
  onChange={setCategory}
  onAddCategory={findOrCreateCategory}
  transactionType={type}
/>
```

## 📊 Flujo de Datos

1. **Carga Inicial**: Hook `useCategories` carga categorías de BD
2. **Filtrado**: Componente combina categorías por defecto + personalizadas
3. **Búsqueda**: Usuario filtra categorías en tiempo real
4. **Creación**: Si no existe, se crea nueva categoría en BD
5. **Selección**: Categoría se actualiza en formulario

## 🎯 Ventajas

### Para el Usuario
- **Flexibilidad**: Crear categorías según necesidades
- **Rapidez**: Búsqueda y creación en un solo campo
- **Intuitividad**: Interface familiar tipo autocomplete

### Para el Sistema
- **Mantenible**: Categorías se gestionan en BD
- **Escalable**: Sistema permite infinitas categorías
- **Consistente**: Misma UX que EntityComboBox

## 🚀 Próximos Pasos

1. **Ejecutar migración** en Supabase
2. **Verificar categorías por defecto** se insertaron
3. **Probar creación** de categorías personalizadas
4. **Validar búsqueda** y filtrado por tipo

## 🔍 Troubleshooting

### Problemas Comunes
- **Z-index**: Verificar que dropdown aparece sobre modal
- **Categorías duplicadas**: La BD evita duplicados por (name, type)
- **Permisos**: Verificar RLS policies en Supabase

### Validaciones
- Nombres únicos por tipo de transacción
- Categorías por defecto no se pueden eliminar
- Solo usuarios autenticados pueden crear categorías