import React from 'react';
import { WalletIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <WalletIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-base-content">Control Financiero</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;