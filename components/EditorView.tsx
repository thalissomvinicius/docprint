import React, { useState, useEffect, useRef } from 'react';
import { DocImage } from '../types';
import { PerspectiveCrop } from './ui/PerspectiveCrop';
import { Magnifier } from './ui/Magnifier';
import { SkeletonCard } from './ui/SkeletonCard';
import {
  Check, X, RotateCw, Crop as CropIcon, Sliders,
  Wand2, Loader2, Undo2, Redo2, ScanLine
} from 'lucide-react';
import { applyFiltersAndRender, applyPerspectiveWarp } from '../utils/imageProcessing';
import { detectDocumentCorners } from '../utils/edgeDetection';
import { useToast } from '../contexts/ToastContext';
import { generateUUID } from '../utils/uuid';

interface EditorViewProps {
  file: File;
  onCancel: () => void;
  onComplete: (processedImage: DocImage) => void;
}

type Tab = 'CROP' | 'TUNE';

export const EditorView: React.FC<EditorViewProps> = ({ file, onCancel, onComplete }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('CROP');
  const toast = useToast();




  // 4-Point Crop State
  const [cropCorners, setCropCorners] = useState<{
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  } | null>(null);



  // Edit State
  const [rotation, setRotation] = useState(0);
  const [filters, setFilters] = useState({
    brightness: 0, contrast: 0, grayscale: 0, threshold: 0, autoEnhance: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Preview source with filters applied
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // History State
  const [history, setHistory] = useState<Array<{
    src: string | null;
    rotation: number;
    filters: typeof filters;
  }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize history
  useEffect(() => {
    if (src && history.length === 0) {
      const initialState = { src, rotation, filters };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, [src]);

  const pushToHistory = (newSrc: string | null, newRotation: number, newFilters: typeof filters) => {
    const currentState = { src: newSrc, rotation: newRotation, filters: newFilters };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    if (newHistory.length > 20) newHistory.shift(); // Limit history
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setSrc(prevState.src);
      setRotation(prevState.rotation);
      setFilters(prevState.filters);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setSrc(nextState.src);
      setRotation(nextState.rotation);
      setFilters(nextState.filters);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleAutoDetect = async () => {
    if (!src) return;
    console.log('[AutoDetect] Starting...');
    setIsProcessing(true);
    try {
      console.log('[AutoDetect] Detecting corners...');
      const corners = await detectDocumentCorners(src);
      console.log('[AutoDetect] Corners detected: ' + JSON.stringify(corners));

      if (corners) {
        // corners is Point[] in order: [TL, TR, BR, BL]
        // Convert absolute pixel corners to relative (0-1) coordinates
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });

        const relativeCorners = {
          topLeft: { x: corners[0].x / img.width, y: corners[0].y / img.height },
          topRight: { x: corners[1].x / img.width, y: corners[1].y / img.height },
          bottomRight: { x: corners[2].x / img.width, y: corners[2].y / img.height },
          bottomLeft: { x: corners[3].x / img.width, y: corners[3].y / img.height }
        };

        setCropCorners(relativeCorners);
        toast.success("Bordas detectadas! Ajuste os pontos se necessário.");
        console.log('[AutoDetect] Success!');
      } else {
        console.log('[AutoDetect] No corners detected');
        toast.warning("Não foi possível detectar bordas automaticamente.");
      }
    } catch (e: any) {
      console.error('[AutoDetect] Error: ' + e.message);
      toast.error("Erro na detecção automática.");
    } finally {
      console.log('[AutoDetect] Finished, stopping loading');
      setIsProcessing(false);
    }
  };




  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener('load', () => setSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(file);
  }, [file]);

  // Update preview when filters change
  useEffect(() => {
    if (!src) return;

    const updatePreview = async () => {
      setPreviewLoading(true);
      try {
        const docImage: DocImage = {
          id: 'preview',
          src: src,
          width: 0,
          height: 0,
          rotation: 0,
          filters: filters,
          crop: undefined,
        };
        const preview = await applyFiltersAndRender(docImage, 1600); // Higher res preview
        setPreviewSrc(preview);
      } catch (e) {
        console.error('[Preview] Error:', e);
        setPreviewSrc(src); // Fallback to original
      } finally {
        setPreviewLoading(false);
      }
    };

    // Debounce preview updates
    const timeoutId = setTimeout(updatePreview, 100);
    return () => clearTimeout(timeoutId);
  }, [src, filters]);



  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    pushToHistory(src, newRotation, filters);
  };

  // --- PRESETS ---
  const applyPreset = (type: 'ORIGINAL' | 'MAGIC' | 'BW' | 'GRAY') => {
    let newFilters = { ...filters };
    switch (type) {
      case 'ORIGINAL': newFilters = { brightness: 0, contrast: 0, grayscale: 0, threshold: 0, autoEnhance: false }; break;
      case 'MAGIC': newFilters = { brightness: 20, contrast: 30, grayscale: 0, threshold: 0, autoEnhance: true }; break;
      case 'BW': newFilters = { brightness: 0, contrast: 15, grayscale: 100, threshold: 135, autoEnhance: false }; break;
      case 'GRAY': newFilters = { brightness: 0, contrast: 5, grayscale: 100, threshold: 0, autoEnhance: false }; break;
    }
    setFilters(newFilters);
    pushToHistory(src, rotation, newFilters);
  };

  const handleSave = async () => {
    console.log('[HandleSave] Button clicked! src: ' + !!src + ', isProcessing: ' + isProcessing);

    if (!src) {
      console.log('[HandleSave] Aborted - missing src');
      return;
    }

    console.log('[HandleSave] Starting...');
    setIsProcessing(true);

    try {
      let processedSrc = src;

      // Apply polygonal crop if 4-point corners are defined
      if (cropCorners) {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });

        const absoluteCorners = [
          { x: cropCorners.topLeft.x * img.width, y: cropCorners.topLeft.y * img.height },
          { x: cropCorners.topRight.x * img.width, y: cropCorners.topRight.y * img.height },
          { x: cropCorners.bottomRight.x * img.width, y: cropCorners.bottomRight.y * img.height },
          { x: cropCorners.bottomLeft.x * img.width, y: cropCorners.bottomLeft.y * img.height }
        ];

        processedSrc = await applyPerspectiveWarp(src, absoluteCorners);
      }

      const docImage: DocImage = {
        id: generateUUID(),
        src: processedSrc,
        width: 0,
        height: 0,
        rotation: rotation,
        filters: filters,
        crop: undefined,
      };

      console.log('[HandleSave] Applying filters and rendering...');
      const bakedSrc = await applyFiltersAndRender(docImage, 4096); // High res final

      const tempImg = new Image();
      tempImg.src = bakedSrc;
      await new Promise((resolve, reject) => {
        tempImg.onload = resolve;
        tempImg.onerror = reject;
        setTimeout(() => reject(new Error('Image load timeout')), 10000);
      });

      // bakedSrc is already cropped by applyFiltersAndRender if standardCrop was present
      const finalSrc = bakedSrc;
      const finalWidth = tempImg.width;
      const finalHeight = tempImg.height;

      // No need to crop again here. applyFiltersAndRender handles it.

      console.log('[HandleSave] Image loaded, calling onComplete...');
      console.log('[HandleSave] Final image dimensions:', finalWidth, 'x', finalHeight);

      onComplete({
        id: generateUUID(),
        src: finalSrc,
        width: finalWidth,
        height: finalHeight,
        rotation: 0, // Already applied
        filters: { brightness: 0, contrast: 0, grayscale: 0, threshold: 0, autoEnhance: false }, // Already applied
        crop: undefined, // Already applied
      });

      console.log('[HandleSave] Success!');
    } catch (e: any) {
      console.error('[HandleSave] Error: ' + e.message);
      toast.error('Erro ao processar imagem. Tente novamente.');
    } finally {
      console.log('[HandleSave] Finished, stopping loading');
      setIsProcessing(false);
    }
  };

  if (!src) return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <SkeletonCard variant="default" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-neutral-100">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between bg-white border-b border-neutral-200 shrink-0 sticky top-0 z-50 shadow-sm">

        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Cancelar edição"
        >
          <X size={24} />
        </button>
        <span className="font-semibold text-lg text-neutral-800">Editar</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0 || isProcessing}
            className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 active:scale-95 transition-all disabled:opacity-30"
            aria-label="Desfazer"
          >
            <Undo2 size={20} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1 || isProcessing}
            className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 active:scale-95 transition-all disabled:opacity-30"
            aria-label="Refazer"
          >
            <Redo2 size={20} />
          </button>
          <button
            type="button"
            onClick={handleSave}
            onTouchStart={handleSave}
            disabled={isProcessing}
            className="w-10 h-10 flex items-center justify-center rounded-full text-brand hover:bg-brand/10 active:scale-95 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
            aria-label="Salvar edição"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <Check size={28} />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-neutral-900/5 p-4 touch-none">



        <div className="relative shadow-2xl transition-all duration-300 touch-none" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="relative">
            {/* 4-POINT CROP */}
            {activeTab === 'CROP' ? (
              <div className="relative">
                <PerspectiveCrop
                  imageSrc={src}
                  initialCorners={cropCorners}
                  onCornersChange={setCropCorners}
                  className="max-h-[70vh]"
                />
                {cropCorners && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                    <button
                      onClick={handleAutoDetect}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-white rounded-lg shadow-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <ScanLine size={16} className="inline mr-2" />
                      Auto-detectar
                    </button>
                  </div>
                )}
              </div>
            ) : activeTab === 'TUNE' ? (
              <Magnifier
                imageSrc={previewSrc || src}
                magnification={2.5}
                size={140}
              />
            ) : (
              <img
                src={src}
                className="max-h-[70vh] max-w-full object-contain block pointer-events-none select-none"
                draggable={false}
              />
            )}

            {/* Tune Tab Hints */}
            {activeTab === 'TUNE' && filters.autoEnhance && (
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-blue-500/10" />
            )}
            {activeTab === 'TUNE' && previewLoading && (
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" />
                Aplicando...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tools Panel */}
      <div className="bg-white border-t border-neutral-200 shrink-0 pb-safe z-30">
        {activeTab === 'TUNE' && (
          <div className="px-4 py-6 animate-in slide-in-from-bottom-4 fade-in bg-white border-b border-neutral-100">
            <div className="space-y-2">
              <button
                onClick={() => applyPreset('MAGIC')}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base font-semibold flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/30"
              >
                <Wand2 size={20} />
                <span>✨ Mágica (Recomendado)</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => applyPreset('ORIGINAL')}
                  className="px-4 py-3 rounded-lg bg-neutral-100 text-neutral-700 text-sm font-medium active:scale-95 transition-transform"
                >
                  Original
                </button>
                <button
                  onClick={() => applyPreset('BW')}
                  className="px-4 py-3 rounded-lg bg-neutral-800 text-white text-sm font-medium active:scale-95 transition-transform"
                >
                  P&B
                </button>
                <button
                  onClick={() => applyPreset('GRAY')}
                  className="px-4 py-3 rounded-lg bg-neutral-300 text-neutral-800 text-sm font-medium active:scale-95 transition-transform"
                >
                  Cinza
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-stretch justify-around px-2 py-2 h-20">
          <button
            onClick={() => setActiveTab('CROP')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all active:scale-95 ${activeTab === 'CROP' ? 'text-brand bg-brand/5' : 'text-neutral-400'}`}
            aria-label="Recortar imagem"
            aria-pressed={activeTab === 'CROP'}
          >
            <CropIcon size={28} strokeWidth={activeTab === 'CROP' ? 2.5 : 2} />
            <span className="text-xs font-medium">Recorte</span>
          </button>

          <button
            onClick={handleRotate}
            className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl text-neutral-400 active:scale-95 active:bg-neutral-50 transition-all"
            aria-label="Girar imagem 90 graus"
          >
            <RotateCw size={28} />
            <span className="text-xs font-medium">Girar</span>
          </button>

          <button
            onClick={() => setActiveTab('TUNE')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition-all active:scale-95 ${activeTab === 'TUNE' ? 'text-brand bg-brand/5' : 'text-neutral-400'}`}
            aria-label="Ajustar filtros"
            aria-pressed={activeTab === 'TUNE'}
          >
            <Sliders size={28} strokeWidth={activeTab === 'TUNE' ? 2.5 : 2} />
            <span className="text-xs font-medium">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  );
};