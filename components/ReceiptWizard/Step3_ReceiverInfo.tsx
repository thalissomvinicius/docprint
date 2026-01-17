import React from 'react';
import { ReceiptData } from '../../utils/pdfGenerator';
import { UserCheck } from 'lucide-react';

interface Step3Props {
    formData: ReceiptData;
    onUpdate: (field: keyof ReceiptData, value: string) => void;
}

export const Step3_ReceiverInfo: React.FC<Step3Props> = ({ formData, onUpdate }) => {
    const inputClass = "w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-base";
    const labelClass = "block text-sm font-bold text-neutral-700 mb-2";

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <UserCheck size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-neutral-900">Dados do Recebedor</h3>
                        <p className="text-sm text-neutral-600">Quem está recebendo o pagamento</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className={labelClass}>
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={formData.receiverName || ''}
                            onChange={(e) => onUpdate('receiverName', e.target.value)}
                            className={inputClass}
                            placeholder="Ex: Maria Oliveira Costa"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            CPF
                        </label>
                        <input
                            type="text"
                            value={formData.receiverCPF || ''}
                            onChange={(e) => onUpdate('receiverCPF', e.target.value)}
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
                            value={formData.receiverAddress || ''}
                            onChange={(e) => onUpdate('receiverAddress', e.target.value)}
                            className={inputClass}
                            rows={3}
                            placeholder="Ex: Av. Paulista, 1000, Sala 200, Bela Vista, São Paulo - SP, CEP 01310-100"
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
