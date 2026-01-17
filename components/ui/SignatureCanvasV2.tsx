import React, { useRef, useEffect, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { RotateCcw, Trash2, Undo2, Pen } from 'lucide-react';

interface SignatureCanvasV2Props {
    onSignatureChange?: (dataUrl: string | null) => void;
}

export const SignatureCanvasV2: React.FC<SignatureCanvasV2Props> = ({ onSignatureChange }) => {
    const sigPadRef = useRef<SignaturePad>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [hasSignature, setHasSignature] = useState(false);
    const [penThickness, setPenThickness] = useState(2);
    const [penColor, setPenColor] = useState('#000000');

    // Handle resizing
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                console.log('[SignatureCanvasV2] Setting canvas width:', width);
                setCanvasWidth(width);
            }
        };

        // Initial update with a slight delay to ensure container is mounted
        setTimeout(updateDimensions, 100);
        updateDimensions();

        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Update pen settings when they change
    useEffect(() => {
        if (sigPadRef.current) {
            (sigPadRef.current as any).minWidth = penThickness * 0.5;
            (sigPadRef.current as any).maxWidth = penThickness * 1.5;
            (sigPadRef.current as any).penColor = penColor;
        }
    }, [penThickness, penColor]);

    const handleEnd = () => {
        if (sigPadRef.current) {
            if (sigPadRef.current.isEmpty()) {
                console.log('[SignatureCanvasV2] Canvas is empty');
                setHasSignature(false);
                onSignatureChange?.(null);
            } else {
                setHasSignature(true);
                // Using toDataURL() directly instead of getTrimmedCanvas() to avoid library bug
                const dataUrl = sigPadRef.current.toDataURL('image/png');
                console.log('[SignatureCanvasV2] Signature captured, dataURL length:', dataUrl.length);
                onSignatureChange?.(dataUrl);
            }
        }
    };

    const clearSignature = () => {
        if (sigPadRef.current) {
            sigPadRef.current.clear();
            setHasSignature(false);
            onSignatureChange?.(null);
        }
    };

    const undoSignature = () => {
        if (sigPadRef.current) {
            const data = sigPadRef.current.toData();
            if (data.length > 0) {
                data.pop();
                sigPadRef.current.fromData(data);
                handleEnd();
            }
        }
    };

    const thicknessOptions = [
        { value: 1.5, label: 'Fino', icon: '—' },
        { value: 2.5, label: 'Médio', icon: '━' },
        { value: 4, label: 'Grosso', icon: '━' },
    ];

    const colorOptions = [
        { value: '#000000', label: 'Preto' },
        { value: '#1e40af', label: 'Azul' },
        { value: '#7e22ce', label: 'Roxo' },
    ];

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                {/* Pen Thickness */}
                <div className="flex items-center gap-2">
                    <Pen size={16} className="text-neutral-600" />
                    <span className="text-sm font-semibold text-neutral-700">Espessura:</span>
                    {thicknessOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setPenThickness(option.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${penThickness === option.value
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 bg-neutral-300" />

                {/* Pen Color */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-700">Cor:</span>
                    {colorOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setPenColor(option.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${penColor === option.value
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={undoSignature}
                        disabled={!hasSignature}
                        className="px-4 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-all"
                        title="Desfazer último traço"
                    >
                        <Undo2 size={16} />
                        <span className="hidden sm:inline">Desfazer</span>
                    </button>
                    <button
                        onClick={clearSignature}
                        disabled={!hasSignature}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-all shadow-sm"
                        title="Limpar tudo"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Limpar</span>
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={containerRef}
                className="relative w-full h-96 border-2 border-dashed border-neutral-300 rounded-2xl bg-white overflow-hidden shadow-inner"
                style={{
                    backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            >
                <SignaturePad
                    ref={sigPadRef}
                    onEnd={handleEnd}
                    canvasProps={{
                        className: 'signature-canvas',
                        width: canvasWidth,
                        height: 384, // h-96 equivalent
                        style: { width: '100%', height: '100%' },
                    }}
                    {...({
                        minWidth: penThickness * 0.5,
                        maxWidth: penThickness * 1.5,
                        velocityFilterWeight: 0.7,
                        penColor: penColor,
                    } as any)}
                />

                {!hasSignature && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-3">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
                            <Pen size={32} className="text-neutral-400" />
                        </div>
                        <p className="text-neutral-400 font-medium">Desenhe sua assinatura aqui</p>
                        <p className="text-neutral-300 text-sm">Use mouse, caneta ou toque na tela</p>
                    </div>
                )}

                {/* Helper line */}
                <div className="absolute bottom-24 left-8 right-8 border-b-2 border-neutral-200 pointer-events-none" />
            </div>

            {/* Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                    <span className="font-bold">💡 Dica:</span> Assine devagar e com cuidado para melhor qualidade.
                    Use o botão "Desfazer" se errar um traço.
                </p>
            </div>
        </div>
    );
};
