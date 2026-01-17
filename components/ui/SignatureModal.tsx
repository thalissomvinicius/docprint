import React, { useRef, useState, useEffect } from 'react';
import { X, Check, Eraser } from 'lucide-react';
import { Button } from './Button';

interface SignatureModalProps {
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set explicit resolution for sharpness
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000000'; // Blueish ink or Black
      ctx.lineWidth = 3;
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scroll
    setIsDrawing(true);
    setHasDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawing(false);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-white/30 flex items-center justify-between px-4 bg-white/50">
          <span className="font-semibold text-neutral-800">Assinar Documento</span>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-800">
            <X size={24} />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="relative bg-neutral-50 h-[300px] touch-none cursor-crosshair">
          {/* Guide Line */}
          <div className="absolute bottom-10 left-8 right-8 border-b border-neutral-300 pointer-events-none" />
          {!hasDrawing && (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-300 pointer-events-none select-none">
              Assine aqui
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/50 border-t border-white/30 flex gap-3 backdrop-blur-xl">
          <Button variant="secondary" onClick={handleClear} className="px-4" disabled={!hasDrawing}>
            <Eraser size={20} />
          </Button>
          <Button variant="primary" fullWidth onClick={handleSave} disabled={!hasDrawing}>
            <Check size={20} className="mr-2" />
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};