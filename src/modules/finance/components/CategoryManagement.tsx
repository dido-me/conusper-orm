import React, { useState, useEffect } from 'react';
import type { TransactionType } from '../types/finance.types';
import { TransactionType as TransactionTypeConstants } from '../types/finance.types';
import Modal from './Modal';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';
import { useCategories } from '../hooks/useCategories';
import toast from 'react-hot-toast';

interface CategoryData {
  id: string;
  name: string;
  type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoryManagementProps {
  onClose: () => void;
  isOpen?: boolean;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  onClose,
  isOpen = true
}) => {
  const [selectedType, setSelectedType] = useState<TransactionType>(TransactionTypeConstants.EXPENSE);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { findOrCreateCategory } = useCategories();

  // Fetch categories from database
  const fetchCategoriesByType = async (type: TransactionType) => {
    try {
      setLoading(true);
      // Aquí necesitamos hacer una consulta directa a Supabase para obtener categorías con metadata
      const { supabase } = await import('../../../supabase/client');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', type)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar las categorías');
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error in fetchCategoriesByType:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesByType(selectedType);
  }, [selectedType]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error('Por favor, ingrese un nombre para la categoría');
      return;
    }

    // Check if category already exists
    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );

    if (existingCategory) {
      toast.error('Ya existe una categoría con ese nombre');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await findOrCreateCategory(newCategoryName.trim(), selectedType);
      if (result) {
        setNewCategoryName('');
        setIsCreating(false);
        await fetchCategoriesByType(selectedType); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error al crear la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory || !editCategoryName.trim()) {
      toast.error('Por favor, ingrese un nombre válido');
      return;
    }

    // Check if new name already exists (excluding current category)
    const existingCategory = categories.find(
      cat => cat.id !== editingCategory.id && 
            cat.name.toLowerCase() === editCategoryName.trim().toLowerCase()
    );

    if (existingCategory) {
      toast.error('Ya existe una categoría con ese nombre');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { supabase } = await import('../../../supabase/client');
      const { error } = await supabase
        .from('categories')
        .update({ name: editCategoryName.trim() })
        .eq('id', editingCategory.id);

      if (error) {
        console.error('Error updating category:', error);
        toast.error('Error al actualizar la categoría');
        return;
      }

      toast.success(`Categoría actualizada exitosamente`);
      setEditingCategory(null);
      setEditCategoryName('');
      await fetchCategoriesByType(selectedType); // Refresh the list
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error al actualizar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: CategoryData) => {
    if (category.is_default) {
      toast.error('No se pueden eliminar las categorías por defecto');
      return;
    }

    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer y puede afectar transacciones existentes.`
    );
    
    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      
      // Check if category is being used in transactions
      const { supabase } = await import('../../../supabase/client');
      const { count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('category', category.name);

      if (count && count > 0) {
        toast.error('No se puede eliminar la categoría porque está siendo utilizada en transacciones');
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Error al eliminar la categoría');
        return;
      }

      toast.success(`Categoría "${category.name}" eliminada exitosamente`);
      await fetchCategoriesByType(selectedType); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (category: CategoryData) => {
    if (category.is_default) {
      toast.error('No se pueden editar las categorías por defecto');
      return;
    }
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingCategory(null);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewCategoryName('');
  };

  return (
    <Modal title="Gestionar Categorías" onClose={onClose} isOpen={isOpen}>
      <div className="space-y-4">
        {/* Type Selector */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Tipo de Transacción</span>
          </label>
          <div className="btn-group w-full">
            <button 
              type="button" 
              onClick={() => setSelectedType(TransactionTypeConstants.EXPENSE)}
              className={`btn flex-1 ${selectedType === TransactionTypeConstants.EXPENSE ? 'btn-error' : 'btn-outline'}`}
              disabled={isSubmitting}
            >
              Gasto
            </button>
            <button 
              type="button" 
              onClick={() => setSelectedType(TransactionTypeConstants.INCOME)}
              className={`btn flex-1 ${selectedType === TransactionTypeConstants.INCOME ? 'btn-success' : 'btn-outline'}`}
              disabled={isSubmitting}
            >
              Ingreso
            </button>
          </div>
        </div>

        {/* Create Category Form */}
        <div className="card bg-base-100 border">
          <div className="card-body p-4">
            {!isCreating ? (
              <button
                onClick={startCreating}
                className={`btn btn-sm gap-2 ${selectedType === TransactionTypeConstants.INCOME ? 'btn-success' : 'btn-error'}`}
                disabled={isSubmitting}
              >
                <PlusIcon className="h-4 w-4" />
                Agregar Nueva Categoría
              </button>
            ) : (
              <form onSubmit={handleCreateCategory} className="space-y-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Nombre de la Categoría</span>
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="input input-bordered input-sm"
                    placeholder="Ingrese el nombre..."
                    required
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`btn btn-sm ${selectedType === TransactionTypeConstants.INCOME ? 'btn-success' : 'btn-error'}`}
                    disabled={isSubmitting || !newCategoryName.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Creando...
                      </>
                    ) : (
                      'Crear'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelCreating}
                    className="btn btn-outline btn-sm"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          <h3 className="font-medium text-base-content">
            Categorías de {selectedType} ({categories.length})
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <span className="loading loading-spinner loading-md"></span>
              <p className="text-sm text-base-content/60 mt-2">Cargando categorías...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <p>No hay categorías registradas</p>
              <p className="text-sm">Agregue una nueva categoría para comenzar</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="card bg-base-100 border">
                  <div className="card-body p-3">
                    {editingCategory?.id === category.id ? (
                      <form onSubmit={handleEditCategory} className="space-y-3">
                        <div className="form-control">
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            className="input input-bordered input-sm"
                            required
                            autoFocus
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="btn btn-primary btn-xs"
                            disabled={isSubmitting || !editCategoryName.trim()}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Guardando...
                              </>
                            ) : (
                              'Guardar'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="btn btn-outline btn-xs"
                            disabled={isSubmitting}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-base-content">{category.name}</h4>
                            {category.is_default && (
                              <span className="badge badge-primary badge-xs">Por defecto</span>
                            )}
                          </div>
                          <p className="text-xs text-base-content/60">
                            ID: {category.id.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(category)}
                            className="btn btn-ghost btn-xs"
                            disabled={isSubmitting || category.is_default}
                            title={category.is_default ? "No se pueden editar categorías por defecto" : "Editar categoría"}
                          >
                            <EditIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content"
                            disabled={isSubmitting || category.is_default}
                            title={category.is_default ? "No se pueden eliminar categorías por defecto" : "Eliminar categoría"}
                          >
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="modal-action">
          <button 
            onClick={onClose} 
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryManagement;