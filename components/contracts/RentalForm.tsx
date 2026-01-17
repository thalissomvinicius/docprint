import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowLeft, FileDown } from 'lucide-react';
import { generateRentalPDF, RentalData } from '../../utils/pdfGenerator';

interface RentalFormProps {
    onBack: () => void;
}

export const RentalForm: React.FC<RentalFormProps> = ({ onBack }) => {
    const [formData, setFormData] = useState<RentalData>({});

    const handleChange = (field: keyof RentalData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = () => {
        generateRentalPDF(formData);
    };

    const inputClass = "w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const labelClass = "block text-sm font-medium text-neutral-700 mb-1";

    return (
        <div className="flex flex-col h-full bg-neutral-50">
            <div className="bg-white border-b border-neutral-200 px-4 py-4 shrink-0 sticky top-0 z-10">
                <button onClick={onBack} className="text-neutral-600 hover:text-neutral-900 mb-3 flex items-center gap-2">
                    <ArrowLeft size={20} /> Voltar
                </button>
                <h1 className="text-2xl font-bold text-neutral-900">Contrato de Aluguel</h1>
                <p className="text-neutral-600 mt-1 text-sm">Preencha os campos disponíveis (todos são opcionais)</p>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-2xl mx-auto space-y-8">

                    {/* Landlord */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Locador</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Nome Completo</label><input type="text" value={formData.landlordName || ''} onChange={(e) => handleChange('landlordName', e.target.value)} className={inputClass} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>CPF</label><input type="text" value={formData.landlordCPF || ''} onChange={(e) => handleChange('landlordCPF', e.target.value)} className={inputClass} placeholder="000.000.000-00" /></div>
                                <div><label className={labelClass}>RG</label><input type="text" value={formData.landlordRG || ''} onChange={(e) => handleChange('landlordRG', e.target.value)} className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Estado Civil</label><input type="text" value={formData.landlordMaritalStatus || ''} onChange={(e) => handleChange('landlordMaritalStatus', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Profissão</label><input type="text" value={formData.landlordProfession || ''} onChange={(e) => handleChange('landlordProfession', e.target.value)} className={inputClass} /></div>
                            </div>
                            <div><label className={labelClass}>Endereço</label><input type="text" value={formData.landlordAddress || ''} onChange={(e) => handleChange('landlordAddress', e.target.value)} className={inputClass} /></div>
                        </div>
                    </div>

                    {/* Tenant */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Locatário</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Nome Completo</label><input type="text" value={formData.tenantName || ''} onChange={(e) => handleChange('tenantName', e.target.value)} className={inputClass} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>CPF</label><input type="text" value={formData.tenantCPF || ''} onChange={(e) => handleChange('tenantCPF', e.target.value)} className={inputClass} placeholder="000.000.000-00" /></div>
                                <div><label className={labelClass}>RG</label><input type="text" value={formData.tenantRG || ''} onChange={(e) => handleChange('tenantRG', e.target.value)} className={inputClass} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Estado Civil</label><input type="text" value={formData.tenantMaritalStatus || ''} onChange={(e) => handleChange('tenantMaritalStatus', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Profissão</label><input type="text" value={formData.tenantProfession || ''} onChange={(e) => handleChange('tenantProfession', e.target.value)} className={inputClass} /></div>
                            </div>
                            <div><label className={labelClass}>Endereço</label><input type="text" value={formData.tenantAddress || ''} onChange={(e) => handleChange('tenantAddress', e.target.value)} className={inputClass} /></div>
                        </div>
                    </div>

                    {/* Property */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Imóvel</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>Endereço Completo</label><input type="text" value={formData.propertyAddress || ''} onChange={(e) => handleChange('propertyAddress', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Descrição</label><input type="text" value={formData.propertyDescription || ''} onChange={(e) => handleChange('propertyDescription', e.target.value)} className={inputClass} placeholder="Ex: Apartamento 2 quartos, 80m²" /></div>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Condições</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Valor do Aluguel (R$)</label><input type="text" value={formData.rentAmount || ''} onChange={(e) => handleChange('rentAmount', e.target.value)} className={inputClass} placeholder="1500,00" /></div>
                                <div><label className={labelClass}>Dia de Vencimento</label><input type="text" value={formData.dueDay || ''} onChange={(e) => handleChange('dueDay', e.target.value)} className={inputClass} placeholder="10" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Caução (R$)</label><input type="text" value={formData.depositAmount || ''} onChange={(e) => handleChange('depositAmount', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Prazo (meses)</label><input type="text" value={formData.contractDuration || ''} onChange={(e) => handleChange('contractDuration', e.target.value)} className={inputClass} placeholder="12" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Data de Início</label><input type="date" value={formData.startDate || ''} onChange={(e) => handleChange('startDate', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Índice de Reajuste</label><input type="text" value={formData.adjustmentIndex || ''} onChange={(e) => handleChange('adjustmentIndex', e.target.value)} className={inputClass} placeholder="IGPM" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Responsabilidades</h3>
                        <div className="space-y-4">
                            <div><label className={labelClass}>IPTU</label><input type="text" value={formData.iptuResponsible || ''} onChange={(e) => handleChange('iptuResponsible', e.target.value)} className={inputClass} placeholder="Locador ou Locatário" /></div>
                            <div><label className={labelClass}>Condomínio</label><input type="text" value={formData.condominiumResponsible || ''} onChange={(e) => handleChange('condominiumResponsible', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Água/Luz/Gás</label><input type="text" value={formData.utilitiesResponsible || ''} onChange={(e) => handleChange('utilitiesResponsible', e.target.value)} className={inputClass} /></div>
                        </div>
                    </div>

                    {/* Penalties */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Multas e Prazos</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelClass}>Multa por Rescisão (%)</label><input type="text" value={formData.terminationFine || ''} onChange={(e) => handleChange('terminationFine', e.target.value)} className={inputClass} placeholder="10" /></div>
                                <div><label className={labelClass}>Aviso Prévio (dias)</label><input type="text" value={formData.noticePeriod || ''} onChange={(e) => handleChange('noticePeriod', e.target.value)} className={inputClass} placeholder="30" /></div>
                            </div>
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
