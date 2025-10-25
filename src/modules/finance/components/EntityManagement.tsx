import React, { useState } from 'react';
import type { Entity, EntityInput } from '../types/finance.types';
import Modal from './Modal';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';
import toast from 'react-hot-toast';

interface EntityManagementProps {
  entities: Entity[];
  onCreateEntity: (entity: EntityInput) => Promise<Entity | null>;
  onUpdateEntity: (id: string, updates: Partial<EntityInput>) => Promise<boolean>;
  onDeleteEntity: (id: string) => Promise<boolean>;
  onClose: () => void;
  isOpen?: boolean;
}

const EntityManagement: React.FC<EntityManagementProps> = ({
  entities,
  onCreateEntity,
  onUpdateEntity,
  onDeleteEntity,
  onClose,
  isOpen = true
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [newEntityName, setNewEntityName] = useState('');
  const [editEntityName, setEditEntityName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEntityName.trim()) {
      toast.error('Por favor, ingrese un nombre para la entidad');
      return;
    }

    setIsSubmitting(true);
    const result = await onCreateEntity({ name: newEntityName.trim() });
    setIsSubmitting(false);

    if (result) {
      setNewEntityName('');
      setIsCreating(false);
    }
  };

  const handleEditEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEntity || !editEntityName.trim()) {
      toast.error('Por favor, ingrese un nombre válido');
      return;
    }

    setIsSubmitting(true);
    const success = await onUpdateEntity(editingEntity.id, { name: editEntityName.trim() });
    setIsSubmitting(false);

    if (success) {
      setEditingEntity(null);
      setEditEntityName('');
    }
  };

  const handleDeleteEntity = async (entity: Entity) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar la entidad "${entity.name}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmed) {
      await onDeleteEntity(entity.id);
    }
  };

  const startEditing = (entity: Entity) => {
    setEditingEntity(entity);
    setEditEntityName(entity.name);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingEntity(null);
    setEditEntityName('');
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingEntity(null);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewEntityName('');
  };

  return (
    <Modal title="Gestionar Personas / Empresas" onClose={onClose} isOpen={isOpen}>
      <div className="space-y-4">
        {/* Create Entity Form */}
        <div className="card bg-base-100 border">
          <div className="card-body p-4">
            {!isCreating ? (
              <button
                onClick={startCreating}
                className="btn btn-primary btn-sm gap-2"
                disabled={isSubmitting}
              >
                <PlusIcon className="h-4 w-4" />
                Agregar Nueva Entidad
              </button>
            ) : (
              <form onSubmit={handleCreateEntity} className="space-y-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Nombre de la Entidad</span>
                  </label>
                  <input
                    type="text"
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
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
                    className="btn btn-primary btn-sm"
                    disabled={isSubmitting || !newEntityName.trim()}
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

        {/* Entities List */}
        <div className="space-y-2">
          <h3 className="font-medium text-base-content">
            Entidades Existentes ({entities.length})
          </h3>
          
          {entities.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <p>No hay entidades registradas</p>
              <p className="text-sm">Agregue una nueva entidad para comenzar</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {entities.map((entity) => (
                <div key={entity.id} className="card bg-base-100 border">
                  <div className="card-body p-3">
                    {editingEntity?.id === entity.id ? (
                      <form onSubmit={handleEditEntity} className="space-y-3">
                        <div className="form-control">
                          <input
                            type="text"
                            value={editEntityName}
                            onChange={(e) => setEditEntityName(e.target.value)}
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
                            disabled={isSubmitting || !editEntityName.trim()}
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
                          <h4 className="font-medium text-base-content">{entity.name}</h4>
                          <p className="text-xs text-base-content/60">
                            ID: {entity.id}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(entity)}
                            className="btn btn-ghost btn-xs"
                            disabled={isSubmitting}
                            title="Editar entidad"
                          >
                            <EditIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntity(entity)}
                            className="btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content"
                            disabled={isSubmitting}
                            title="Eliminar entidad"
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

export default EntityManagement;