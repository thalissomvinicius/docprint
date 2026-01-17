import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReceiptData } from '../../utils/pdfGenerator';

interface Step1Props {
    formData: ReceiptData;
    onUpdate: (field: keyof ReceiptData, value: string) => void;
}

export const Step1_BasicInfo: React.FC<Step1Props> = ({ formData, onUpdate }) => {
    const [displayValue, setDisplayValue] = useState('');

    // Format currency input
    const formatCurrency = (value: string) => {
        // Remove all non-digits
        const numbers = value.replace(/\D/g, '');

        if (!numbers) return '';

        // Convert to cents
        const cents = parseInt(numbers);

        // Format as currency
        const formatted = (cents / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return formatted;
    };

    const handleValueChange = (value: string) => {
        const formatted = formatCurrency(value);
        setDisplayValue(formatted);
        onUpdate('amount', formatted);
    };

    useEffect(() => {
        if (formData.amount) {
            setDisplayValue(formData.amount);
        }
    }, []);

    const inputClass = "w-full px-4 md:px-5 py-4 md:py-4 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base md:text-lg font-medium shadow-sm";
    const labelClass = "block text-sm md:text-base font-bold text-neutral-700 mb-2";

    return (
        <div className="max-w-2xl mx-auto space-y-5 md:space-y-6">
            {/* Payment Amount - Mobile Optimized */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-3xl border-2 border-orange-300 p-6 md:p-8 shadow-xl"
            >
                <div className="flex items-center gap-3 mb-5">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg"
                    >
                        <DollarSign className="text-white" size={28} />
                    </motion.div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-orange-900">Valor do Pagamento</h3>
                        <p className="text-sm md:text-base text-orange-700">Digite o valor recebido</p>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-orange-200 shadow-inner">
                    <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-2xl md:text-3xl font-bold text-orange-600 shrink-0">R$</span>
                        <input
                            type="tel"
                            inputMode="decimal"
                            value={displayValue}
                            onChange={(e) => handleValueChange(e.target.value)}
                            className="flex-1 min-w-0 px-3 md:px-6 py-3 md:py-5 text-2xl md:text-4xl font-bold border-0 rounded-xl focus:ring-4 focus:ring-orange-400 bg-white text-orange-900 placeholder-orange-300 shadow-lg"
                            placeholder="0,00"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="mt-4 bg-orange-100/50 rounded-xl p-3 border border-orange-200">
                    <p className="text-xs md:text-sm text-orange-800 flex items-center gap-2">
                        <span className="text-base">💡</span>
                        <span className="font-medium">Digite apenas números - a formatação é automática!</span>
                    </p>
                </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-neutral-200 p-5 md:p-6 shadow-lg"
            >
                <h3 className="text-lg md:text-xl font-bold text-neutral-900 mb-5 md:mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xl">📋</span>
                    </div>
                    Detalhes do Pagamento
                </h3>

                <div className="space-y-5">
                    {/* Date */}
                    <div>
                        <label className={labelClass}>
                            Data do Pagamento
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.paymentDate || ''}
                            onChange={(e) => onUpdate('paymentDate', e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className={labelClass}>
                            Forma de Pagamento
                        </label>
                        <select
                            value={formData.paymentMethod || ''}
                            onChange={(e) => onUpdate('paymentMethod', e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Selecione...</option>
                            <option value="Dinheiro">💵 Dinheiro</option>
                            <option value="PIX">💳 PIX</option>
                            <option value="Transferência Bancária">🏦 Transferência Bancária</option>
                            <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
                            <option value="Cartão de Débito">💳 Cartão de Débito</option>
                            <option value="Cheque">📝 Cheque</option>
                            <option value="Boleto">🧾 Boleto</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>
                            Descrição / Referente a
                        </label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => onUpdate('description', e.target.value)}
                            className={inputClass}
                            rows={4}
                            placeholder="Ex: Pagamento referente ao aluguel do mês de dezembro/2024"
                        />
                        <p className="text-xs md:text-sm text-neutral-500 mt-2">
                            Descreva o motivo do pagamento (opcional)
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Info Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-50/80 backdrop-blur-sm border-l-4 border-blue-500 p-4 md:p-5 rounded-xl shadow-sm"
            >
                <p className="text-sm md:text-base text-blue-800 flex items-start gap-2">
                    <span className="text-lg shrink-0">ℹ️</span>
                    <span>
                        <span className="font-bold">Informação:</span> Todos os campos são opcionais,
                        exceto os marcados com <span className="text-red-500 font-bold">*</span>
                    </span>
                </p>
            </motion.div>
        </div>
    );
};
