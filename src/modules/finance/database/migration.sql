-- SQL Script para migración del control de gastos a Supabase
-- Ejecutar en el editor SQL de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de entidades (personas, empresas, etc.)
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('Ingreso', 'Gasto')),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_entity_id ON transactions(entity_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (permitir todas las operaciones para usuarios autenticados)
-- Puedes modificar estas políticas según tus necesidades de seguridad

-- Políticas para entities
CREATE POLICY "Users can view entities" ON entities
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert entities" ON entities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update entities" ON entities
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete entities" ON entities
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para transactions
CREATE POLICY "Users can view transactions" ON transactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert transactions" ON transactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update transactions" ON transactions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete transactions" ON transactions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Vista para obtener transacciones con información de entidades
CREATE OR REPLACE VIEW transactions_with_entities AS
SELECT 
    t.id,
    t.type,
    t.category,
    t.amount,
    t.description,
    t.date,
    t.entity_id,
    t.created_at,
    t.updated_at,
    e.name as entity_name
FROM transactions t
LEFT JOIN entities e ON t.entity_id = e.id;

-- Función para obtener estadísticas financieras
CREATE OR REPLACE FUNCTION get_financial_summary(
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_income', COALESCE(income.total, 0),
        'total_expenses', COALESCE(expenses.total, 0),
        'balance', COALESCE(income.total, 0) - COALESCE(expenses.total, 0),
        'transaction_count', COALESCE(income.count, 0) + COALESCE(expenses.count, 0)
    ) INTO result
    FROM (
        SELECT 
            SUM(amount) as total,
            COUNT(*) as count
        FROM transactions 
        WHERE type = 'Ingreso'
        AND (start_date IS NULL OR date >= start_date)
        AND (end_date IS NULL OR date <= end_date)
    ) income
    FULL OUTER JOIN (
        SELECT 
            SUM(amount) as total,
            COUNT(*) as count
        FROM transactions 
        WHERE type = 'Gasto'
        AND (start_date IS NULL OR date >= start_date)
        AND (end_date IS NULL OR date <= end_date)
    ) expenses ON true;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar algunas entidades de ejemplo (opcional)
INSERT INTO entities (name) VALUES 
    ('Efectivo'),
    ('Banco BCP'),
    ('Banco Interbank'),
    ('Yape'),
    ('Plin')
ON CONFLICT (name) DO NOTHING;

-- Comentarios para documentar el esquema
COMMENT ON TABLE entities IS 'Entidades que participan en las transacciones (personas, bancos, etc.)';
COMMENT ON TABLE transactions IS 'Registro de todas las transacciones financieras';
COMMENT ON COLUMN transactions.type IS 'Tipo de transacción: Ingreso o Gasto';
COMMENT ON COLUMN transactions.category IS 'Categoría específica de la transacción';
COMMENT ON COLUMN transactions.amount IS 'Monto de la transacción en soles peruanos';
COMMENT ON COLUMN transactions.date IS 'Fecha de la transacción';
COMMENT ON COLUMN transactions.entity_id IS 'Referencia a la entidad involucrada';

-- Finalización del script
SELECT 'Migración completada exitosamente. Tablas y funciones creadas.' as message;