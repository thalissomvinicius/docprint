import React from 'react';
import { ReceiptData } from '../../utils/pdfGenerator';
import { FileText, Edit } from 'lucide-react';

interface Step5Props {
    formData: ReceiptData;
    signatureDataUrl: string | null;
    onEdit: (step: number) => void;
}

export const Step5_Preview: React.FC<Step5Props> = ({ formData, signatureDataUrl, onEdit }) => {
    const formatCurrency = (value?: string) => {
        if (!value) return 'Não informado';
        return `R$ ${value}`;
    };

    const formatDate = (date?: string) => {
        if (!date) return 'Não informada';
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const InfoRow = ({ label, value, onEditClick }: { label: string; value: string; onEditClick?: () => void }) => (
        <div className="flex items-start justify-between py-3 border-b border-neutral-100 last:border-0">
            <span className="text-sm font-medium text-neutral-600">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-900 text-right max-w-md">{value || 'Não informado'}</span>
                {onEditClick && (
                    <button
                        onClick={onEditClick}
                        className="p-1 hover:bg-neutral-100 rounded transition-colors"
                        title="Editar"
                    >
                        <Edit size={14} className="text-neutral-400 hover:text-orange-500" />
                    </button>
                )}
            </div>
        </div>
    );

    const Section = ({ title, children, onEditClick }: { title: string; children: React.ReactNode; onEditClick: () => void }) => (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
                <button
                    onClick={onEditClick}
                    className="px-3 py-1.5 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1.5"
                >
                    <Edit size={14} />
                    Editar
                </button>
            </div>
            <div className="space-y-0">
                {children}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <FileText size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">Prévia do Recibo</h2>
                        <p className="text-orange-100">Revise os dados antes de gerar o PDF</p>
                    </div>
                </div>
            </div>

            {/* Payment Amount Highlight */}
            {formData.amount && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 p-8 text-center">
                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">Valor do Recibo</p>
                    <p className="text-5xl font-bold text-green-900">{formatCurrency(formData.amount)}</p>
                </div>
            )}

            {/* Payment Details */}
            <Section title="Informações do Pagamento" onEditClick={() => onEdit(1)}>
                <InfoRow label="Valor" value={formatCurrency(formData.amount)} />
                <InfoRow label="Data" value={formatDate(formData.paymentDate)} />
                <InfoRow label="Forma de Pagamento" value={formData.paymentMethod || 'Não informada'} />
                <InfoRow label="Descrição" value={formData.description || 'Não informada'} />
            </Section>

            {/* Payer Info */}
            <Section title="Dados do Pagador" onEditClick={() => onEdit(2)}>
                <InfoRow label="Nome" value={formData.payerName || 'Não informado'} />
                <InfoRow label="CPF" value={formData.payerCPF || 'Não informado'} />
                <InfoRow label="Endereço" value={formData.payerAddress || 'Não informado'} />
            </Section>

            {/* Receiver Info */}
            <Section title="Dados do Recebedor" onEditClick={() => onEdit(3)}>
                <InfoRow label="Nome" value={formData.receiverName || 'Não informado'} />
                <InfoRow label="CPF" value={formData.receiverCPF || 'Não informado'} />
                <InfoRow label="Endereço" value={formData.receiverAddress || 'Não informado'} />
            </Section>

            {/* Signature Preview */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-neutral-900">Assinatura</h3>
                    <button
                        onClick={() => onEdit(4)}
                        className="px-3 py-1.5 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1.5"
                    >
                        <Edit size={14} />
                        Editar
                    </button>
                </div>
                {signatureDataUrl ? (
                    <div className="flex flex-col items-center gap-3 p-6 bg-neutral-50 rounded-xl">
                        <img src={signatureDataUrl} alt="Assinatura" className="max-w-md max-h-32 border border-neutral-200 bg-white p-2 rounded" />
                        <p className="text-sm text-green-600 font-medium">✓ Assinatura incluída</p>
                    </div>
                ) : (
                    <div className="p-6 bg-neutral-50 rounded-xl text-center">
                        <p className="text-neutral-500">Sem assinatura</p>
                    </div>
                )}
            </div>

            {/* Final Notes */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                    <span className="font-bold">ℹ️ Atenção:</span> Após gerar o PDF, você poderá salvá-lo ou imprimi-lo.
                    Verifique se todos os dados estão corretos antes de prosseguir.
                </p>
            </div>
        </div>
    );
};
