import { create } from 'zustand';
import type { Entity } from '../types/finance.types';

interface EntityState {
  entities: Entity[];
  selectedEntity: Entity | null;
  loading: boolean;
  error: string | null;
}

interface EntityActions {
  setEntities: (entities: Entity[]) => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  removeEntity: (id: string) => void;
  selectEntity: (entity: Entity | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  findEntityByName: (name: string) => Entity | undefined;
  clearEntities: () => void;
}

type EntityStore = EntityState & EntityActions;

export const useEntityStore = create<EntityStore>((set, get) => ({
  // State
  entities: [],
  selectedEntity: null,
  loading: false,
  error: null,

  // Actions
  setEntities: (entities) => set({ entities }),
  
  addEntity: (entity) => set((state) => ({
    entities: [...state.entities, entity].sort((a, b) => a.name.localeCompare(b.name))
  })),
  
  updateEntity: (id, updates) => set((state) => ({
    entities: state.entities.map(entity =>
      entity.id === id ? { ...entity, ...updates } : entity
    ).sort((a, b) => a.name.localeCompare(b.name))
  })),
  
  removeEntity: (id) => set((state) => ({
    entities: state.entities.filter(entity => entity.id !== id),
    selectedEntity: state.selectedEntity?.id === id ? null : state.selectedEntity
  })),
  
  selectEntity: (entity) => set({ selectedEntity: entity }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  findEntityByName: (name) => {
    const { entities } = get();
    return entities.find(entity => 
      entity.name.toLowerCase() === name.toLowerCase()
    );
  },
  
  clearEntities: () => set({
    entities: [],
    selectedEntity: null,
    error: null
  })
}));