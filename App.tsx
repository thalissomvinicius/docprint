import React, { useState } from 'react';
import { NavState } from './types';
import { Dashboard } from './components/Dashboard';
import { EconomicIndices } from './components/EconomicIndices';
import { DocPrintApp } from './components/DocPrintApp';
import { ToastProvider } from './contexts/ToastContext';

export default function App() {
  const [nav, setNav] = useState<NavState>('DASHBOARD');

  return (
    <ToastProvider>
      <div className="w-full h-[100dvh] overflow-hidden bg-neutral-50 text-neutral-800 font-sans">

        {/* Dashboard (Home) */}
        {nav === 'DASHBOARD' && (
          <Dashboard onNavigate={setNav} />
        )}

        {/* Tools */}
        {nav === 'DOCPRINT' && (
          <DocPrintApp onBack={() => setNav('DASHBOARD')} />
        )}

        {nav === 'INDICES' && (
          <EconomicIndices onBack={() => setNav('DASHBOARD')} />
        )}

      </div>
    </ToastProvider>
  );
}