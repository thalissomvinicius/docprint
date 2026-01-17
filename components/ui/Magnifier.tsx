import React, { useState, useRef, useEffect } from 'react';

interface MagnifierProps {
    imageSrc: string;
    magnification?: number;
    size?: number;
    className?: string;
}

export const Magnifier: React.FC<MagnifierProps> = ({
    imageSrc,
    magnification = 2.5,
    size = 120,
    className = ''
}) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current || !containerRef.current) return;

        const img = imgRef.current;
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        // Calculate position relative to image
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPosition({ x, y });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!imgRef.current || !containerRef.current || e.touches.length === 0) return;

        e.preventDefault();
        const touch = e.touches[0];
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        setPosition({ x, y });
    };

    const handleImageLoad = () => {
        if (imgRef.current) {
            setImgSize({
                width: imgRef.current.naturalWidth,
                height: imgRef.current.naturalHeight
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setShowMagnifier(true)}
            onMouseLeave={() => setShowMagnifier(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setShowMagnifier(true)}
            onTouchEnd={() => setShowMagnifier(false)}
            onTouchMove={handleTouchMove}
        >
            <img
                ref={imgRef}
                src={imageSrc}
                alt="Magnifiable"
                className="max-h-[70vh] max-w-full object-contain block pointer-events-none select-none"
                onLoad={handleImageLoad}
                draggable={false}
            />

            {showMagnifier && imgRef.current && (
                <div
                    className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full overflow-hidden z-50"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${position.x - size / 2}px`,
                        top: `${position.y - size / 2}px`,
                        backgroundImage: `url('${imageSrc}')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: `${imgRef.current.width * magnification}px ${imgRef.current.height * magnification}px`,
                        backgroundPosition: `-${(position.x * magnification) - size / 2}px -${(position.y * magnification) - size / 2}px`,
                        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5), 0 8px 16px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-blue-500/50 absolute" />
                        <div className="h-full w-0.5 bg-blue-500/50 absolute" />
                    </div>
                </div>
            )}

            {/* Hint text */}
            {showMagnifier && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs pointer-events-none">
                    🔍 Zoom {magnification}x
                </div>
            )}
        </div>
    );
};
