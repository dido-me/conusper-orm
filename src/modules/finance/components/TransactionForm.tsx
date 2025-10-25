import React, { useState } from 'react';
import type { Entity, TransactionInput, TransactionType, Category } from '../types/finance.types';
import { TransactionType as TransactionTypeConstants } from '../types/finance.types';
import Modal from './Modal';
import EntityComboBox from './EntityComboBox';
import CategoryComboBox from './CategoryComboBox';
import { useCategories } from '../hooks/useCategories';
import toast from 'react-hot-toast';

interface TransactionFormProps {
  onSubmit: (transaction: TransactionInput) => Promise<boolean>;
  entities: Entity[];
  onAddEntity: (name: string) => Promise<Entity | null>;
  onClose: () => void;
  initialType?: TransactionType;
  isOpen?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onSubmit, 
  entities, 
  onAddEntity, 
  onClose, 
  initialType = TransactionTypeConstants.EXPENSE,
  isOpen = true 
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category | ''>('');
  const [entityId, setEntityId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use categories hook
  const { categories: customCategories, findOrCreateCategory } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !date || !category || !entityId) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Por favor, ingrese un monto válido');
      return;
    }

    setIsSubmitting(true);
    
    const success = await onSubmit({
      type,
      amount: amountValue,
      description,
      date,
      category,
      entity_id: entityId,
    });

    setIsSubmitting(false);

    if (success) {
      // Reset form
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setEntityId('');
      onClose();
    }
  };

  return (
    <Modal title="Registrar Transacción" onClose={onClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Transacción */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Tipo de Transacción</span>
          </label>
          <div className="btn-group w-full">
            <button 
              type="button" 
              onClick={() => setType(TransactionTypeConstants.EXPENSE)}
              className={`btn flex-1 ${type === TransactionTypeConstants.EXPENSE ? 'btn-error' : 'btn-outline'}`}
            >
              Gasto
            </button>
            <button 
              type="button" 
              onClick={() => setType(TransactionTypeConstants.INCOME)}
              className={`btn flex-1 ${type === TransactionTypeConstants.INCOME ? 'btn-success' : 'btn-outline'}`}
            >
              Ingreso
            </button>
          </div>
        </div>

        {/* Monto */}
        <div className="form-control">
          <label className="label" htmlFor="amount">
            <span className="label-text">Monto (S/)</span>
          </label>
          <input 
            type="number" 
            id="amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="input input-bordered w-full"
            placeholder="0.00" 
            required 
            step="0.01"
            min="0.01"
          />
        </div>

        {/* Descripción */}
        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text">Descripción</span>
          </label>
          <input 
            type="text" 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Descripción de la transacción"
            required 
          />
        </div>

        {/* Fecha y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label" htmlFor="date">
              <span className="label-text">Fecha</span>
            </label>
            <input 
              type="date" 
              id="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full"
              required 
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Categoría</span>
            </label>
            <CategoryComboBox
              categories={customCategories}
              value={category}
              onChange={setCategory}
              onAddCategory={findOrCreateCategory}
              transactionType={type}
              placeholder="Buscar o crear categoría..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Entidad */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Persona / Empresa</span>
          </label>
          <EntityComboBox
            entities={entities}
            value={entityId}
            onChange={setEntityId}
            onAddEntity={onAddEntity}
            placeholder="Buscar o crear entidad..."
            disabled={isSubmitting}
          />
        </div>

        {/* Botones */}
        <div className="modal-action">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={`btn ${type === TransactionTypeConstants.INCOME ? 'btn-success' : 'btn-error'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Guardando...
              </>
            ) : (
              'Guardar Transacción'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;