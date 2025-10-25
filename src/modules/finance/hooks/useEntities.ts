import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/client';
import type { Entity, EntityInput } from '../types/finance.types';
import toast from 'react-hot-toast';

export function useEntities() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar entidades
  const fetchEntities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setEntities(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(`Error al cargar entidades: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva entidad
  const createEntity = async (entityInput: EntityInput): Promise<Entity | null> => {
    try {
      // Verificar si la entidad ya existe
      const existingEntity = entities.find(
        e => e.name.toLowerCase() === entityInput.name.toLowerCase()
      );
      
      if (existingEntity) {
        return existingEntity;
      }

      const { data, error } = await supabase
        .from('entities')
        .insert([entityInput])
        .select()
        .single();

      if (error) throw error;

      const newEntity = data as Entity;
      setEntities(prev => [...prev, newEntity].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Entidad creada exitosamente');
      return newEntity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(`Error al crear entidad: ${errorMessage}`);
      return null;
    }
  };

  // Actualizar entidad
  const updateEntity = async (id: string, updates: Partial<EntityInput>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('entities')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setEntities(prev => 
        prev.map(entity => 
          entity.id === id ? { ...entity, ...updates } : entity
        ).sort((a, b) => a.name.localeCompare(b.name))
      );
      toast.success('Entidad actualizada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(`Error al actualizar entidad: ${errorMessage}`);
      return false;
    }
  };

  // Eliminar entidad
  const deleteEntity = async (id: string): Promise<boolean> => {
    try {
      // Verificar si hay transacciones asociadas
      const { count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('entity_id', id);

      if (count && count > 0) {
        toast.error('No se puede eliminar la entidad porque tiene transacciones asociadas');
        return false;
      }

      const { error } = await supabase
        .from('entities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntities(prev => prev.filter(entity => entity.id !== id));
      toast.success('Entidad eliminada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast.error(`Error al eliminar entidad: ${errorMessage}`);
      return false;
    }
  };

  // Buscar o crear entidad por nombre
  const findOrCreateEntity = async (name: string): Promise<Entity | null> => {
    const existingEntity = entities.find(
      e => e.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingEntity) {
      return existingEntity;
    }

    return await createEntity({ name });
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  return {
    entities,
    loading,
    error,
    fetchEntities,
    createEntity,
    updateEntity,
    deleteEntity,
    findOrCreateEntity,
  };
}