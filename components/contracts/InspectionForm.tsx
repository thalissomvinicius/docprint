import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowLeft, FileDown } from 'lucide-react';
import { generateInspectionPDF, InspectionData } from '../../utils/pdfGenerator';

interface InspectionFormProps {
    onBack: () => void;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({ onBack }) => {
    const [formData, setFormData] = useState<InspectionData>({
        inspectionPurpose: 'entrada'
    });

    const handleChange = (field: keyof InspectionData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerate = () => {
        generateInspectionPDF(formData);
    };

    return (
        <div className="flex flex-col h-full bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 px-4 py-4 shrink-0 sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="text-neutral-600 hover:text-neutral-900 mb-3 flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    Voltar
                </button>
                <h1 className="text-2xl font-bold text-neutral-900">Contrato de Vistoria</h1>
                <p className="text-neutral-600 mt-1 text-sm">Preencha os campos disponíveis (todos são opcionais)</p>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-2xl mx-auto space-y-8">

                    {/* Property Section */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Dados do Imóvel</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Endereço Completo</label>
                                <input
                                    type="text"
                                    value={formData.propertyAddress || ''}
                                    onChange={(e) => handleChange('propertyAddress', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Rua, número, complemento, bairro, cidade, CEP"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Tipo</label>
                                    <select
                                        value={formData.propertyType || ''}
                                        onChange={(e) => handleChange('propertyType', e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Casa">Casa</option>
                                        <option value="Apartamento">Apartamento</option>
                                        <option value="Comercial">Comercial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Metragem (m²)</label>
                                    <input
                                        type="text"
                                        value={formData.propertySize || ''}
                                        onChange={(e) => handleChange('propertySize', e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: 80"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Landlord Section */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Locador/Proprietário</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={formData.landlordName || ''}
                                    onChange={(e) => handleChange('landlordName', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">CPF</label>
                                    <input
                                        type="text"
                                        value={formData.landlordCPF || ''}
                                        onChange={(e) => handleChange('landlordCPF', e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">RG</label>
                                    <input
                                        type="text"
                                        value={formData.landlordRG || ''}
                                        onChange={(e) => handleChange('landlordRG', e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Endereço</label>
                                <input
                                    type="text"
                                    value={formData.landlordAddress || ''}
                                    onChange={(e) => handleChange('landlordAddress', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tenant Section */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Locatário</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={formData.tenantName || ''}
                                    onChange={(e) => handleChange('tenantName', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">CPF</label>
                                    <input
                                        type="text"
                                        value={formData.tenantCPF || ''}
                                        onChange={(e) => handleChange('tenantCPF', e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">RG</label>
                                    <input
                                        type="text"
                                        value={formData.tenantRG || ''}
                                        onChange={(e) => handleChange('tenantRG', e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Endereço</label>
                                <input
                                    type="text"
                                    value={formData.tenantAddress || ''}
                                    onChange={(e) => handleChange('tenantAddress', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inspection Details */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Dados da Vistoria</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Data</label>
                                    <input
                                        type="date"
                                        value={formData.inspectionDate || ''}
                                        onChange={(e) => handleChange('inspectionDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Finalidade</label>
                                    <select
                                        value={formData.inspectionPurpose || 'entrada'}
                                        onChange={(e) => handleChange('inspectionPurpose', e.target.value as 'entrada' | 'saída')}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="entrada">Entrada</option>
                                        <option value="saída">Saída</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Room Conditions */}
                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Estado de Conservação</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Sala</label>
                                <input
                                    type="text"
                                    value={formData.livingRoom || ''}
                                    onChange={(e) => handleChange('livingRoom', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Bom estado, paredes limpas"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Quartos</label>
                                <input
                                    type="text"
                                    value={formData.bedrooms || ''}
                                    onChange={(e) => handleChange('bedrooms', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Cozinha</label>
                                <input
                                    type="text"
                                    value={formData.kitchen || ''}
                                    onChange={(e) => handleChange('kitchen', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Banheiros</label>
                                <input
                                    type="text"
                                    value={formData.bathrooms || ''}
                                    onChange={(e) => handleChange('bathrooms', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Área de Serviço</label>
                                <input
                                    type="text"
                                    value={formData.serviceArea || ''}
                                    onChange={(e) => handleChange('serviceArea', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Observações Gerais</label>
                                <textarea
                                    value={formData.generalObservations || ''}
                                    onChange={(e) => handleChange('generalObservations', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={4}
                                    placeholder="Outras observações relevantes sobre o imóvel..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="sticky bottom-0 bg-neutral-50 pt-4 pb-6">
                        <Button
                            fullWidth
                            variant="primary"
                            onClick={handleGenerate}
                            className="h-14 text-lg shadow-xl"
                        >
                            <FileDown className="w-6 h-6 mr-3" />
                            Gerar PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
