import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/client';
import type { Category, TransactionType } from '../types/finance.types';
import toast from 'react-hot-toast';

interface CategoryData {
  id: string;
  name: string;
  type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar las categorías');
        return;
      }

      // Extract just the category names for the UI
      const categoryNames = data?.map((cat: CategoryData) => cat.name as Category) || [];
      setCategories(categoryNames);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  // Get categories by transaction type
  const getCategoriesByType = async (type: TransactionType): Promise<Category[]> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('type', type)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories by type:', error);
        return [];
      }

      return data?.map((cat: { name: string }) => cat.name as Category) || [];
    } catch (error) {
      console.error('Error in getCategoriesByType:', error);
      return [];
    }
  };

  // Create a new category or find existing one
  const findOrCreateCategory = async (name: string, type: TransactionType): Promise<Category | null> => {
    try {
      // First check if category already exists
      const { data: existingData } = await supabase
        .from('categories')
        .select('name')
        .eq('name', name.trim())
        .eq('type', type)
        .single();

      if (existingData) {
        // Category already exists
        toast.success('Categoría encontrada');
        return existingData.name as Category;
      }

      // Create new category
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name: name.trim(),
            type: type,
            is_default: false
          }
        ])
        .select('name')
        .single();

      if (error) {
        console.error('Error creating category:', error);
        toast.error('Error al crear la categoría');
        return null;
      }

      toast.success(`Categoría "${name}" creada exitosamente`);
      
      // Refresh categories list
      await fetchCategories();
      
      return data.name as Category;
    } catch (error) {
      console.error('Error in findOrCreateCategory:', error);
      toast.error('Error al crear la categoría');
      return null;
    }
  };

  // Delete a custom category (not default ones)
  const deleteCategory = async (name: string, type: TransactionType): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', name)
        .eq('type', type)
        .eq('is_default', false);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Error al eliminar la categoría');
        return false;
      }

      toast.success(`Categoría "${name}" eliminada exitosamente`);
      
      // Refresh categories list
      await fetchCategories();
      
      return true;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      toast.error('Error al eliminar la categoría');
      return false;
    }
  };

  // Initialize categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    fetchCategories,
    getCategoriesByType,
    findOrCreateCategory,
    deleteCategory
  };
};