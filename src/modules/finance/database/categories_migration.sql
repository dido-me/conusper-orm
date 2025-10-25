-- SQL Script para agregar tabla de categorías personalizadas
-- Ejecutar en el editor SQL de Supabase

-- Crear tabla de categorías personalizadas
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Ingreso', 'Gasto')),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, type)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_is_default ON categories(is_default);

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para categories
CREATE POLICY "Users can view categories" ON categories
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update categories" ON categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete categories" ON categories
    FOR DELETE USING (auth.role() = 'authenticated' AND is_default = FALSE);

-- Insertar categorías por defecto de ingresos
INSERT INTO categories (name, type, is_default) VALUES 
    ('Efectivo', 'Ingreso', TRUE),
    ('Transferencia', 'Ingreso', TRUE),
    ('Depósitos Bancarios', 'Ingreso', TRUE),
    ('Yape', 'Ingreso', TRUE),
    ('Préstamo', 'Ingreso', TRUE)
ON CONFLICT (name, type) DO UPDATE SET is_default = TRUE;

-- Insertar categorías por defecto de gastos
INSERT INTO categories (name, type, is_default) VALUES 
    ('Depósito en Banco', 'Gasto', TRUE),
    ('Transferencia', 'Gasto', TRUE),
    ('Yape', 'Gasto', TRUE),
    ('Plin', 'Gasto', TRUE),
    ('Efectivo', 'Gasto', TRUE),
    ('Pagos Varios', 'Gasto', TRUE)
ON CONFLICT (name, type) DO UPDATE SET is_default = TRUE;

-- Función para obtener categorías por tipo
CREATE OR REPLACE FUNCTION get_categories_by_type(transaction_type VARCHAR(50))
RETURNS TABLE(
    id UUID,
    name VARCHAR(100),
    type VARCHAR(50),
    is_default BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.name, c.type, c.is_default, c.created_at, c.updated_at
    FROM categories c
    WHERE c.type = transaction_type
    ORDER BY c.is_default DESC, c.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear o encontrar una categoría
CREATE OR REPLACE FUNCTION find_or_create_category(
    category_name VARCHAR(100),
    category_type VARCHAR(50)
)
RETURNS TABLE(
    id UUID,
    name VARCHAR(100),
    type VARCHAR(50),
    is_default BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Intentar encontrar la categoría existente
    RETURN QUERY
    SELECT c.id, c.name, c.type, c.is_default, c.created_at, c.updated_at
    FROM categories c
    WHERE c.name = category_name AND c.type = category_type;
    
    -- Si no se encontró, crear una nueva
    IF NOT FOUND THEN
        RETURN QUERY
        INSERT INTO categories (name, type, is_default)
        VALUES (category_name, category_type, FALSE)
        RETURNING categories.id, categories.name, categories.type, categories.is_default, 
                  categories.created_at, categories.updated_at;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vista para obtener todas las categorías con conteo de uso
CREATE OR REPLACE VIEW categories_with_usage AS
SELECT 
    c.id,
    c.name,
    c.type,
    c.is_default,
    c.created_at,
    c.updated_at,
    COUNT(t.id) as usage_count
FROM categories c
LEFT JOIN transactions t ON t.category = c.name AND 
    CASE 
        WHEN c.type = 'Ingreso' THEN t.type = 'Ingreso'
        WHEN c.type = 'Gasto' THEN t.type = 'Gasto'
        ELSE FALSE
    END
GROUP BY c.id, c.name, c.type, c.is_default, c.created_at, c.updated_at
ORDER BY c.is_default DESC, usage_count DESC, c.name ASC;

-- Comentarios para documentar el esquema
COMMENT ON TABLE categories IS 'Categorías personalizadas para las transacciones';
COMMENT ON COLUMN categories.name IS 'Nombre de la categoría';
COMMENT ON COLUMN categories.type IS 'Tipo de transacción: Ingreso o Gasto';
COMMENT ON COLUMN categories.is_default IS 'Indica si es una categoría por defecto del sistema';

-- Finalización del script
SELECT 'Tabla de categorías creada exitosamente. Se agregaron categorías por defecto.' as message;