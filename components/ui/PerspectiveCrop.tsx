import React, { useState, useRef, useEffect } from 'react';

interface Point {
    x: number;
    y: number;
}

interface Corners {
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
}

interface PerspectiveCropProps {
    imageSrc: string;
    initialCorners?: Corners | null;
    onCornersChange?: (corners: Corners) => void;
    className?: string;
}

export const PerspectiveCrop: React.FC<PerspectiveCropProps> = ({
    imageSrc,
    initialCorners,
    onCornersChange,
    className = ''
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [corners, setCorners] = useState<Corners | null>(initialCorners || null);
    const [draggingCorner, setDraggingCorner] = useState<keyof Corners | null>(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    // Initialize corners when image loads
    useEffect(() => {
        if (initialCorners) {
            setCorners(initialCorners);
        }
    }, [initialCorners]);

    const updateImageSize = () => {
        if (imageRef.current) {
            const imgRect = imageRef.current.getBoundingClientRect();
            setImageSize({ width: imgRect.width, height: imgRect.height });
        }
    };

    useEffect(() => {
        if (!imageRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            updateImageSize();
        });

        resizeObserver.observe(imageRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const handleImageLoad = () => {
        if (!imageRef.current || !containerRef.current) return;

        updateImageSize();

        // If no initial corners, set default corners (10% inset from edges)
        if (!corners && !initialCorners) {
            const inset = 0.1;
            const defaultCorners = {
                topLeft: { x: inset, y: inset },
                topRight: { x: 1 - inset, y: inset },
                bottomLeft: { x: inset, y: 1 - inset },
                bottomRight: { x: 1 - inset, y: 1 - inset }
            };
            setCorners(defaultCorners);
            onCornersChange?.(defaultCorners);
        }
    };

    const getCornerPosition = (corner: Point) => {
        return {
            x: corner.x * imageSize.width,
            y: corner.y * imageSize.height
        };
    };

    const handlePointerDown = (cornerName: keyof Corners) => (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDraggingCorner(cornerName);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingCorner || !imageRef.current || !containerRef.current || !corners) return;

        const imgRect = imageRef.current.getBoundingClientRect();

        // Calculate relative position (0-1 range)
        const relativeX = Math.max(0, Math.min(1, (e.clientX - imgRect.left) / imgRect.width));
        const relativeY = Math.max(0, Math.min(1, (e.clientY - imgRect.top) / imgRect.height));

        const newCorners = {
            ...corners,
            [draggingCorner]: { x: relativeX, y: relativeY }
        };

        setCorners(newCorners);
        onCornersChange?.(newCorners);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (draggingCorner) {
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            setDraggingCorner(null);
        }
    };

    return (
        <div ref={containerRef} className={`flex justify-center items-center ${className}`}>
            <div className="relative">
                <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Crop preview"
                    className="max-h-[70vh] max-w-full w-auto object-contain block"
                    onLoad={handleImageLoad}
                    draggable={false}
                />

                {corners && imageSize.width > 0 && (
                    <>
                        <svg
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                            preserveAspectRatio="none"
                        >
                            {/* Overlay mask */}
                            <defs>
                                <mask id="crop-mask">
                                    <rect width="100%" height="100%" fill="white" />
                                    <polygon
                                        points={`${getCornerPosition(corners.topLeft).x},${getCornerPosition(corners.topLeft).y} ${getCornerPosition(corners.topRight).x},${getCornerPosition(corners.topRight).y} ${getCornerPosition(corners.bottomRight).x},${getCornerPosition(corners.bottomRight).y} ${getCornerPosition(corners.bottomLeft).x},${getCornerPosition(corners.bottomLeft).y}`}
                                        fill="black"
                                    />
                                </mask>
                            </defs>

                            {/* Dark overlay outside selection */}
                            <rect
                                width="100%"
                                height="100%"
                                fill="rgba(0, 0, 0, 0.6)"
                                mask="url(#crop-mask)"
                            />

                            {/* Border lines */}
                            <line x1={getCornerPosition(corners.topLeft).x} y1={getCornerPosition(corners.topLeft).y} x2={getCornerPosition(corners.topRight).x} y2={getCornerPosition(corners.topRight).y} stroke="white" strokeWidth="2" />
                            <line x1={getCornerPosition(corners.topRight).x} y1={getCornerPosition(corners.topRight).y} x2={getCornerPosition(corners.bottomRight).x} y2={getCornerPosition(corners.bottomRight).y} stroke="white" strokeWidth="2" />
                            <line x1={getCornerPosition(corners.bottomRight).x} y1={getCornerPosition(corners.bottomRight).y} x2={getCornerPosition(corners.bottomLeft).x} y2={getCornerPosition(corners.bottomLeft).y} stroke="white" strokeWidth="2" />
                            <line x1={getCornerPosition(corners.bottomLeft).x} y1={getCornerPosition(corners.bottomLeft).y} x2={getCornerPosition(corners.topLeft).x} y2={getCornerPosition(corners.topLeft).y} stroke="white" strokeWidth="2" />

                            {/* Grid lines (rule of thirds) */}
                            <line
                                x1={getCornerPosition(corners.topLeft).x + (getCornerPosition(corners.topRight).x - getCornerPosition(corners.topLeft).x) / 3}
                                y1={getCornerPosition(corners.topLeft).y + (getCornerPosition(corners.bottomLeft).y - getCornerPosition(corners.topLeft).y) / 3}
                                x2={getCornerPosition(corners.topRight).x + (getCornerPosition(corners.bottomRight).x - getCornerPosition(corners.topRight).x) / 3}
                                y2={getCornerPosition(corners.topRight).y + (getCornerPosition(corners.bottomRight).y - getCornerPosition(corners.topRight).y) / 3}
                                stroke="rgba(255, 255, 255, 0.3)"
                                strokeWidth="1"
                            />
                            <line
                                x1={getCornerPosition(corners.topLeft).x + (getCornerPosition(corners.topRight).x - getCornerPosition(corners.topLeft).x) * 2 / 3}
                                y1={getCornerPosition(corners.topLeft).y + (getCornerPosition(corners.bottomLeft).y - getCornerPosition(corners.topLeft).y) * 2 / 3}
                                x2={getCornerPosition(corners.topRight).x + (getCornerPosition(corners.bottomRight).x - getCornerPosition(corners.topRight).x) * 2 / 3}
                                y2={getCornerPosition(corners.topRight).y + (getCornerPosition(corners.bottomRight).y - getCornerPosition(corners.topRight).y) * 2 / 3}
                                stroke="rgba(255, 255, 255, 0.3)"
                                strokeWidth="1"
                            />
                        </svg>

                        {/* Corner handles */}
                        <div
                            className="absolute top-0 left-0 w-full h-full"
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                        >
                            {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((cornerName) => {
                                const pos = getCornerPosition(corners[cornerName]);
                                return (
                                    <div
                                        key={cornerName}
                                        className={`absolute w-12 h-12 -ml-6 -mt-6 cursor-move touch-none ${draggingCorner === cornerName ? 'z-50' : 'z-40'
                                            }`}
                                        style={{
                                            left: pos.x,
                                            top: pos.y
                                        }}
                                        onPointerDown={handlePointerDown(cornerName)}
                                    >
                                        {/* Outer circle (white with shadow) */}
                                        <div className="absolute inset-0 rounded-full bg-white shadow-lg border-2 border-blue-500 flex items-center justify-center">
                                            {/* Inner circle */}
                                            <div className={`w-3 h-3 rounded-full ${draggingCorner === cornerName ? 'bg-blue-600' : 'bg-blue-500'
                                                }`} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
