import React from 'react';
import { NavState } from '../types';
import { FileText, TrendingUp, ShieldCheck, Receipt, Download, Calculator, ArrowRightLeft, QrCode, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from './ui/AnimatedCard';
import { haptics } from '../utils/haptics';

interface DashboardProps {
  onNavigate: (page: NavState) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24
    }
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative pb-20 md:pb-0">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 backdrop-blur-xl border-b border-white/20 px-8 py-12 shadow-2xl"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-4xl"
                >
                  🏢
                </motion.div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">Portal do Corretor</h1>
                <p className="text-blue-100 text-lg font-medium mt-1">Ferramentas essenciais para o seu sucesso</p>
              </div>
            </motion.div>
          </div>
        </motion.header>


        {/* Main Content */}
        <motion.main
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full"
        >
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Suas Ferramentas
            </h2>
            <p className="text-neutral-600 text-lg">Escolha uma ferramenta para começar</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">


            {/* DocPrint Card - Featured */}
            <motion.div variants={item} className="col-span-2 lg:col-span-3">
              <AnimatedCard
                onClick={() => { haptics.medium(); onNavigate('DOCPRINT'); }}
                className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 cursor-pointer group bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-4 border-transparent bg-clip-padding relative overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl shadow-blue-500/50 relative z-10 shrink-0">
                  <FileText className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                  <h2 className="text-2xl md:text-4xl font-black text-neutral-900 mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Scanner & PDF (DocPrint)
                  </h2>
                  <p className="text-neutral-600 text-sm md:text-lg leading-relaxed max-w-2xl">
                    Digitalize documentos, recorte, aplique filtros profissionais e monte PDFs A4 prontos para envio.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Indices Card */}
            <motion.div variants={item}>
              <AnimatedCard
                onClick={() => { haptics.light(); onNavigate('INDICES'); }}
                className="p-4 md:p-6 flex flex-col items-start gap-3 md:gap-4 cursor-pointer group border border-green-200 hover:border-green-400 h-full"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                  <TrendingUp className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-bold text-neutral-800 mb-1 md:mb-2 leading-tight">Índices Econômicos</h2>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    IGPM, IPCA, Selic e mais.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Contracts Card */}
            <motion.div variants={item}>
              <AnimatedCard
                onClick={() => { haptics.light(); onNavigate('CONTRACTS'); }}
                className="p-4 md:p-6 flex flex-col items-start gap-3 md:gap-4 cursor-pointer group border border-purple-200 hover:border-purple-400 h-full"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                  <ShieldCheck className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-bold text-neutral-800 mb-1 md:mb-2 leading-tight">Gerar Contratos</h2>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    Vistoria, aluguel e venda.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Receipt Card */}
            <motion.div variants={item}>
              <AnimatedCard
                onClick={() => { haptics.light(); onNavigate('RECEIPT'); }}
                className="p-4 md:p-6 flex flex-col items-start gap-3 md:gap-4 cursor-pointer group border border-orange-200 hover:border-orange-400 h-full"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                  <Receipt className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-bold text-neutral-800 mb-1 md:mb-2 leading-tight">Gerar Recibo</h2>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    Recibos com assinatura.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Video Downloader Card */}
            <motion.div variants={item}>
              <AnimatedCard
                onClick={() => { haptics.light(); onNavigate('DOWNLOADER'); }}
                className="p-4 md:p-6 flex flex-col items-start gap-3 md:gap-4 cursor-pointer group border border-pink-200 hover:border-pink-400 h-full"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-pink-400 to-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
                  <Download className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-bold text-neutral-800 mb-1 md:mb-2 leading-tight">Downloads</h2>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    Instagram, TikTok, YouTube.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Financial Calculator Card */}
            <motion.div variants={item}>
              <AnimatedCard
                onClick={() => { haptics.light(); onNavigate('CALCULATOR'); }}
                className="p-4 md:p-6 flex flex-col items-start gap-3 md:gap-4 cursor-pointer group border border-teal-200 hover:border-teal-400 h-full"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-teal-500/30">
                  <Calculator className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-bold text-neutral-800 mb-1 md:mb-2 leading-tight">Calculadora</h2>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    Financiamento SAC/Price.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Currency Converter Card */}
            <motion.div variants={item}>
              <AnimatedCard
                onClick={() => { haptics.light(); onNavigate('CONVERTER'); }}
                className="p-4 md:p-6 flex flex-col items-start gap-3 md:gap-4 cursor-pointer group border border-cyan-200 hover:border-cyan-400 h-full"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                  <ArrowRightLeft className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-bold text-neutral-800 mb-1 md:mb-2 leading-tight">Conversor</h2>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    Taxas em tempo real.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* QR Code Generator Card */}
            <motion.div variants={item}>
              <AnimatedCard
                onClick={() => { haptics.light(); onNavigate('QRCODE'); }}
                className="p-4 md:p-6 flex flex-col items-start gap-3 md:gap-4 cursor-pointer group border border-indigo-200 hover:border-indigo-400 h-full"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
                  <QrCode className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-bold text-neutral-800 mb-1 md:mb-2 leading-tight">QR Code</h2>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    PIX, URLs e WhatsApp.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* News Card */}
            <motion.div variants={item}>
              <AnimatedCard
                onClick={() => { haptics.light(); onNavigate('NEWS'); }}
                className="p-4 md:p-6 flex flex-col items-start gap-3 md:gap-4 cursor-pointer group border border-amber-200 hover:border-amber-400 h-full"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/30">
                  <Newspaper className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h2 className="text-sm md:text-xl font-bold text-neutral-800 mb-1 md:mb-2 leading-tight">Notícias</h2>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    Novidades do mercado.
                  </p>
                </div>
              </AnimatedCard>
            </motion.div>

          </div>
        </motion.main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 text-center text-xs text-neutral-400"
        >
          <p>Desenvolvido por Vinicius Dev</p>
        </motion.footer>
      </div>
    </div>
  );
};