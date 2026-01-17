import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, FileDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReceiptData, generateReceiptPDF } from '../utils/pdfGenerator';
import { StepIndicator } from './ReceiptWizard/StepIndicator';
import { Step1_BasicInfo } from './ReceiptWizard/Step1_BasicInfo';
import { Step2_PayerInfo } from './ReceiptWizard/Step2_PayerInfo';
import { Step3_ReceiverInfo } from './ReceiptWizard/Step3_ReceiverInfo';
import { Step4_Signature } from './ReceiptWizard/Step4_Signature';
import { Step5_Preview } from './ReceiptWizard/Step5_Preview';

interface ReceiptAppProps {
    onBack: () => void;
}

const STEPS = [
    { id: 1, title: 'Informações Básicas', description: 'Valor e detalhes' },
    { id: 2, title: 'Pagador', description: 'Quem paga' },
    { id: 3, title: 'Recebedor', description: 'Quem recebe' },
    { id: 4, title: 'Assinatura', description: 'Assinatura digital' },
    { id: 5, title: 'Revisar', description: 'Confirmar dados' },
];

export const ReceiptApp: React.FC<ReceiptAppProps> = ({ onBack }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ReceiptData>({});
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

    const handleUpdate = (field: keyof ReceiptData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSignatureChange = (dataUrl: string | null) => {
        console.log('[ReceiptApp] Signature changed, dataURL:', dataUrl ? `${dataUrl.substring(0, 50)}... (length: ${dataUrl.length})` : 'null');
        setSignatureDataUrl(dataUrl);
    };

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleEditStep = (step: number) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGenerate = () => {
        console.log('[ReceiptApp] Generating PDF with data:', {
            ...formData,
            signatureDataUrl: signatureDataUrl ? `${signatureDataUrl.substring(0, 50)}... (length: ${signatureDataUrl.length})` : 'null'
        });
        generateReceiptPDF({
            ...formData,
            signatureDataUrl,
        });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1_BasicInfo formData={formData} onUpdate={handleUpdate} />;
            case 2:
                return <Step2_PayerInfo formData={formData} onUpdate={handleUpdate} />;
            case 3:
                return <Step3_ReceiverInfo formData={formData} onUpdate={handleUpdate} />;
            case 4:
                return <Step4_Signature signatureDataUrl={signatureDataUrl} onSignatureChange={handleSignatureChange} />;
            case 5:
                return <Step5_Preview formData={formData} signatureDataUrl={signatureDataUrl} onEdit={handleEditStep} />;
            default:
                return null;
        }
    };

    const isLastStep = currentStep === STEPS.length;
    const isFirstStep = currentStep === 1;

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 via-white to-amber-50/50 relative overflow-hidden">
            {/* Decorative Background - Mobile Optimized */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-orange-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-amber-400/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header - Mobile Optimized */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white/80 backdrop-blur-xl shadow-lg shrink-0 sticky top-0 z-20"
                >
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-white/20">
                        {/* Back Button - Touch Optimized */}
                        <button
                            onClick={onBack}
                            className="text-neutral-600 hover:text-orange-600 mb-4 flex items-center gap-2 transition-colors px-2 py-2 -mx-2 rounded-xl hover:bg-white/80 active:scale-95"
                        >
                            <ArrowLeft size={22} />
                            <span className="font-medium text-sm md:text-base">Voltar</span>
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <Sparkles className="text-orange-600" size={24} />
                            </motion.div>
                            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                                Gerar Recibo Digital
                            </h1>
                        </div>
                        <p className="text-neutral-600 text-sm md:text-base">
                            {STEPS[currentStep - 1].description}
                        </p>
                    </div>

                    {/* Step Indicator - Mobile Optimized */}
                    <StepIndicator steps={STEPS} currentStep={currentStep} />
                </motion.div>

                {/* Content Area - Mobile Optimized Padding */}
                <div className="flex-1 overflow-y-auto">
                    <div className="py-6 md:py-8 px-4 md:px-6 pb-32">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation Footer - Touch Optimized */}
                <div className="shrink-0 bg-white/90 backdrop-blur-xl border-t border-white/20 shadow-2xl sticky bottom-0 z-20 safe-bottom">
                    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-5">
                        <div className="flex items-center justify-between gap-3 md:gap-4">
                            {/* Previous Button - Large Touch Target */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrevious}
                                disabled={isFirstStep}
                                className="min-w-[100px] md:min-w-[120px] px-5 md:px-6 py-4 md:py-3 rounded-2xl border-2 border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg active:shadow-sm"
                            >
                                <ChevronLeft size={24} />
                                <span className="hidden sm:inline text-sm md:text-base">Anterior</span>
                            </motion.button>

                            {/* Step Counter - Mobile Friendly */}
                            <div className="text-center px-2">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Etapa</p>
                                <p className="text-xl md:text-2xl font-bold text-orange-600">
                                    {currentStep}/{STEPS.length}
                                </p>
                            </div>

                            {/* Next/Generate Button - Large Touch Target */}
                            {isLastStep ? (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleGenerate}
                                    className="min-w-[120px] md:min-w-[140px] px-6 md:px-8 py-4 md:py-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl active:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <FileDown size={24} />
                                    <span className="text-sm md:text-base">Gerar PDF</span>
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleNext}
                                    className="min-w-[100px] md:min-w-[120px] px-5 md:px-6 py-4 md:py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold hover:from-orange-600 hover:to-amber-700 shadow-xl hover:shadow-2xl active:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="hidden sm:inline text-sm md:text-base">Próximo</span>
                                    <ChevronRight size={24} />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
