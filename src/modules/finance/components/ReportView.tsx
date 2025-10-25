import React, { useState, useMemo } from 'react';
import type { Transaction, Entity } from '../types/finance.types';
import { TransactionType } from '../types/finance.types';
import Summary from './Summary';
import TransactionList from './TransactionList';
import EntitySearchBox from './EntitySearchBox';

interface ReportViewProps {
  transactions: Transaction[];
  entities: Entity[];
  isLoading?: boolean;
}

const ReportView: React.FC<ReportViewProps> = ({ 
  transactions, 
  entities, 
  isLoading = false 
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    if (selectedEntityId === 'all') {
      return transactions;
    }
    return transactions.filter(t => t.entity_id === selectedEntityId);
  }, [transactions, selectedEntityId]);
  
  const filteredIncome = useMemo(() => 
    filteredTransactions.filter(t => t.type === TransactionType.INCOME), 
    [filteredTransactions]
  );
  
  const filteredExpenses = useMemo(() => 
    filteredTransactions.filter(t => t.type === TransactionType.EXPENSE), 
    [filteredTransactions]
  );

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
  }, [filteredTransactions]);

  const selectedEntityName = useMemo(() => {
    if (selectedEntityId === 'all') return 'Todas las Entidades';
    const entity = entities.find(e => e.id === selectedEntityId);
    return entity ? entity.name : 'Entidad Desconocida';
  }, [selectedEntityId, entities]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-full max-w-sm"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-32 w-full"></div>
        </div>
        <div className="skeleton h-64 w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="form-control w-full max-w-sm">
            <label className="label">
              <span className="label-text font-medium">Filtrar por Persona / Empresa</span>
            </label>
            <EntitySearchBox
              entities={entities}
              value={selectedEntityId}
              onChange={setSelectedEntityId}
              placeholder="Buscar entidad..."
              disabled={isLoading}
            />
          </div>
          
          {selectedEntityId !== 'all' && (
            <div className="mt-2">
              <div className="badge badge-primary">{selectedEntityName}</div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <Summary 
        totalIncome={totalIncome} 
        totalExpenses={totalExpenses} 
        balance={balance} 
      />
      
      {/* Transaction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-success">Detalle de Ingresos</h2>
            <div className="badge badge-success badge-lg">
              {filteredIncome.length}
            </div>
          </div>
          <TransactionList
            transactions={filteredIncome}
            entities={entities}
            showDelete={false}
            emptyListMessage="No hay ingresos para este filtro."
          />
        </div>
        
        {/* Expense Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-error">Detalle de Egresos</h2>
            <div className="badge badge-error badge-lg">
              {filteredExpenses.length}
            </div>
          </div>
          <TransactionList
            transactions={filteredExpenses}
            entities={entities}
            showDelete={false}
            emptyListMessage="No hay egresos para este filtro."
          />
        </div>
      </div>

      {/* Additional Stats */}
      {filteredTransactions.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Estadísticas Adicionales</h3>
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Total Transacciones</div>
                <div className="stat-value text-primary">{filteredTransactions.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Promedio por Transacción</div>
                <div className="stat-value text-secondary">
                  S/ {(filteredTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.length).toFixed(2)}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Mayor Transacción</div>
                <div className="stat-value text-accent">
                  S/ {Math.max(...filteredTransactions.map(t => t.amount)).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;