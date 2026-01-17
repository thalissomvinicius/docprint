import React from 'react';
import { SignatureCanvasV2 } from '../ui/SignatureCanvasV2';
import { PenTool } from 'lucide-react';

interface Step4Props {
    signatureDataUrl: string | null;
    onSignatureChange: (dataUrl: string | null) => void;
}

export const Step4_Signature: React.FC<Step4Props> = ({ signatureDataUrl, onSignatureChange }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-2xl border-2 border-neutral-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <PenTool size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-neutral-900">Assinatura Digital</h3>
                        <p className="text-sm text-neutral-600">Assine digitalmente o recibo</p>
                    </div>
                </div>

                <SignatureCanvasV2 onSignatureChange={onSignatureChange} />
            </div>

            {signatureDataUrl && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-in fade-in duration-200">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-green-800">Assinatura capturada!</p>
                            <p className="text-sm text-green-700 mt-1">
                                Sua assinatura foi salva com sucesso e será incluída no recibo.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!signatureDataUrl && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                    <p className="text-sm text-amber-800">
                        <span className="font-bold">📝 Opcional:</span> A assinatura é opcional.
                        Você pode pular esta etapa e gerar o recibo sem assinatura.
                    </p>
                </div>
            )}
        </div>
    );
};
