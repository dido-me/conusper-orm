import { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useEntities } from '../hooks/useEntities';
import { useUIStore } from '../stores/uiStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useEntityStore } from '../stores/entityStore';
import type { View, TransactionViewFilter, TransactionType, Transaction } from '../types/finance.types';
import { TransactionType as TransactionTypeConstants } from '../types/finance.types';
import { VIEW_LABELS, FILTER_LABELS } from '../constants/finance.constants';

// Components
import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ReportView from '../components/ReportView';
import EntitySearchBox from '../components/EntitySearchBox';
import EntityManagement from '../components/EntityManagement';
import CategoryManagement from '../components/CategoryManagement';
import { PlusIcon } from '../components/Icons';

export default function Finance() {
  // Hooks
  const { 
    transactions, 
    loading: transactionsLoading, 
    createTransaction, 
    deleteTransaction: deleteTransactionHook,
    getTransactionsByType
  } = useTransactions();
  
  const { 
    entities, 
    loading: entitiesLoading, 
    findOrCreateEntity,
    createEntity,
    updateEntity,
    deleteEntity
  } = useEntities();

  // UI State
  const {
    currentView,
    transactionViewFilter,
    transactionEntityFilter,
    isTransactionFormVisible,
    isEntityManagementVisible,
    isCategoryManagementVisible,
    setCurrentView,
    setTransactionViewFilter,
    setTransactionEntityFilter,
    showTransactionForm,
    hideTransactionForm,
    showEntityManagement,
    hideEntityManagement,
    showCategoryManagement,
    hideCategoryManagement
  } = useUIStore();

  // Stores
  const { setTransactions } = useTransactionStore();
  const { setEntities } = useEntityStore();

  // Local state
  const [formInitialType, setFormInitialType] = useState<TransactionType>(TransactionTypeConstants.EXPENSE);

  // Sync data with stores
  useEffect(() => {
    setTransactions(transactions);
  }, [transactions, setTransactions]);

  useEffect(() => {
    setEntities(entities);
  }, [entities, setEntities]);

  // Handlers
  const handleOpenForm = (type: TransactionType) => {
    setFormInitialType(type);
    showTransactionForm();
  };

  const handleCreateTransaction = async (transactionInput: Parameters<typeof createTransaction>[0]) => {
    return await createTransaction(transactionInput);
  };

  const handleDeleteTransaction = async (id: string) => {
    return await deleteTransactionHook(id);
  };

  const handleAddEntity = async (name: string) => {
    return await findOrCreateEntity(name);
  };

  const isLoading = transactionsLoading || entitiesLoading;

  // Render view content
  const renderView = () => {
    switch (currentView) {
      case 'reports':
        return (
          <ReportView 
            transactions={transactions} 
            entities={entities} 
            isLoading={isLoading}
          />
        );
        
      case 'transactions': {
        // Get transactions by type
        const allIncomeTransactions = getTransactionsByType(TransactionTypeConstants.INCOME);
        const allExpenseTransactions = getTransactionsByType(TransactionTypeConstants.EXPENSE);

        // Filter by entity if needed
        const filterByEntity = (transactions: Transaction[]) => {
          if (transactionEntityFilter === 'all') return transactions;
          return transactions.filter(t => t.entity_id === transactionEntityFilter);
        };

        const incomeTransactions = filterByEntity(allIncomeTransactions);
        const expenseTransactions = filterByEntity(allExpenseTransactions);

        const incomeView = (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-success">Ingresos</h2>
              <button
                onClick={() => handleOpenForm(TransactionTypeConstants.INCOME)}
                className="btn btn-success btn-sm gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Nuevo Ingreso</span>
              </button>
            </div>
            <TransactionList
              transactions={incomeTransactions}
              entities={entities}
              onDeleteTransaction={handleDeleteTransaction}
              emptyListMessage="No hay ingresos registrados."
              isLoading={isLoading}
            />
          </div>
        );

        const expenseView = (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-error">Egresos</h2>
              <button
                onClick={() => handleOpenForm(TransactionTypeConstants.EXPENSE)}
                className="btn btn-error btn-sm gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Nuevo Egreso</span>
              </button>
            </div>
            <TransactionList
              transactions={expenseTransactions}
              entities={entities}
              onDeleteTransaction={handleDeleteTransaction}
              emptyListMessage="No hay egresos registrados."
              isLoading={isLoading}
            />
          </div>
        );

        return (
          <div className="space-y-6">
            {/* Entity Filter */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="form-control w-full max-w-sm">
                  <label className="label">
                    <span className="label-text font-medium">Filtrar por Persona / Empresa</span>
                  </label>
                  <EntitySearchBox
                    entities={entities}
                    value={transactionEntityFilter}
                    onChange={setTransactionEntityFilter}
                    placeholder="Buscar entidad..."
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center">
              <div className="tabs tabs-boxed">
                {(['all', 'income', 'expense'] as TransactionViewFilter[]).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTransactionViewFilter(filter)}
                    className={`tab ${transactionViewFilter === filter ? 'tab-active' : ''}`}
                  >
                    {FILTER_LABELS[filter]}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Views */}
            {transactionViewFilter === 'all' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {incomeView}
                {expenseView}
              </div>
            )}
            {transactionViewFilter === 'income' && incomeView}
            {transactionViewFilter === 'expense' && expenseView}
          </div>
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          {/* Navigation Tabs */}
          <div className="tabs tabs-boxed">
            {(['transactions', 'reports'] as View[]).map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`tab ${currentView === view ? 'tab-active' : ''}`}
              >
                {VIEW_LABELS[view]}
              </button>
            ))}
          </div>

          {/* Management Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={showEntityManagement}
              className="btn btn-outline btn-sm"
              disabled={isLoading}
            >
              <span className="hidden sm:inline">Gestionar </span>Entidades
            </button>
            <button
              onClick={showCategoryManagement}
              className="btn btn-outline btn-sm"
              disabled={isLoading}
            >
              <span className="hidden sm:inline">Gestionar </span>Categorías
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        {renderView()}

        {/* Transaction Form Modal */}
        {isTransactionFormVisible && (
          <TransactionForm
            onSubmit={handleCreateTransaction}
            entities={entities}
            onAddEntity={handleAddEntity}
            onClose={hideTransactionForm}
            initialType={formInitialType}
            isOpen={isTransactionFormVisible}
          />
        )}

        {/* Entity Management Modal */}
        {isEntityManagementVisible && (
          <EntityManagement
            entities={entities}
            onCreateEntity={createEntity}
            onUpdateEntity={updateEntity}
            onDeleteEntity={deleteEntity}
            onClose={hideEntityManagement}
            isOpen={isEntityManagementVisible}
          />
        )}

        {/* Category Management Modal */}
        {isCategoryManagementVisible && (
          <CategoryManagement
            onClose={hideCategoryManagement}
            isOpen={isCategoryManagementVisible}
          />
        )}
        
        {/* Floating Action Button */}
        <button
          onClick={() => handleOpenForm(TransactionTypeConstants.EXPENSE)}
          className="btn btn-primary btn-circle fixed bottom-6 right-6 shadow-lg z-10"
          aria-label="Agregar nueva transacción"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </main>
    </div>
  );
}
