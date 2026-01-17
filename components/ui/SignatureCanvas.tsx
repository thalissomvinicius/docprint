import React, { useRef, useEffect, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import { RotateCcw } from 'lucide-react';

interface SignatureCanvasProps {
    onSignatureChange?: (dataUrl: string | null) => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSignatureChange }) => {
    const sigPadRef = useRef<SignaturePad>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [hasSignature, setHasSignature] = useState(false);

    // Handle resizing
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setCanvasWidth(containerRef.current.offsetWidth);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Clear signature when width changes to avoid stretching (optional, but good for quality)
    useEffect(() => {
        if (sigPadRef.current && hasSignature) {
            // We could try to restore data, but for now let's just keep it simple.
            // Often resizing clears the canvas in these libraries anyway.
            // Let's just ensure the ref is updated.
        }
    }, [canvasWidth]);

    const handleEnd = () => {
        if (sigPadRef.current) {
            if (sigPadRef.current.isEmpty()) {
                setHasSignature(false);
                onSignatureChange?.(null);
            } else {
                setHasSignature(true);
                // Trim whitespace for better PDF fit
                onSignatureChange?.(sigPadRef.current.getTrimmedCanvas().toDataURL('image/png'));
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

    return (
        <div ref={containerRef} className="relative w-full h-64 border-2 border-dashed border-neutral-300 rounded-lg bg-white overflow-hidden">
            <SignaturePad
                ref={sigPadRef}
                onEnd={handleEnd}
                canvasProps={{
                    className: 'signature-canvas',
                    width: canvasWidth,
                    height: 256, // h-64 equivalent
                    style: { width: '100%', height: '100%' }
                }}
                minWidth={1}
                maxWidth={2.5}
                velocityFilterWeight={0.7}
            />

            {hasSignature && (
                <button
                    onClick={clearSignature}
                    className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-md hover:bg-neutral-50 active:scale-95 transition-all z-10"
                    aria-label="Limpar assinatura"
                >
                    <RotateCcw size={18} className="text-neutral-600" />
                </button>
            )}

            {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-neutral-400 text-sm">Desenhe sua assinatura aqui</p>
                </div>
            )}
        </div>
    );
};
