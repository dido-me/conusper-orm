import { create } from 'zustand';
import type { View, TransactionViewFilter } from '../types/finance.types';

interface UIState {
  currentView: View;
  transactionViewFilter: TransactionViewFilter;
  transactionEntityFilter: string; // 'all' or entity ID
  isTransactionFormVisible: boolean;
  isReportModalVisible: boolean;
  isEntityManagementVisible: boolean;
  isCategoryManagementVisible: boolean;
  isMobileMenuOpen: boolean;
}

interface UIActions {
  setCurrentView: (view: View) => void;
  setTransactionViewFilter: (filter: TransactionViewFilter) => void;
  setTransactionEntityFilter: (entityId: string) => void;
  showTransactionForm: () => void;
  hideTransactionForm: () => void;
  toggleTransactionForm: () => void;
  showReportModal: () => void;
  hideReportModal: () => void;
  toggleReportModal: () => void;
  showEntityManagement: () => void;
  hideEntityManagement: () => void;
  toggleEntityManagement: () => void;
  showCategoryManagement: () => void;
  hideCategoryManagement: () => void;
  toggleCategoryManagement: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  resetUI: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // State
  currentView: 'transactions',
  transactionViewFilter: 'all',
  transactionEntityFilter: 'all',
  isTransactionFormVisible: false,
  isReportModalVisible: false,
  isEntityManagementVisible: false,
  isCategoryManagementVisible: false,
  isMobileMenuOpen: false,

  // Actions
  setCurrentView: (view) => set((state) => ({
    currentView: view,
    // Reset sub-filter when leaving transactions view
    transactionViewFilter: view !== 'transactions' ? 'all' : state.transactionViewFilter,
    // Close mobile menu when changing views
    isMobileMenuOpen: false
  })),
  
  setTransactionViewFilter: (filter) => set({ transactionViewFilter: filter }),
  
  setTransactionEntityFilter: (entityId) => set({ transactionEntityFilter: entityId }),
  
  showTransactionForm: () => set({ isTransactionFormVisible: true }),
  hideTransactionForm: () => set({ isTransactionFormVisible: false }),
  toggleTransactionForm: () => set((state) => ({ 
    isTransactionFormVisible: !state.isTransactionFormVisible 
  })),
  
  showReportModal: () => set({ isReportModalVisible: true }),
  hideReportModal: () => set({ isReportModalVisible: false }),
  toggleReportModal: () => set((state) => ({ 
    isReportModalVisible: !state.isReportModalVisible 
  })),
  
  showEntityManagement: () => set({ isEntityManagementVisible: true }),
  hideEntityManagement: () => set({ isEntityManagementVisible: false }),
  toggleEntityManagement: () => set((state) => ({ 
    isEntityManagementVisible: !state.isEntityManagementVisible 
  })),
  
  showCategoryManagement: () => set({ isCategoryManagementVisible: true }),
  hideCategoryManagement: () => set({ isCategoryManagementVisible: false }),
  toggleCategoryManagement: () => set((state) => ({ 
    isCategoryManagementVisible: !state.isCategoryManagementVisible 
  })),
  
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ 
    isMobileMenuOpen: !state.isMobileMenuOpen 
  })),
  
  resetUI: () => set({
    currentView: 'transactions',
    transactionViewFilter: 'all',
    transactionEntityFilter: 'all',
    isTransactionFormVisible: false,
    isReportModalVisible: false,
    isEntityManagementVisible: false,
    isCategoryManagementVisible: false,
    isMobileMenuOpen: false
  })
}));