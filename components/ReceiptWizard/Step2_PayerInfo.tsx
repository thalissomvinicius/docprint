import React from 'react';
import { ReceiptData } from '../../utils/pdfGenerator';
import { User } from 'lucide-react';

interface Step2Props {
    formData: ReceiptData;
    onUpdate: (field: keyof ReceiptData, value: string) => void;
}

export const Step2_PayerInfo: React.FC<Step2Props> = ({ formData, onUpdate }) => {
    const inputClass = "w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base";
    const labelClass = "block text-sm font-bold text-neutral-700 mb-2";

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <User size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-neutral-900">Dados do Pagador</h3>
                        <p className="text-sm text-neutral-600">Quem está fazendo o pagamento</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className={labelClass}>
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={formData.payerName || ''}
                            onChange={(e) => onUpdate('payerName', e.target.value)}
                            className={inputClass}
                            placeholder="Ex: João da Silva Santos"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            CPF
                        </label>
                        <input
                            type="text"
                            value={formData.payerCPF || ''}
                            onChange={(e) => onUpdate('payerCPF', e.target.value)}
                            className={inputClass}
                            placeholder="000.000.000-00"
                            maxLength={14}
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                            Digite apenas números ou no formato XXX.XXX.XXX-XX
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Endereço Completo
                        </label>
                        <textarea
                            value={formData.payerAddress || ''}
                            onChange={(e) => onUpdate('payerAddress', e.target.value)}
                            className={inputClass}
                            rows={3}
                            placeholder="Ex: Rua das Flores, 123, Apto 45, Bairro Centro, São Paulo - SP, CEP 01234-567"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                    <span className="font-bold">📝 Nota:</span> Todos os campos desta etapa são opcionais.
                    Preencha apenas se desejar incluir no recibo.
                </p>
            </div>
        </div>
    );
};
