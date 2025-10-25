import React, { useState, useRef, useEffect } from 'react';
import type { Category, TransactionType } from '../types/finance.types';
import { TransactionType as TransactionTypeConstants } from '../types/finance.types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/finance.constants';
import { PlusIcon, ChevronDownIcon } from './Icons';

interface CategoryComboBoxProps {
  categories: Category[];
  value: Category | '';
  onChange: (category: Category) => void;
  onAddCategory: (name: string, type: TransactionType) => Promise<Category | null>;
  transactionType: TransactionType;
  placeholder?: string;
  disabled?: boolean;
}

const CategoryComboBox: React.FC<CategoryComboBoxProps> = ({
  categories,
  value,
  onChange,
  onAddCategory,
  transactionType,
  placeholder = "Buscar o crear categoría...",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get display value
  const displayValue = value || '';

  // Get appropriate categories based on transaction type
  const baseCategories = transactionType === TransactionTypeConstants.INCOME 
    ? INCOME_CATEGORIES 
    : EXPENSE_CATEGORIES;

  // Combine base categories with custom categories from database
  const allCategories = [...new Set([...baseCategories, ...categories])];

  // Filter categories based on search term
  const filteredCategories = allCategories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term matches any existing category exactly
  const exactMatch = allCategories.find(category => 
    category.toLowerCase() === searchTerm.toLowerCase()
  );

  // Show create option if search term doesn't match any category and is not empty
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

  const handleSelectCategory = (category: Category) => {
    onChange(category);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!searchTerm.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const newCategory = await onAddCategory(searchTerm.trim(), transactionType);
      if (newCategory) {
        onChange(newCategory);
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
        handleCreateCategory();
      } else if (filteredCategories.length === 1) {
        handleSelectCategory(filteredCategories[0]);
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
              Creando categoría...
            </div>
          )}

          {/* Create new category option */}
          {showCreateOption && !isCreating && (
            <button
              type="button"
              onClick={handleCreateCategory}
              className="w-full px-4 py-3 text-left hover:bg-base-200 border-b border-base-300 flex items-center gap-2 text-primary font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Crear "{searchTerm}"
            </button>
          )}

          {/* Existing categories */}
          {!isCreating && filteredCategories.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => handleSelectCategory(category)}
              className={`w-full px-4 py-3 text-left hover:bg-base-200 ${
                category === value ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              {category}
            </button>
          ))}

          {/* No results message */}
          {!isCreating && filteredCategories.length === 0 && !showCreateOption && (
            <div className="px-4 py-3 text-base-content/60 text-center">
              No se encontraron categorías
            </div>
          )}

          {/* Empty state when no search term */}
          {!isCreating && !searchTerm.trim() && allCategories.length === 0 && (
            <div className="px-4 py-3 text-base-content/60 text-center">
              No hay categorías registradas
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryComboBox;