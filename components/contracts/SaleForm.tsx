import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowLeft, FileDown } from 'lucide-react';
import { generateSalePDF, SaleData } from '../../utils/pdfGenerator';

interface SaleFormProps {
    onBack: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({ onBack }) => {
    const [formData, setFormData] = useState<SaleData>({
        debtsCleared: false,
        noEncumbrances: false
    });

    const handleChange = (field: keyof SaleData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = () => {
        generateSalePDF(formData);
    };

    const inputClass = "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const labelClass = "block text-sm font-medium text-neutral-700 mb-1";

    return (
        <div className="flex flex-col h-full bg-neutral-50">
            <div className="bg-white border-b border-neutral-200 px-4 py-4 shrink-0 sticky top-0 z-10">
                <button onClick={onBack} className="text-neutral-600 hover:text-neutral-900 mb-3 flex items-center gap-2">
                    <ArrowLeft size={20} /> Voltar
                </button>
                <h1 className="text-2xl font-bold text-neutral-900">Contrato de Compra e Venda</h1>
                <p className="text-neutral-600 mt-1 text-sm">Preencha os campos disponíveis (todos são opcionais)</p>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-2xl mx-auto space-y-8">

                    {/* Seller */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Vendedor</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Nome Completo</label><input type="text" value={formData.sellerName || ''} onChange={(e) => handleChange('sellerName', e.target.value)} className={inputClass} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>CPF</label><input type="text" value={formData.sellerCPF || ''} onChange={(e) => handleChange('sellerCPF', e.target.value)} className={inputClass} placeholder="000.000.000-00" /></div>
                                <div><label className={labelClass}>RG</label><input type="text" value={formData.sellerRG || ''} onChange={(e) => handleChange('sellerRG', e.target.value)} className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Estado Civil</label><input type="text" value={formData.sellerMaritalStatus || ''} onChange={(e) => handleChange('sellerMaritalStatus', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Regime de Bens</label><input type="text" value={formData.sellerMarriageRegime || ''} onChange={(e) => handleChange('sellerMarriageRegime', e.target.value)} className={inputClass} placeholder="Se casado" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Profissão</label><input type="text" value={formData.sellerProfession || ''} onChange={(e) => handleChange('sellerProfession', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Endereço</label><input type="text" value={formData.sellerAddress || ''} onChange={(e) => handleChange('sellerAddress', e.target.value)} className={inputClass} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Buyer */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Comprador</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Nome Completo</label><input type="text" value={formData.buyerName || ''} onChange={(e) => handleChange('buyerName', e.target.value)} className={inputClass} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>CPF</label><input type="text" value={formData.buyerCPF || ''} onChange={(e) => handleChange('buyerCPF', e.target.value)} className={inputClass} placeholder="000.000.000-00" /></div>
                                <div><label className={labelClass}>RG</label><input type="text" value={formData.buyerRG || ''} onChange={(e) => handleChange('buyerRG', e.target.value)} className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Estado Civil</label><input type="text" value={formData.buyerMaritalStatus || ''} onChange={(e) => handleChange('buyerMaritalStatus', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Regime de Bens</label><input type="text" value={formData.buyerMarriageRegime || ''} onChange={(e) => handleChange('buyerMarriageRegime', e.target.value)} className={inputClass} placeholder="Se casado" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Profissão</label><input type="text" value={formData.buyerProfession || ''} onChange={(e) => handleChange('buyerProfession', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Endereço</label><input type="text" value={formData.buyerAddress || ''} onChange={(e) => handleChange('buyerAddress', e.target.value)} className={inputClass} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Property */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Imóvel</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Endereço Completo</label><input type="text" value={formData.propertyAddress || ''} onChange={(e) => handleChange('propertyAddress', e.target.value)} className={inputClass} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Matrícula</label><input type="text" value={formData.propertyRegistration || ''} onChange={(e) => handleChange('propertyRegistration', e.target.value)} className={inputClass} placeholder="Nº e Cartório" /></div>
                                <div><label className={labelClass}>Metragem (m²)</label><input type="text" value={formData.propertySize || ''} onChange={(e) => handleChange('propertySize', e.target.value)} className={inputClass} /></div>
                            </div>
                            <div><label className={labelClass}>Descrição</label><input type="text" value={formData.propertyDescription || ''} onChange={(e) => handleChange('propertyDescription', e.target.value)} className={inputClass} placeholder="Ex: Casa térrea, 3 quartos" /></div>
                            <div><label className={labelClass}>Confrontações</label><textarea value={formData.propertyBoundaries || ''} onChange={(e) => handleChange('propertyBoundaries', e.target.value)} className={inputClass} rows={3} placeholder="Frente, fundos, laterais..." /></div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Condições de Pagamento</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Valor Total (R$)</label><input type="text" value={formData.totalAmount || ''} onChange={(e) => handleChange('totalAmount', e.target.value)} className={inputClass} placeholder="250000,00" /></div>
                            <div><label className={labelClass}>Forma de Pagamento</label><input type="text" value={formData.paymentMethod || ''} onChange={(e) => handleChange('paymentMethod', e.target.value)} className={inputClass} placeholder="À vista, Parcelado, Financiamento" /></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className={labelClass}>Entrada (R$)</label><input type="text" value={formData.downPayment || ''} onChange={(e) => handleChange('downPayment', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Parcelas</label><input type="text" value={formData.installments || ''} onChange={(e) => handleChange('installments', e.target.value)} className={inputClass} placeholder="12" /></div>
                                <div><label className={labelClass}>Valor Parcela (R$)</label><input type="text" value={formData.installmentAmount || ''} onChange={(e) => handleChange('installmentAmount', e.target.value)} className={inputClass} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Declarations */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Declarações</h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={formData.debtsCleared || false} onChange={(e) => handleChange('debtsCleared', e.target.checked)} className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-neutral-700">Imóvel livre de débitos (IPTU, condomínio, água, luz)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={formData.noEncumbrances || false} onChange={(e) => handleChange('noEncumbrances', e.target.checked)} className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-neutral-700">Imóvel livre de ônus e gravames</span>
                            </label>
                        </div>
                    </div>

                    {/* Witnesses */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Testemunhas</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Testemunha 1 - Nome</label><input type="text" value={formData.witness1Name || ''} onChange={(e) => handleChange('witness1Name', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Testemunha 1 - CPF</label><input type="text" value={formData.witness1CPF || ''} onChange={(e) => handleChange('witness1CPF', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Testemunha 2 - Nome</label><input type="text" value={formData.witness2Name || ''} onChange={(e) => handleChange('witness2Name', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Testemunha 2 - CPF</label><input type="text" value={formData.witness2CPF || ''} onChange={(e) => handleChange('witness2CPF', e.target.value)} className={inputClass} /></div>
                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-neutral-50 pt-4 pb-6">
                        <Button fullWidth variant="primary" onClick={handleGenerate} className="h-14 text-lg shadow-xl">
                            <FileDown className="w-6 h-6 mr-3" />
                            Gerar PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
