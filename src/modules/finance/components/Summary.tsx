import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ScaleIcon } from './Icons';

interface SummaryProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, colorClass }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className={`avatar placeholder ${colorClass}`}>
            <div className="w-12 h-12 rounded-full">
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-base-content/70">{title}</h3>
            <p className="text-2xl font-bold text-base-content">
              S/ {amount.toLocaleString('es-PE', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Summary: React.FC<SummaryProps> = ({ totalIncome, totalExpenses, balance }) => {
  const balanceColorClass = balance >= 0 ? 'bg-success' : 'bg-error';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Ingresos Totales"
        amount={totalIncome}
        icon={<ArrowUpIcon className="h-6 w-6 text-white" />}
        colorClass="bg-success"
      />
      <SummaryCard
        title="Gastos Totales"
        amount={totalExpenses}
        icon={<ArrowDownIcon className="h-6 w-6 text-white" />}
        colorClass="bg-error"
      />
      <SummaryCard
        title="Balance General"
        amount={balance}
        icon={<ScaleIcon className="h-6 w-6 text-white" />}
        colorClass={balanceColorClass}
      />
    </div>
  );
};

export default Summary;