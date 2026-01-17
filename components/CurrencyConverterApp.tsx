import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRightLeft, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CurrencyConverterAppProps {
    onBack: () => void;
}

interface ExchangeRates {
    [key: string]: number;
}

export const CurrencyConverterApp: React.FC<CurrencyConverterAppProps> = ({ onBack }) => {
    const [amount, setAmount] = useState('1000');
    const [fromCurrency, setFromCurrency] = useState('BRL');
    const [toCurrency, setToCurrency] = useState('USD');
    const [rates, setRates] = useState<ExchangeRates>({});
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<number | null>(null);

    const currencies = [
        { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
        { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
        { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
        { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
    ];

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
            const data = await response.json();
            setRates(data.rates);
        } catch (error) {
            console.error('Error fetching rates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConvert = () => {
        const value = parseFloat(amount);
        if (isNaN(value) || !rates[fromCurrency] || !rates[toCurrency]) return;

        // Convert to BRL first, then to target currency
        const inBRL = fromCurrency === 'BRL' ? value : value / rates[fromCurrency];
        const converted = toCurrency === 'BRL' ? inBRL : inBRL * rates[toCurrency];

        setResult(converted);
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setResult(null);
    };

    useEffect(() => {
        if (amount && fromCurrency && toCurrency && rates[fromCurrency]) {
            handleConvert();
        }
    }, [amount, fromCurrency, toCurrency, rates]);

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-cyan-50 via-white to-teal-50/50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-teal-400/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white/80 backdrop-blur-xl px-6 py-6 shadow-sm border-b border-white/20 shrink-0"
                >
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-neutral-600 hover:text-cyan-600 px-2 py-2 -mx-2 rounded-xl hover:bg-white/80 transition-all mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm">Voltar</span>
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <Sparkles className="text-cyan-600" size={28} />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Conversor de Moedas</h1>
                    </div>
                    <p className="text-neutral-600 text-sm md:text-base">
                        Taxas de câmbio atualizadas em tempo real
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-2xl mx-auto space-y-6">

                        {/* Converter Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-cyan-200 p-6 md:p-8 shadow-xl"
                        >
                            {loading ? (
                                <div className="text-center py-8">
                                    <Loader2 className="animate-spin mx-auto text-cyan-600 mb-2" size={32} />
                                    <p className="text-neutral-600">Carregando taxas...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-neutral-700 mb-2">
                                            Valor
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full px-4 py-4 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-xl font-bold"
                                            placeholder="1000.00"
                                        />
                                    </div>

                                    {/* From Currency */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-neutral-700 mb-2">
                                            De
                                        </label>
                                        <select
                                            value={fromCurrency}
                                            onChange={(e) => setFromCurrency(e.target.value)}
                                            className="w-full px-4 py-4 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-base font-medium"
                                        >
                                            {currencies.map(curr => (
                                                <option key={curr.code} value={curr.code}>
                                                    {curr.flag} {curr.name} ({curr.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Swap Button */}
                                    <div className="flex justify-center">
                                        <motion.button
                                            whileTap={{ scale: 0.9, rotate: 180 }}
                                            onClick={swapCurrencies}
                                            className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg hover:shadow-xl"
                                        >
                                            <ArrowRightLeft size={24} />
                                        </motion.button>
                                    </div>

                                    {/* To Currency */}
                                    <div>
                                        <label className="block text-sm md:text-base font-bold text-neutral-700 mb-2">
                                            Para
                                        </label>
                                        <select
                                            value={toCurrency}
                                            onChange={(e) => setToCurrency(e.target.value)}
                                            className="w-full px-4 py-4 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-base font-medium"
                                        >
                                            {currencies.map(curr => (
                                                <option key={curr.code} value={curr.code}>
                                                    {curr.flag} {curr.name} ({curr.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Result */}
                                    {result !== null && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl p-6 text-white text-center"
                                        >
                                            <p className="text-sm opacity-90 mb-1">Resultado</p>
                                            <p className="text-4xl font-bold">
                                                {result.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: toCurrency === 'BRL' ? 'BRL' : 'USD'
                                                })}
                                            </p>
                                            <p className="text-sm opacity-75 mt-2">
                                                1 {fromCurrency} = {(rates[toCurrency] / (fromCurrency === 'BRL' ? 1 : rates[fromCurrency])).toFixed(4)} {toCurrency}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Refresh Button */}
                                    <button
                                        onClick={fetchRates}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium flex items-center justify-center gap-2 transition-all"
                                    >
                                        <RefreshCw size={16} />
                                        Atualizar Taxas
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-blue-50/80 backdrop-blur-sm border-l-4 border-blue-500 p-5 rounded-xl shadow-sm"
                        >
                            <p className="text-sm md:text-base text-blue-900">
                                <strong className="font-bold">ℹ️ Informação:</strong> As taxas de câmbio são atualizadas em tempo real através da ExchangeRate API.
                                Os valores são apenas para referência e podem variar conforme a instituição financeira.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
