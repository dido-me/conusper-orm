import React from 'react';
import type { Transaction, Entity } from '../types/finance.types';
import { TransactionType } from '../types/finance.types';
import { TrashIcon } from './Icons';

interface TransactionListProps {
  transactions: Transaction[];
  entities?: Entity[];
  onDeleteTransaction?: (id: string) => Promise<boolean>;
  showDelete?: boolean;
  emptyListMessage?: string;
  isLoading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  entities = [], 
  onDeleteTransaction, 
  showDelete = true, 
  emptyListMessage = "No hay transacciones registradas todavía.",
  isLoading = false
}) => {
  const getEntityName = (entityId: string) => {
    // First try to get from the transaction's embedded entity
    const transaction = transactions.find(t => t.entity_id === entityId);
    if (transaction?.entity) {
      return transaction.entity.name;
    }
    
    // Fallback to entities array
    return entities.find(e => e.id === entityId)?.name || 'Desconocido';
  };

  const handleDelete = async (id: string) => {
    if (!onDeleteTransaction) return;
    
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar esta transacción?\n\n${transaction.description} - S/ ${transaction.amount.toFixed(2)}`
    );
    
    if (confirmed) {
      await onDeleteTransaction(id);
    }
  };

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center py-10">
          <p className="text-base-content/70">{emptyListMessage}</p>
          <p className="text-sm text-base-content/50 mt-2">
            Haga clic en el botón '+' para agregar una.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <ul className="menu menu-compact">
            {transactions.map((transaction, index) => (
              <li key={transaction.id}>
                <div className={`flex items-center justify-between p-4 ${index !== transactions.length - 1 ? 'border-b border-base-200' : ''}`}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Indicator */}
                    <div className={`w-1 h-12 rounded-full ${
                      transaction.type === TransactionType.INCOME ? 'bg-success' : 'bg-error'
                    }`}></div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base-content truncate">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <span className="truncate">
                          {getEntityName(transaction.entity_id)}
                        </span>
                        <span>•</span>
                        <span className="whitespace-nowrap">
                          {new Date(transaction.date).toLocaleDateString('es-PE', {
                            timeZone: 'UTC',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span className="badge badge-sm badge-outline">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex items-center gap-3">
                    <div className={`text-lg font-semibold whitespace-nowrap ${
                      transaction.type === TransactionType.INCOME ? 'text-success' : 'text-error'
                    }`}>
                      {transaction.type === TransactionType.INCOME ? '+' : '-'} S/ {
                        transaction.amount.toLocaleString('es-PE', { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      }
                    </div>
                    
                    {showDelete && onDeleteTransaction && (
                      <button 
                        onClick={() => handleDelete(transaction.id)}
                        className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-error"
                        aria-label="Eliminar transacción"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;