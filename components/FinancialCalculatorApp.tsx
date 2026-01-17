import React, { useState } from 'react';
import { ArrowLeft, Calculator as CalcIcon, Sparkles, TrendingUp, DollarSign, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface FinancialCalculatorAppProps {
    onBack: () => void;
}

type SystemType = 'SAC' | 'PRICE';

interface Payment {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

export const FinancialCalculatorApp: React.FC<FinancialCalculatorAppProps> = ({ onBack }) => {
    const [propertyValue, setPropertyValue] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [annualRate, setAnnualRate] = useState('');
    const [months, setMonths] = useState('');
    const [system, setSystem] = useState<SystemType>('PRICE');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [showTable, setShowTable] = useState(false);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const parseCurrency = (value: string): number => {
        return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    };

    const calculateSAC = (principal: number, monthlyRate: number, totalMonths: number): Payment[] => {
        const payments: Payment[] = [];
        let balance = principal;
        const constantPrincipal = principal / totalMonths;

        for (let month = 1; month <= totalMonths; month++) {
            const interest = balance * monthlyRate;
            const payment = constantPrincipal + interest;

            payments.push({
                month,
                payment,
                principal: constantPrincipal,
                interest,
                balance: balance - constantPrincipal
            });

            balance -= constantPrincipal;
        }

        return payments;
    };

    const calculatePrice = (principal: number, monthlyRate: number, totalMonths: number): Payment[] => {
        const payments: Payment[] = [];
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        let balance = principal;

        for (let month = 1; month <= totalMonths; month++) {
            const interest = balance * monthlyRate;
            const principalPaid = payment - interest;

            payments.push({
                month,
                payment,
                principal: principalPaid,
                interest,
                balance: balance - principalPaid
            });

            balance -= principalPaid;
        }

        return payments;
    };

    const handleCalculate = () => {
        const propValue = parseCurrency(propertyValue);
        const down = parseCurrency(downPayment);
        const rate = parseFloat(annualRate) / 100;
        const period = parseInt(months);

        if (!propValue || !rate || !period || propValue <= down) {
            return;
        }

        const principal = propValue - down;
        const monthlyRate = Math.pow(1 + rate, 1 / 12) - 1;

        const calculated = system === 'SAC'
            ? calculateSAC(principal, monthlyRate, period)
            : calculatePrice(principal, monthlyRate, period);

        setPayments(calculated);
        setShowTable(true);
    };

    const totalInterest = payments.reduce((sum, p) => sum + p.interest, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.payment, 0);
    const financedAmount = parseCurrency(propertyValue) - parseCurrency(downPayment);

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-teal-50 via-white to-cyan-50/50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-teal-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-cyan-400/10 rounded-full blur-3xl" />
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
                        className="flex items-center gap-2 text-neutral-600 hover:text-teal-600 px-2 py-2 -mx-2 rounded-xl hover:bg-white/80 transition-all mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm">Voltar</span>
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <Sparkles className="text-teal-600" size={28} />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Calculadora de Financiamento</h1>
                    </div>
                    <p className="text-neutral-600 text-sm md:text-base">
                        Simule financiamentos SAC ou Price
                    </p>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* Input Form */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-teal-200 p-6 md:p-8 shadow-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Property Value */}
                                <div>
                                    <label className="block text-sm md:text-base font-bold text-neutral-700 mb-2">
                                        <DollarSign size={16} className="inline mr-1" />
                                        Valor do Imóvel
                                    </label>
                                    <input
                                        type="text"
                                        value={propertyValue}
                                        onChange={(e) => setPropertyValue(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-base font-medium"
                                        placeholder="R$ 300.000,00"
                                    />
                                </div>

                                {/* Down Payment */}
                                <div>
                                    <label className="block text-sm md:text-base font-bold text-neutral-700 mb-2">
                                        Entrada
                                    </label>
                                    <input
                                        type="text"
                                        value={downPayment}
                                        onChange={(e) => setDownPayment(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-base font-medium"
                                        placeholder="R$ 60.000,00"
                                    />
                                </div>

                                {/* Annual Rate */}
                                <div>
                                    <label className="block text-sm md:text-base font-bold text-neutral-700 mb-2">
                                        Taxa de Juros Anual (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={annualRate}
                                        onChange={(e) => setAnnualRate(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-base font-medium"
                                        placeholder="10.5"
                                    />
                                </div>

                                {/* Months */}
                                <div>
                                    <label className="block text-sm md:text-base font-bold text-neutral-700 mb-2">
                                        Prazo (meses)
                                    </label>
                                    <input
                                        type="number"
                                        value={months}
                                        onChange={(e) => setMonths(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-base font-medium"
                                        placeholder="360"
                                    />
                                </div>

                                {/* System Selection */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm md:text-base font-bold text-neutral-700 mb-3">
                                        Sistema de Amortização
                                    </label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setSystem('PRICE')}
                                            className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${system === 'PRICE'
                                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-xl'
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                }`}
                                        >
                                            Tabela Price
                                        </button>
                                        <button
                                            onClick={() => setSystem('SAC')}
                                            className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${system === 'SAC'
                                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-xl'
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                }`}
                                        >
                                            SAC
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCalculate}
                                className="w-full mt-6 px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold hover:from-teal-600 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-base md:text-lg"
                            >
                                <CalcIcon size={24} />
                                Calcular Financiamento
                            </motion.button>
                        </motion.div>

                        {/* Results */}
                        {showTable && payments.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-teal-200">
                                        <p className="text-sm text-neutral-600 mb-1">Valor Financiado</p>
                                        <p className="text-2xl font-bold text-teal-600">{formatCurrency(financedAmount)}</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                                        <p className="text-sm text-neutral-600 mb-1">Total de Juros</p>
                                        <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalInterest)}</p>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                                        <p className="text-sm text-neutral-600 mb-1">Total a Pagar</p>
                                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
                                    </div>
                                </div>

                                {/* Amortization Table */}
                                <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <TrendingUp size={20} />
                                            Tabela de Amortização ({system})
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto max-h-96">
                                        <table className="w-full text-sm">
                                            <thead className="bg-neutral-50 sticky top-0">
                                                <tr className="text-left">
                                                    <th className="px-4 py-3 font-bold text-neutral-700">Mês</th>
                                                    <th className="px-4 py-3 font-bold text-neutral-700">Prestação</th>
                                                    <th className="px-4 py-3 font-bold text-neutral-700">Amortização</th>
                                                    <th className="px-4 py-3 font-bold text-neutral-700">Juros</th>
                                                    <th className="px-4 py-3 font-bold text-neutral-700">Saldo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payments.map((payment) => (
                                                    <tr key={payment.month} className="border-t border-neutral-100 hover:bg-teal-50">
                                                        <td className="px-4 py-3 font-medium">{payment.month}</td>
                                                        <td className="px-4 py-3">{formatCurrency(payment.payment)}</td>
                                                        <td className="px-4 py-3 text-green-600">{formatCurrency(payment.principal)}</td>
                                                        <td className="px-4 py-3 text-orange-600">{formatCurrency(payment.interest)}</td>
                                                        <td className="px-4 py-3 text-blue-600">{formatCurrency(payment.balance)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl">
                                    <p className="text-sm text-blue-900 flex items-start gap-2">
                                        <Info size={16} className="mt-0.5 shrink-0" />
                                        <span>
                                            <strong>{system === 'SAC' ? 'SAC' : 'Price'}:</strong> {system === 'SAC'
                                                ? 'Amortização constante com parcelas decrescentes. Ideal para quem quer pagar menos juros no total.'
                                                : 'Parcelas fixas durante todo o financiamento. Ideal para planejamento financeiro com prestações iguais.'}
                                        </span>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
