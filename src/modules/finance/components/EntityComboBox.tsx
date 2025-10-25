import React, { useState, useRef, useEffect } from 'react';
import type { Entity } from '../types/finance.types';
import { PlusIcon, ChevronDownIcon } from './Icons';

interface EntityComboBoxProps {
  entities: Entity[];
  value: string;
  onChange: (entityId: string) => void;
  onAddEntity: (name: string) => Promise<Entity | null>;
  placeholder?: string;
  disabled?: boolean;
}

const EntityComboBox: React.FC<EntityComboBoxProps> = ({
  entities,
  value,
  onChange,
  onAddEntity,
  placeholder = "Buscar o crear entidad...",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected entity name
  const selectedEntity = entities.find(entity => entity.id === value);
  const displayValue = selectedEntity?.name || '';

  // Filter entities based on search term
  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term matches any existing entity exactly
  const exactMatch = entities.find(entity => 
    entity.name.toLowerCase() === searchTerm.toLowerCase()
  );

  // Show create option if search term doesn't match any entity and is not empty
  const showCreateOption = searchTerm.trim() && !exactMatch;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm(displayValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
  };

  const handleSelectEntity = (entity: Entity) => {
    onChange(entity.id);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleCreateEntity = async () => {
    if (!searchTerm.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const newEntity = await onAddEntity(searchTerm.trim());
      if (newEntity) {
        onChange(newEntity.id);
        setSearchTerm('');
        setIsOpen(false);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showCreateOption && !isCreating) {
        handleCreateEntity();
      } else if (filteredEntities.length === 1) {
        handleSelectEntity(filteredEntities[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="relative">
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="input input-bordered w-full pr-10"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={handleInputClick}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60"
        >
          <ChevronDownIcon 
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div 
          ref={dropdownRef}
          className="absolute bottom-full left-0 right-0 mb-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          style={{ 
            zIndex: 9999,
            boxShadow: '0 -10px 25px -3px rgb(0 0 0 / 0.1), 0 -4px 6px -4px rgb(0 0 0 / 0.1)'
          }}
        >
          {/* Loading state */}
          {isCreating && (
            <div className="px-4 py-3 text-center">
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Creando entidad...
            </div>
          )}

          {/* Create new entity option */}
          {showCreateOption && !isCreating && (
            <button
              type="button"
              onClick={handleCreateEntity}
              className="w-full px-4 py-3 text-left hover:bg-base-200 border-b border-base-300 flex items-center gap-2 text-primary font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Crear "{searchTerm}"
            </button>
          )}

          {/* Existing entities */}
          {!isCreating && filteredEntities.map(entity => (
            <button
              key={entity.id}
              type="button"
              onClick={() => handleSelectEntity(entity)}
              className={`w-full px-4 py-3 text-left hover:bg-base-200 ${
                entity.id === value ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              {entity.name}
            </button>
          ))}

          {/* No results message */}
          {!isCreating && filteredEntities.length === 0 && !showCreateOption && (
            <div className="px-4 py-3 text-base-content/60 text-center">
              No se encontraron entidades
            </div>
          )}

          {/* Empty state when no search term */}
          {!isCreating && !searchTerm.trim() && entities.length === 0 && (
            <div className="px-4 py-3 text-base-content/60 text-center">
              No hay entidades registradas
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EntityComboBox;