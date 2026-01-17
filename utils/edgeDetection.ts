export interface Point {
    x: number;
    y: number;
}

export const detectDocumentCorners = async (imageUrl: string): Promise<Point[] | null> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                // Downsample for performance
                const maxDim = 800;
                let width = img.width;
                let height = img.height;

                if (width > maxDim || height > maxDim) {
                    const ratio = Math.min(maxDim / width, maxDim / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(null);
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;

                // Simple algorithm: Find bounding box of "content" vs "background"
                // This is a naive approach but fast. A full edge detection is heavy.
                // We scan from center outwards or edges inwards.

                // Let's try scanning from edges inwards to find significant contrast change
                // This assumes the document doesn't touch the edges of the image

                let minX = width, minY = height, maxX = 0, maxY = 0;
                const threshold = 30; // Sensitivity

                // Sample background color from top-left corner
                const bgR = data[0];
                const bgG = data[1];
                const bgB = data[2];

                for (let y = 0; y < height; y += 5) { // Skip pixels for speed
                    for (let x = 0; x < width; x += 5) {
                        const i = (y * width + x) * 4;
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        // Distance from background color
                        const dist = Math.sqrt(
                            Math.pow(r - bgR, 2) +
                            Math.pow(g - bgG, 2) +
                            Math.pow(b - bgB, 2)
                        );

                        if (dist > threshold) {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }

                // If no significant content found, return null or full image
                if (minX >= maxX || minY >= maxY) {
                    // Fallback to 10% margin
                    const marginX = width * 0.1;
                    const marginY = height * 0.1;
                    resolve([
                        { x: marginX, y: marginY }, // TL
                        { x: width - marginX, y: marginY }, // TR
                        { x: width - marginX, y: height - marginY }, // BR
                        { x: marginX, y: height - marginY } // BL
                    ]);
                    return;
                }

                // Add a small padding
                const padding = 10;
                minX = Math.max(0, minX - padding);
                minY = Math.max(0, minY - padding);
                maxX = Math.min(width, maxX + padding);
                maxY = Math.min(height, maxY + padding);

                // Scale back up to original coordinates
                const scaleX = img.width / width;
                const scaleY = img.height / height;

                resolve([
                    { x: minX * scaleX, y: minY * scaleY }, // Top-Left
                    { x: maxX * scaleX, y: minY * scaleY }, // Top-Right
                    { x: maxX * scaleX, y: maxY * scaleY }, // Bottom-Right
                    { x: minX * scaleX, y: maxY * scaleY }  // Bottom-Left
                ]);

            } catch (e) {
                console.error("Edge detection error:", e);
                resolve(null);
            }
        };
        img.onerror = (e) => reject(e);
        img.src = imageUrl;
    });
};
