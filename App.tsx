import React, { useState } from 'react';
import { NavState } from './types';
import { Dashboard } from './components/Dashboard';
import { AboutPage } from './components/AboutPage';
import { EconomicIndices } from './components/EconomicIndices';
import { DocPrintApp } from './components/DocPrintApp';
import { ContractsApp } from './components/ContractsApp';
import { ReceiptApp } from './components/ReceiptApp';
import { VideoDownloaderApp } from './components/VideoDownloaderApp';
import { FinancialCalculatorApp } from './components/FinancialCalculatorApp';
import { CurrencyConverterApp } from './components/CurrencyConverterApp';
import { QRCodeGeneratorApp } from './components/QRCodeGeneratorApp';
import { NewsApp } from './components/NewsApp';
import { ToastProvider } from './contexts/ToastContext';
import { Sidebar, SidebarBody, SidebarLink } from './components/ui/sidebar';
import { LayoutDashboard, FileText, TrendingUp, ShieldCheck, Receipt, Download, Calculator, ArrowRightLeft, QrCode, Newspaper, Code2, Home, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';

export default function App() {
  const [nav, setNav] = useState<NavState>('ABOUT');
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Início",
      href: "#",
      icon: <Home className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('ABOUT')
    },
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('DASHBOARD')
    },
    {
      label: "Scanner & PDF",
      href: "#",
      icon: <FileText className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('DOCPRINT')
    },
    {
      label: "Índices Econômicos",
      href: "#",
      icon: <TrendingUp className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('INDICES')
    },
    {
      label: "Contratos",
      href: "#",
      icon: <ShieldCheck className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('CONTRACTS')
    },
    {
      label: "Recibos",
      href: "#",
      icon: <Receipt className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('RECEIPT')
    },
    {
      label: "Download de Vídeos",
      href: "#",
      icon: <Download className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('DOWNLOADER')
    },
    {
      label: "Calculadora Financeira",
      href: "#",
      icon: <Calculator className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('CALCULATOR')
    },
    {
      label: "Conversor de Moedas",
      href: "#",
      icon: <ArrowRightLeft className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('CONVERTER')
    },
    {
      label: "Gerador de QR Code",
      href: "#",
      icon: <QrCode className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('QRCODE')
    },
    {
      label: "Notícias do Mercado",
      href: "#",
      icon: <Newspaper className="h-5 w-5 flex-shrink-0" />,
      onClick: () => setNav('NEWS')
    }
  ];

  // Mobile links (same as desktop main links)
  const sidebarLinks = links;

  return (
    <ToastProvider>
      <div className={cn(
        "flex flex-col md:flex-row bg-neutral-100 dark:bg-neutral-800 w-full h-full overflow-hidden"
      )}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10" links={sidebarLinks}>
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <div className="mt-auto pt-4 border-t border-white/10">
                <div className={cn(
                  "flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-default",
                  !open && "justify-center px-0 bg-transparent hover:bg-transparent"
                )}>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0">
                    <Code2 size={18} />
                  </div>
                  <motion.div
                    animate={{
                      display: open ? "flex" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="flex flex-col overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-xs text-white/60 font-medium">Desenvolvido por</span>
                    <span className="text-sm text-white font-bold">Vinicius Dev</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main Content Area with Page Transitions */}
        <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-neutral-900 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={nav}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {nav === 'ABOUT' && <AboutPage onNavigate={setNav} />}
              {nav === 'DASHBOARD' && <Dashboard onNavigate={setNav} />}
              {nav === 'DOCPRINT' && <DocPrintApp onBack={() => setNav('DASHBOARD')} />}
              {nav === 'INDICES' && <EconomicIndices onBack={() => setNav('DASHBOARD')} />}
              {nav === 'CONTRACTS' && <ContractsApp onBack={() => setNav('DASHBOARD')} />}
              {nav === 'RECEIPT' && <ReceiptApp onBack={() => setNav('DASHBOARD')} />}
              {nav === 'DOWNLOADER' && <VideoDownloaderApp onBack={() => setNav('DASHBOARD')} />}
              {nav === 'CALCULATOR' && <FinancialCalculatorApp onBack={() => setNav('DASHBOARD')} />}
              {nav === 'CONVERTER' && <CurrencyConverterApp onBack={() => setNav('DASHBOARD')} />}
              {nav === 'QRCODE' && <QRCodeGeneratorApp onBack={() => setNav('DASHBOARD')} />}
              {nav === 'NEWS' && <NewsApp onBack={() => setNav('DASHBOARD')} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ToastProvider>
  );
}

export const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20">
      <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Building2 className="text-white h-5 w-5" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre text-lg"
      >
        Portal do Corretor
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20">
      <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Building2 className="text-white h-5 w-5" />
      </div>
    </div>
  );
};