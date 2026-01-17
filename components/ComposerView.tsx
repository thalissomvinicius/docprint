import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DocImage, ComposedItem } from '../types';
import { A4_WIDTH_PX, A4_HEIGHT_PX } from '../constants';
import { Button } from './ui/Button';
import { ArrowLeft, Printer, Plus, Trash2, RotateCw, RotateCcw, Copy, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useToast } from '../contexts/ToastContext';
import { generateUUID } from '../utils/uuid';

interface ComposerViewProps {
    images: DocImage[];
    onAddMore: () => void;
    onBack: () => void;
    onRemoveImage: (imageId: string) => void; // Sync deletion with parent
}

type InteractionType = 'DRAG' | 'RESIZE-TL' | 'RESIZE-TR' | 'RESIZE-BL' | 'RESIZE-BR' | 'ROTATE' | null;

interface InteractionState {
    type: InteractionType;
    itemId: string;
    startX: number; // Mouse X on screen
    startY: number; // Mouse Y on screen
    centerRx: number;
    centerRy: number;
    startAngle: number;
    initial: {
        x: number;
        y: number;
        w: number;
        h: number;
        r: number;
    };
}

export const ComposerView: React.FC<ComposerViewProps> = ({ images, onAddMore, onBack, onRemoveImage }) => {
    const [items, setItems] = useState<ComposedItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const a4Ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.2);
    const [isExporting, setIsExporting] = useState(false);
    const toast = useToast();

    const [snapLines, setSnapLines] = useState<{ x: boolean; y: boolean }>({ x: false, y: false });
    const [interaction, setInteraction] = useState<InteractionState | null>(null);

    // Initial Placement - Sync props with local state
    useEffect(() => {
        // Build a map of current items by imageId for efficient lookup
        const currentItemsByImageId = new Map(items.map(item => [item.imageId, item]));

        // Filter out items whose images no longer exist
        const validItems = items.filter(item => images.find(img => img.id === item.imageId));

        // Find new images that don't have items yet
        const newItems: ComposedItem[] = [];

        images.forEach((img, index) => {
            // Only add if not already present
            if (!currentItemsByImageId.has(img.id)) {
                // Default size: constraint to roughly 40% of page width
                const targetWidth = A4_WIDTH_PX * 0.4;
                const ratio = img.width / img.height;
                const targetHeight = targetWidth / ratio;

                const startY = 150 + (validItems.length + newItems.length) * 400;

                newItems.push({
                    id: generateUUID(),
                    imageId: img.id,
                    x: (A4_WIDTH_PX - targetWidth) / 2,
                    y: startY > A4_HEIGHT_PX - targetHeight ? 100 : startY,
                    width: targetWidth,
                    height: targetHeight,
                    rotation: 0,
                    zIndex: validItems.length + newItems.length + 1
                });
            }
        });

        // Only update if there are changes
        if (validItems.length !== items.length || newItems.length > 0) {
            setItems([...validItems, ...newItems]);
        }
    }, [images]); // Only depend on images prop, not items

    // Handle Screen Resize
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const screenWidth = containerRef.current.clientWidth;
                const screenHeight = containerRef.current.clientHeight;

                // Margins
                const margin = 40;

                // Scale to fit Width
                const scaleW = (screenWidth - margin) / A4_WIDTH_PX;

                // Scale to fit Height
                const scaleH = (screenHeight - margin) / A4_HEIGHT_PX;

                const isMobile = screenWidth < 768;

                if (isMobile) {
                    // On mobile, show 85% of width to ensure margins are visible (perspective)
                    // but still readable.
                    setScale(Math.min(scaleW * 0.85, 1.0));
                } else {
                    // On desktop, try to fit the whole page vertically if possible, or width
                    setScale(Math.min(scaleH, scaleW, 1.0) * 0.9);
                }
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // Delete function with useCallback for stable reference
    const deleteSelected = useCallback(() => {
        if (selectedId) {
            const itemToDelete = items.find(i => i.id === selectedId);
            if (itemToDelete) {
                // IMPORTANT: Notify parent to remove the source image, so it doesn't come back
                onRemoveImage(itemToDelete.imageId);
            }
            setItems(prev => prev.filter(i => i.id !== selectedId));
            setSelectedId(null);
        }
    }, [selectedId, items, onRemoveImage]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedId) {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault(); // Prevent browser back navigation
                    deleteSelected();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, deleteSelected]); // Include deleteSelected in dependencies

    // --- Interaction Logic ---
    const handlePointerDown = (
        e: React.PointerEvent,
        id: string,
        type: InteractionType
    ) => {
        e.preventDefault();
        e.stopPropagation();
        const item = items.find(i => i.id === id);
        if (!item) return;

        setSelectedId(id);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        let centerRx = 0;
        let centerRy = 0;
        let startAngle = 0;

        if (a4Ref.current) {
            const a4Rect = a4Ref.current.getBoundingClientRect();
            const itemCx = item.x + item.width / 2;
            const itemCy = item.y + item.height / 2;
            centerRx = a4Rect.left + (itemCx * scale);
            centerRy = a4Rect.top + (itemCy * scale);
            startAngle = Math.atan2(e.clientY - centerRy, e.clientX - centerRx);
        }

        setInteraction({
            type,
            itemId: id,
            startX: e.clientX,
            startY: e.clientY,
            centerRx,
            centerRy,
            startAngle,
            initial: {
                x: item.x,
                y: item.y,
                w: item.width,
                h: item.height,
                r: item.rotation
            }
        });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!interaction) return;
        e.preventDefault();

        const { type, initial, startX, startY, itemId, centerRx, centerRy, startAngle } = interaction;
        const rawDx = e.clientX - startX;
        const rawDy = e.clientY - startY;

        // Scale correction
        const dx = rawDx / scale;
        const dy = rawDy / scale;

        setItems(prev => prev.map(item => {
            if (item.id !== itemId) return item;

            let newItem = { ...item };
            let showGuideX = false;
            let showGuideY = false;

            if (type === 'DRAG') {
                let nextX = initial.x + dx;
                let nextY = initial.y + dy;
                const SNAP_TOLERANCE = 20;
                const itemCenterX = nextX + item.width / 2;
                const itemCenterY = nextY + item.height / 2;
                const pageCenterX = A4_WIDTH_PX / 2;
                const pageCenterY = A4_HEIGHT_PX / 2;

                if (Math.abs(itemCenterX - pageCenterX) < SNAP_TOLERANCE) {
                    nextX = pageCenterX - item.width / 2;
                    showGuideX = true;
                }
                if (Math.abs(itemCenterY - pageCenterY) < SNAP_TOLERANCE) {
                    nextY = pageCenterY - item.height / 2;
                    showGuideY = true;
                }

                newItem.x = nextX;
                newItem.y = nextY;
                setSnapLines({ x: showGuideX, y: showGuideY });
            }
            else if (type === 'ROTATE') {
                setSnapLines({ x: false, y: false });
                const currentAngle = Math.atan2(e.clientY - centerRy, e.clientX - centerRx);
                const deltaRad = currentAngle - startAngle;
                const deltaDeg = deltaRad * (180 / Math.PI);
                let r = initial.r + deltaDeg;
                const remainder = r % 90;
                if (Math.abs(remainder) < 5) r = r - remainder;
                else if (Math.abs(remainder) > 85) r = r + (90 - remainder);
                newItem.rotation = r;
            }
            else if (type?.startsWith('RESIZE')) {
                setSnapLines({ x: false, y: false });

                // 1. Convert Screen Delta to Local (Item) Delta
                // We rotate the delta vector by NEGATIVE rotation to align with item axes
                const rad = (initial.r * Math.PI) / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);

                // localDx/Dy represents how much we moved along the item's Width/Height axis
                const localDx = dx * cos + dy * sin;
                const localDy = dy * cos - dx * sin;

                let newW = initial.w;
                let newH = initial.h;
                const ratio = initial.w / initial.h; // Aspect Ratio Lock

                // 2. Calculate New Size based on Handle
                if (type === 'RESIZE-BR') {
                    newW = initial.w + localDx;
                    newH = newW / ratio;
                }
                else if (type === 'RESIZE-TL') {
                    newW = initial.w - localDx;
                    newH = newW / ratio;
                }
                else if (type === 'RESIZE-TR') {
                    newW = initial.w + localDx;
                    newH = newW / ratio;
                }
                else if (type === 'RESIZE-BL') {
                    newW = initial.w - localDx;
                    newH = newW / ratio;
                }

                // Min size
                newW = Math.max(50, newW);
                newH = newW / ratio;

                // 3. Compensate Position (Pin Opposite Corner)
                // When scaling around center (transform-origin: center), edges move symmetrically.
                // We need to shift the center (x,y) to make it look like we are pinning the opposite corner.
                const deltaW = newW - initial.w;
                const deltaH = newH - initial.h;

                let localShiftX = 0;
                let localShiftY = 0;

                if (type === 'RESIZE-BR') {
                    localShiftX = deltaW / 2;
                    localShiftY = deltaH / 2;
                }
                else if (type === 'RESIZE-TL') {
                    localShiftX = -deltaW / 2;
                    localShiftY = -deltaH / 2;
                }
                else if (type === 'RESIZE-TR') {
                    localShiftX = deltaW / 2;
                    localShiftY = -deltaH / 2;
                }
                else if (type === 'RESIZE-BL') {
                    localShiftX = -deltaW / 2;
                    localShiftY = deltaH / 2;
                }

                // Rotate the local shift back to global space
                const globalShiftX = localShiftX * cos - localShiftY * sin;
                const globalShiftY = localShiftX * sin + localShiftY * cos;

                newItem.width = newW;
                newItem.height = newH;
                newItem.x = initial.x + globalShiftX;
                newItem.y = initial.y + globalShiftY;
            }
            return newItem;
        }));
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setInteraction(null);
        setSnapLines({ x: false, y: false });
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    const duplicateSelected = () => {
        if (selectedId) {
            const original = items.find(i => i.id === selectedId);
            if (original) {
                const newItem = {
                    ...original,
                    id: crypto.randomUUID(),
                    x: original.x + 100,
                    y: original.y + 100,
                    zIndex: Math.max(...items.map(i => i.zIndex)) + 1
                };
                setItems(prev => [...prev, newItem]);
                setSelectedId(newItem.id);
            }
        }
    };

    const rotateSelected = (deg: number) => {
        if (selectedId) {
            setItems(prev => prev.map(i => {
                if (i.id === selectedId) {
                    // Normalize rotation to 0-359 range
                    const newRotation = (i.rotation + deg) % 360;
                    return { ...i, rotation: newRotation < 0 ? newRotation + 360 : newRotation };
                }
                return i;
            }));
        }
    };

    const handleExportPDF = async () => {
        if (isExporting) return;
        setIsExporting(true);

        try {
            // 1. Create a high-res canvas (A4 @ 300DPI)
            const canvas = document.createElement('canvas');
            canvas.width = A4_WIDTH_PX;
            canvas.height = A4_HEIGHT_PX;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not create canvas context");

            // 2. White Background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 3. Sort items by Z-Index
            const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex);

            // 4. Draw items exactly as they appear in CSS
            for (const item of sortedItems) {
                const docImg = images.find(img => img.id === item.imageId);
                if (!docImg) continue;

                // Load image
                const img = new Image();
                img.crossOrigin = "anonymous"; // Important for CORS if using external URLs
                img.src = docImg.src;
                await new Promise((resolve) => {
                    if (img.complete) resolve(true);
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                });

                ctx.save();

                // Calculate Pivot (Center of the image rect)
                const cx = item.x + item.width / 2;
                const cy = item.y + item.height / 2;

                // Move context to pivot
                ctx.translate(cx, cy);

                // Rotate (CSS rotation is degrees clockwise, Canvas is radians clockwise)
                ctx.rotate((item.rotation * Math.PI) / 180);

                // Draw Image centered at (0,0) relative to pivot
                ctx.drawImage(img, -item.width / 2, -item.height / 2, item.width, item.height);

                ctx.restore();
            }

            // 5. Generate PDF from the single composited image
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageData = canvas.toDataURL('image/jpeg', 0.95); // High quality JPEG
            pdf.addImage(pageData, 'JPEG', 0, 0, 210, 297);

            window.open(pdf.output('bloburl'), '_blank');
            toast.success('PDF gerado com sucesso!');
        } catch (e) {
            console.error("Export Error:", e);
            toast.error("Ocorreu um erro ao gerar o PDF. Tente novamente.");
        } finally {
            setIsExporting(false);
        }
    };

    // Inverse scale for handles so they remain constant size on screen
    const inverseScale = scale > 0 ? 1 / scale : 1;
    const handleStyle = { transform: `scale(${inverseScale})` };
    const rotateHandleStyle = {
        transform: `translateX(-50%) scale(${inverseScale})`,
        transformOrigin: 'bottom center'
    };

    return (
        <div className="flex flex-col h-full bg-neutral-100 select-none">
            {/* Header */}
            <div className="h-14 bg-white border-b border-neutral-200 px-4 flex items-center justify-between shrink-0 shadow-sm z-30">
                <button onClick={onBack} className="p-2 text-neutral-600 hover:text-neutral-900" aria-label="Voltar">
                    <ArrowLeft size={24} />
                </button>
                <span className="font-semibold text-neutral-800">Montar A4</span>
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-full hover:bg-brand-light shadow-md shadow-brand/20 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Exportar como PDF"
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Gerando...</span>
                        </>
                    ) : (
                        <>
                            <Printer size={18} />
                            <span>Imprimir / PDF</span>
                        </>
                    )}
                </button>
            </div>

            {/* Canvas Area - Scrollable */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto relative bg-neutral-100 p-4 sm:p-8 flex justify-center items-start"
            >
                <div className="relative my-4" style={{ width: A4_WIDTH_PX * scale, height: A4_HEIGHT_PX * scale }}>
                    <div
                        ref={a4Ref}
                        className="bg-white shadow-xl absolute origin-top-left overflow-hidden"
                        style={{ width: A4_WIDTH_PX, height: A4_HEIGHT_PX, transform: `scale(${scale})` }}
                        onPointerDown={() => setSelectedId(null)}
                    >
                        {/* Visual Guides */}
                        <div className="absolute inset-[59px] border border-dashed border-red-300 pointer-events-none opacity-50 z-0">
                            <span className="absolute top-2 left-2 text-red-300 text-[40px] font-mono opacity-50">Área Segura</span>
                        </div>
                        {snapLines.x && <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-brand/70 z-10 -translate-x-1/2 shadow-[0_0_4px_rgba(0,93,242,0.5)]" />}
                        {snapLines.y && <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-brand/70 z-10 -translate-y-1/2 shadow-[0_0_4px_rgba(0,93,242,0.5)]" />}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        {items.map(item => {
                            const imgSource = images.find(i => i.id === item.imageId)?.src;
                            const isSelected = selectedId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    className={`absolute touch-none select-none`}
                                    style={{
                                        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`,
                                        width: item.width,
                                        height: item.height,
                                        zIndex: isSelected ? 100 : item.zIndex,
                                        transformOrigin: 'center center',
                                        touchAction: 'none'
                                    }}
                                    onPointerDown={(e) => handlePointerDown(e, item.id, 'DRAG')}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                >
                                    <img
                                        src={imgSource}
                                        className="w-full h-full object-fill pointer-events-none select-none block"
                                        draggable={false}
                                    />
                                    {isSelected && (
                                        <>
                                            <div className="absolute inset-0 border-[3px] border-brand pointer-events-none" />

                                            {/* ROTATION HANDLE - Counter Scaled for Mobile Visibility */}
                                            <div
                                                className="absolute -top-20 left-1/2 flex flex-col items-center z-50 cursor-grab active:cursor-grabbing touch-none w-12 h-20 justify-end pb-0"
                                                style={rotateHandleStyle}
                                                onPointerDown={(e) => handlePointerDown(e, item.id, 'ROTATE')}
                                            >
                                                <div className="w-8 h-8 bg-white text-brand border border-brand/30 rounded-full shadow-lg flex items-center justify-center mb-1">
                                                    <RotateCw size={16} strokeWidth={2.5} />
                                                </div>
                                                <div className="w-px h-full bg-brand/50" />
                                            </div>

                                            {/* CORNER HANDLES - Counter Scaled */}

                                            {/* Top-Left */}
                                            <div
                                                className="absolute -top-6 -left-6 w-12 h-12 flex items-center justify-center z-50 cursor-nwse-resize touch-none"
                                                style={handleStyle}
                                                onPointerDown={(e) => handlePointerDown(e, item.id, 'RESIZE-TL')}
                                            >
                                                <div className="w-5 h-5 bg-white border-[3px] border-brand rounded-full shadow-sm" />
                                            </div>

                                            {/* Top-Right */}
                                            <div
                                                className="absolute -top-6 -right-6 w-12 h-12 flex items-center justify-center z-50 cursor-nesw-resize touch-none"
                                                style={handleStyle}
                                                onPointerDown={(e) => handlePointerDown(e, item.id, 'RESIZE-TR')}
                                            >
                                                <div className="w-5 h-5 bg-white border-[3px] border-brand rounded-full shadow-sm" />
                                            </div>

                                            {/* Bottom-Left */}
                                            <div
                                                className="absolute -bottom-6 -left-6 w-12 h-12 flex items-center justify-center z-50 cursor-nesw-resize touch-none"
                                                style={handleStyle}
                                                onPointerDown={(e) => handlePointerDown(e, item.id, 'RESIZE-BL')}
                                            >
                                                <div className="w-5 h-5 bg-white border-[3px] border-brand rounded-full shadow-sm" />
                                            </div>

                                            {/* Bottom-Right */}
                                            <div
                                                className="absolute -bottom-6 -right-6 w-12 h-12 flex items-center justify-center z-50 cursor-nwse-resize touch-none"
                                                style={handleStyle}
                                                onPointerDown={(e) => handlePointerDown(e, item.id, 'RESIZE-BR')}
                                            >
                                                <div className="w-5 h-5 bg-brand border-[3px] border-white rounded-full shadow-sm ring-1 ring-black/10" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div >

            {/* Bottom Bar */}
            < div className="bg-white border-t border-neutral-200 p-3 safe-area-bottom shrink-0 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30" >
                <div className="flex gap-3 w-full justify-between overflow-x-auto">
                    {selectedId ? (
                        <div className="flex gap-2 w-full justify-center">
                            <Button variant="secondary" onClick={() => rotateSelected(-90)} className="px-3 h-14 flex-1 sm:flex-none" title="Girar Esquerda"><RotateCcw size={24} /></Button>
                            <Button variant="secondary" onClick={() => rotateSelected(90)} className="px-3 h-14 flex-1 sm:flex-none" title="Girar Direita"><RotateCw size={24} /></Button>
                            <Button variant="secondary" onClick={duplicateSelected} className="px-3 h-14 flex-1 sm:flex-none" title="Duplicar"><Copy size={24} /></Button>
                            <Button variant="ghost" onClick={deleteSelected} className="text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 px-3 h-14 flex-1 sm:flex-none" title="Excluir"><Trash2 size={24} /></Button>
                        </div>
                    ) : (
                        <div className="flex gap-3 w-full justify-center">
                            <Button variant="primary" onClick={onAddMore} className="h-14 px-6 flex-1 sm:flex-none shadow-xl shadow-brand/20 w-full text-lg">
                                <Plus size={24} className="mr-2" />
                                Adicionar Outro Item
                            </Button>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};