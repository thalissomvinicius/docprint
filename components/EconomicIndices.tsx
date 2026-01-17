import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar, TrendingUp, Info, RefreshCw, AlertCircle, Sparkles, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { SkeletonCard } from './ui/SkeletonCard';
import { ECONOMIC_INDICES } from '../constants';

interface EconomicIndicesProps {
  onBack: () => void;
}

interface IndexData {
  [indexId: string]: Record<string, number>;
}

interface MonthOption {
  value: string; // YYYY-MM
  label: string;
}

export const EconomicIndices: React.FC<EconomicIndicesProps> = ({ onBack }) => {
  const [selectedIndexId, setSelectedIndexId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const [data, setData] = useState<IndexData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([]);

  // Fetch Data from BCB API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      const newData: IndexData = {};
      const monthsSet = new Set<string>();

      try {
        const promises = ECONOMIC_INDICES.map(async (idx) => {
          if (!idx.bcbSeriesId) return;

          try {
            const response = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${idx.bcbSeriesId}/dados?ultimo=12&formato=json`);
            if (!response.ok) throw new Error('Network error');

            const json = await response.json();
            newData[idx.id] = {};

            json.forEach((item: any) => {
              const [day, month, year] = item.data.split('/');
              const key = `${year}-${month}`;
              const val = Number(item.valor);

              newData[idx.id][key] = val;
              monthsSet.add(key);
            });
          } catch (err) {
            console.warn(`Failed to fetch ${idx.id}`, err);
          }
        });

        await Promise.all(promises);
        setData(newData);

        const sortedMonths = Array.from(monthsSet).sort().reverse().map(m => {
          const [y, mon] = m.split('-');
          const date = new Date(parseInt(y), parseInt(mon) - 1, 1);
          const label = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
          return { value: m, label: label.charAt(0).toUpperCase() + label.slice(1) };
        });

        setAvailableMonths(sortedMonths);

        if (sortedMonths.length > 0) {
          setSelectedMonth(sortedMonths[0].value);
        }

      } catch (e) {
        console.error("Global fetch error", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedIndex = ECONOMIC_INDICES.find(i => i.id === selectedIndexId);
  const resultValue = selectedIndex && selectedMonth && data[selectedIndex.id]
    ? data[selectedIndex.id][selectedMonth]
    : null;

  const calculateAnnualAccumulated = () => {
    if (!selectedIndex || !data[selectedIndex.id] || !selectedMonth) return null;

    const indexData = data[selectedIndex.id];
    const [selectedYear, selectedMonthNum] = selectedMonth.split('-');
    const selectedDate = new Date(parseInt(selectedYear), parseInt(selectedMonthNum) - 1, 1);

    const allMonths = Object.keys(indexData).sort();
    const twelveMonthsAgo = new Date(selectedDate);
    twelveMonthsAgo.setMonth(selectedDate.getMonth() - 11);

    const monthsInRange = allMonths.filter(month => {
      const [year, monthNum] = month.split('-');
      const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      return monthDate >= twelveMonthsAgo && monthDate <= selectedDate;
    });

    if (monthsInRange.length === 0) return null;

    const accumulated = monthsInRange.reduce((acc, month) => {
      const monthValue = indexData[month] || 0;
      return acc * (1 + monthValue / 100);
    }, 1);

    return (accumulated - 1) * 100;
  };

  const annualAccumulated = calculateAnnualAccumulated();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50 via-white to-green-50/50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white/70 backdrop-blur-xl px-6 py-6 shadow-sm border-b border-white/20 flex items-center gap-3 shrink-0"
        >
          <button onClick={onBack} className="p-2 -ml-2 text-neutral-600 hover:text-green-600 rounded-xl hover:bg-white/80 transition-all">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="text-green-600" size={24} />
              <h1 className="text-2xl font-bold text-neutral-900">Índices Econômicos</h1>
            </div>
            <p className="text-sm text-neutral-500 flex items-center gap-1">
              Fonte: Banco Central do Brasil
              {loading && <RefreshCw size={12} className="animate-spin ml-1" />}
            </p>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 max-w-3xl mx-auto w-full">

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3 text-red-700 text-sm"
              >
                <AlertCircle size={20} className="shrink-0" />
                <p>Não foi possível atualizar os dados. Verifique sua conexão.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 space-y-5 mb-6 relative"
          >

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-neutral-100 flex items-center gap-3">
                  <RefreshCw className="animate-spin text-green-600" size={24} />
                  <span className="text-sm font-semibold text-neutral-700">Atualizando...</span>
                </div>
              </div>
            )}

            {/* Index Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600" />
                Selecione o Índice
              </label>
              <div className="relative">
                <motion.select
                  whileFocus={{ scale: 1.01 }}
                  value={selectedIndexId}
                  onChange={(e) => setSelectedIndexId(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-neutral-200 text-neutral-900 text-base rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 block p-4 pr-10 transition-all font-medium shadow-sm hover:border-neutral-300"
                >
                  <option value="" disabled>Escolha um indicador...</option>
                  {ECONOMIC_INDICES.map(idx => (
                    <option key={idx.id} value={idx.id}>{idx.name} - {idx.fullName}</option>
                  ))}
                </motion.select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Month Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Calendar size={18} className="text-green-600" />
                Mês de Referência
              </label>
              <div className="relative">
                <motion.select
                  whileFocus={{ scale: 1.01 }}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  disabled={availableMonths.length === 0}
                  className="w-full appearance-none bg-white border-2 border-neutral-200 text-neutral-900 text-base rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 block p-4 pr-10 transition-all font-medium shadow-sm hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {availableMonths.length === 0 ? (
                    <option>Carregando datas...</option>
                  ) : (
                    availableMonths.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))
                  )}
                </motion.select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {selectedIndex && selectedMonth && resultValue !== null && resultValue !== undefined ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-white" size={20} />
                    <span className="font-bold text-white text-xl">{selectedIndex.name}</span>
                  </div>
                  <span className="text-sm font-medium bg-white/20 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    {availableMonths.find(m => m.value === selectedMonth)?.label}
                  </span>
                </div>

                {/* Values */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Monthly Value */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wider font-bold">Valor no Mês</p>
                    <div className="text-5xl font-bold text-neutral-900 tracking-tight flex items-center justify-center gap-2">
                      {resultValue >= 0 ? (
                        <TrendingUp className="text-green-600" size={32} />
                      ) : (
                        <TrendingDown className="text-red-600" size={32} />
                      )}
                      <span className={resultValue >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {resultValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-2xl text-neutral-400">%</span>
                    </div>
                    <p className={`text-sm mt-2 font-medium ${resultValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {resultValue >= 0 ? 'Variação positiva' : 'Variação negativa'}
                    </p>
                  </motion.div>

                  {/* Annual Accumulated */}
                  {annualAccumulated !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center md:border-l border-neutral-100"
                    >
                      <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wider font-bold">Acumulado 12 Meses</p>
                      <div className="text-5xl font-bold text-blue-600 tracking-tight flex items-center justify-center gap-2">
                        <span>{annualAccumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-2xl text-blue-400">%</span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-2 font-medium">
                        Últimos 12 meses
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-neutral-50 p-5 border-t border-neutral-100 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {selectedIndex.description}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-neutral-200 bg-white/50"
              >
                {loading ? (
                  <SkeletonCard variant="dashboard" />
                ) : (
                  <>
                    <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      Aguardando Seleção
                    </h3>
                    <p className="text-neutral-500 text-base">
                      Selecione um índice e um mês acima para visualizar os dados atualizados.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};