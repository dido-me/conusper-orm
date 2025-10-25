import React, { useState, useRef, useEffect } from 'react';
import type { Entity } from '../types/finance.types';
import { ChevronDownIcon } from './Icons';

interface EntitySearchBoxProps {
  entities: Entity[];
  value: string; // Can be 'all' or entity ID
  onChange: (entityId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const EntitySearchBox: React.FC<EntitySearchBoxProps> = ({
  entities,
  value,
  onChange,
  placeholder = "Buscar entidad...",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get display value
  const getDisplayValue = () => {
    if (value === 'all') return 'Todas las Entidades';
    const selectedEntity = entities.find(entity => entity.id === value);
    return selectedEntity?.name || '';
  };

  const displayValue = getDisplayValue();

  // Filter entities based on search term, always include "Todas las Entidades"
  const filteredOptions = [
    { id: 'all', name: 'Todas las Entidades' },
    ...entities.filter(entity =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ];

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
      setSearchTerm('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
  };

  const handleSelectOption = (optionId: string) => {
    onChange(optionId);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length === 1) {
        handleSelectOption(filteredOptions[0].id);
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
          className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
        >
          {/* Filtered options */}
          {filteredOptions.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectOption(option.id)}
              className={`w-full px-4 py-3 text-left hover:bg-base-200 ${
                option.id === value ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              {option.name}
            </button>
          ))}

          {/* No results message */}
          {filteredOptions.length === 1 && filteredOptions[0].id === 'all' && searchTerm.trim() && (
            <div className="px-4 py-3 text-base-content/60 text-center">
              No se encontraron entidades que coincidan con "{searchTerm}"
            </div>
          )}

          {/* Empty state when no entities */}
          {entities.length === 0 && (
            <div className="px-4 py-3 text-base-content/60 text-center">
              No hay entidades registradas
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EntitySearchBox;