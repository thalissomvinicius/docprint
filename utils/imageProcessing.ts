import { DocImage, Point } from '../types';

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

export const calculateSize = (width: number, height: number, max: number) => {
  let newWidth = width;
  let newHeight = height;
  if (width > height) {
    if (width > max) {
      newHeight = Math.round((height * max) / width);
      newWidth = max;
    }
  } else {
    if (height > max) {
      newWidth = Math.round((width * max) / height);
      newHeight = max;
    }
  }
  return { width: newWidth, height: newHeight };
};

// --- MATH & GEOMETRY (Homography) ---

// Solve 3x3 Matrix for Perspective Transform (Gaussian Elimination)
// Solve 3x3 Matrix for Perspective Transform (Gaussian Elimination)
export function getPerspectiveTransform(src: Point[], dst: Point[]) {
  const a: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    a.push([src[i].x, src[i].y, 1, 0, 0, 0, -src[i].x * dst[i].x, -src[i].y * dst[i].x]);
    a.push([0, 0, 0, src[i].x, src[i].y, 1, -src[i].x * dst[i].y, -src[i].y * dst[i].y]);
    b.push(dst[i].x);
    b.push(dst[i].y);
  }

  const x = solveLinearSystem(a, b);
  return [
    x[0], x[1], x[2],
    x[3], x[4], x[5],
    x[6], x[7], 1
  ];
}

function solveLinearSystem(A: number[][], B: number[]) {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    let maxEl = Math.abs(A[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > maxEl) {
        maxEl = Math.abs(A[k][i]);
        maxRow = k;
      }
    }

    for (let k = i; k < n; k++) {
      const tmp = A[maxRow][k];
      A[maxRow][k] = A[i][k];
      A[i][k] = tmp;
    }
    const tmp = B[maxRow];
    B[maxRow] = B[i];
    B[i] = tmp;

    for (let k = i + 1; k < n; k++) {
      const c = -A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        if (i === j) {
          A[k][j] = 0;
        } else {
          A[k][j] += c * A[i][j];
        }
      }
      B[k] += c * B[i];
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i > -1; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += A[i][j] * x[j];
    }
    x[i] = (B[i] - sum) / A[i][i];
  }
  return x;
}

export const applyPerspectiveWarp = async (
  imageSrc: string,
  corners: Point[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // 1. Calculate dimensions of the new warped image
        // Width = max(top edge, bottom edge)
        const widthTop = Math.hypot(corners[1].x - corners[0].x, corners[1].y - corners[0].y);
        const widthBottom = Math.hypot(corners[2].x - corners[3].x, corners[2].y - corners[3].y);
        let maxWidth = Math.ceil(Math.max(widthTop, widthBottom));

        // Height = max(left edge, right edge)
        const heightLeft = Math.hypot(corners[3].x - corners[0].x, corners[3].y - corners[0].y);
        const heightRight = Math.hypot(corners[2].x - corners[1].x, corners[2].y - corners[1].y);
        let maxHeight = Math.ceil(Math.max(heightLeft, heightRight));

        // UPSCALE: Ensure minimum resolution of 2000px on largest side
        // This prevents quality loss on small crops
        const minOutputSize = 2000;
        const currentMaxSide = Math.max(maxWidth, maxHeight);
        let scaleFactor = 1;

        if (currentMaxSide < minOutputSize) {
          scaleFactor = minOutputSize / currentMaxSide;
          maxWidth = Math.ceil(maxWidth * scaleFactor);
          maxHeight = Math.ceil(maxHeight * scaleFactor);
        }

        console.log('[PerspectiveWarp] Output dimensions:', maxWidth, 'x', maxHeight, 'scale:', scaleFactor);
        console.log('[PerspectiveWarp] Input dimensions:', img.width, 'x', img.height);
        console.log('[PerspectiveWarp] Corners:', corners);

        const canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext('2d', {
          willReadFrequently: true,
          alpha: false // Disable alpha for better performance
        });

        if (!ctx) {
          console.error('[PerspectiveWarp] Failed to get canvas context');
          resolve(imageSrc);
          return;
        }

        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, maxWidth, maxHeight);

        // Draw original image to get data at FULL RESOLUTION
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })!;
        tempCtx.drawImage(img, 0, 0);
        const srcData = tempCtx.getImageData(0, 0, img.width, img.height);

        const dstData = ctx.createImageData(maxWidth, maxHeight);

        // Initialize with white
        for (let i = 0; i < dstData.data.length; i += 4) {
          dstData.data[i] = 255;     // R
          dstData.data[i + 1] = 255; // G
          dstData.data[i + 2] = 255; // B
          dstData.data[i + 3] = 255; // A
        }

        // 2. Calculate Homography Matrix (Inverse mapping: Dst -> Src)
        // We map FROM destination pixels TO source pixels to avoid holes
        const dstCorners = [
          { x: 0, y: 0 },
          { x: maxWidth, y: 0 },
          { x: maxWidth, y: maxHeight },
          { x: 0, y: maxHeight }
        ];

        // Note: We need Inverse Homography (Dst -> Src)
        // So we pass dstCorners as source for the matrix calc, and corners as destination
        const h = getPerspectiveTransform(dstCorners, corners);

        // 3. Iterate over all pixels in destination
        let validPixels = 0;
        for (let y = 0; y < maxHeight; y++) {
          for (let x = 0; x < maxWidth; x++) {
            // Apply matrix to (x, y)
            const denominator = h[6] * x + h[7] * y + h[8];
            const srcX = (h[0] * x + h[1] * y + h[2]) / denominator;
            const srcY = (h[3] * x + h[4] * y + h[5]) / denominator;

            if (srcX >= 0 && srcX < img.width - 1 && srcY >= 0 && srcY < img.height - 1) {
              // BILINEAR INTERPOLATION for smooth quality
              const x1 = Math.floor(srcX);
              const y1 = Math.floor(srcY);
              const x2 = x1 + 1;
              const y2 = y1 + 1;

              const xFrac = srcX - x1;
              const yFrac = srcY - y1;

              // Get 4 surrounding pixels
              const idx11 = (y1 * img.width + x1) * 4;
              const idx21 = (y1 * img.width + x2) * 4;
              const idx12 = (y2 * img.width + x1) * 4;
              const idx22 = (y2 * img.width + x2) * 4;

              const dstIdx = (y * maxWidth + x) * 4;

              // Bilinear blend for each channel (R, G, B)
              for (let c = 0; c < 3; c++) {
                const v11 = srcData.data[idx11 + c];
                const v21 = srcData.data[idx21 + c];
                const v12 = srcData.data[idx12 + c];
                const v22 = srcData.data[idx22 + c];

                // Interpolate horizontally, then vertically
                const top = v11 * (1 - xFrac) + v21 * xFrac;
                const bottom = v12 * (1 - xFrac) + v22 * xFrac;
                const value = top * (1 - yFrac) + bottom * yFrac;

                dstData.data[dstIdx + c] = Math.round(value);
              }
              dstData.data[dstIdx + 3] = 255; // Alpha
              validPixels++;
            }
          }
        }

        console.log('[PerspectiveWarp] Valid pixels:', validPixels, '/', maxWidth * maxHeight);

        ctx.putImageData(dstData, 0, 0);
        const result = canvas.toDataURL('image/png'); // PNG for lossless quality
        console.log('[PerspectiveWarp] Result data URL length:', result.length);
        resolve(result);
      } catch (error) {
        console.error('[PerspectiveWarp] Error during processing:', error);
        resolve(imageSrc);
      }
    };

    img.onerror = (error) => {
      console.error('[PerspectiveWarp] Image load error:', error);
      reject(error);
    };

    img.src = imageSrc;
  });
};

/**
 * Crops an image using 4 corner points WITHOUT applying perspective transformation.
 * This maintains the original perspective but crops to the polygonal region.
 */
export const applyPolygonalCrop = async (
  imageSrc: string,
  corners: Point[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate bounding box of the 4 corners
      const minX = Math.min(corners[0].x, corners[1].x, corners[2].x, corners[3].x);
      const maxX = Math.max(corners[0].x, corners[1].x, corners[2].x, corners[3].x);
      const minY = Math.min(corners[0].y, corners[1].y, corners[2].y, corners[3].y);
      const maxY = Math.max(corners[0].y, corners[1].y, corners[2].y, corners[3].y);

      const width = Math.ceil(maxX - minX);
      const height = Math.ceil(maxY - minY);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Create clipping path using the 4 corners
      // Adjust corners relative to the bounding box
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(corners[0].x - minX, corners[0].y - minY);
      ctx.lineTo(corners[1].x - minX, corners[1].y - minY);
      ctx.lineTo(corners[2].x - minX, corners[2].y - minY);
      ctx.lineTo(corners[3].x - minX, corners[3].y - minY);
      ctx.closePath();
      ctx.clip();

      // Draw the image shifted by the bounding box offset
      ctx.drawImage(img, -minX, -minY);
      ctx.restore();

      resolve(canvas.toDataURL('image/png')); // PNG for lossless quality
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};


// --- FILTERING ---

function applyMagicFilter(data: Uint8ClampedArray) {
  // CamScanner "Magic Color" approximation
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Luminance
    const l = 0.299 * r + 0.587 * g + 0.114 * b;

    // Magic Logic
    let newR = r, newG = g, newB = b;

    // 1. Background Whitening (Thresholding light grays)
    if (l > 130) {
      const boost = (l - 130) * 2.5;
      newR += boost;
      newG += boost;
      newB += boost;
    }

    // 2. Contrast Boost (S-Curve simple)
    // Darken darks
    if (l < 80) {
      const darken = (80 - l) * 0.5;
      newR -= darken;
      newG -= darken;
      newB -= darken;
    }

    data[i] = Math.min(255, Math.max(0, newR));
    data[i + 1] = Math.min(255, Math.max(0, newG));
    data[i + 2] = Math.min(255, Math.max(0, newB));
  }
}

function applyThreshold(data: Uint8ClampedArray, level: number) {
  const thresh = level;
  for (let i = 0; i < data.length; i += 4) {
    const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const val = l > thresh ? 255 : 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
  }
}

// --- MAIN PIPELINE ---

export const applyFiltersAndRender = async (
  image: DocImage,
  previewMaxSide: number = 4096 // Increased for better quality
): Promise<string> => {
  const imgElement = await loadImage(image.src);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  let currentW = imgElement.width;
  let currentH = imgElement.height;

  // 1. Initial Draw
  canvas.width = currentW;
  canvas.height = currentH;
  ctx.drawImage(imgElement, 0, 0);



  // 3. Resize if needed
  const { width: finalW, height: finalH } = calculateSize(currentW, currentH, previewMaxSide);
  if (finalW !== currentW || finalH !== currentH) {
    const tempC = document.createElement('canvas');
    tempC.width = finalW;
    tempC.height = finalH;
    const tCtx = tempC.getContext('2d')!;
    tCtx.drawImage(canvas, 0, 0, finalW, finalH);

    canvas.width = finalW;
    canvas.height = finalH;
    ctx.drawImage(tempC, 0, 0);
  }

  // 4. Pixel Level Processing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 4a. Auto Enhance
  if (image.filters.autoEnhance) {
    applyMagicFilter(data);
  }

  ctx.putImageData(imageData, 0, 0);

  // 5. CSS Filters
  if (image.filters.brightness !== 0 || image.filters.contrast !== 0 || image.filters.grayscale !== 0) {
    const b = (image.filters.brightness + 100) / 100;
    const c = (image.filters.contrast + 100) / 100;
    const g = image.filters.grayscale / 100;

    const tempC = document.createElement('canvas');
    tempC.width = canvas.width;
    tempC.height = canvas.height;
    const tCtx = tempC.getContext('2d')!;

    tCtx.filter = `brightness(${b}) contrast(${c}) grayscale(${g})`;
    tCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempC, 0, 0);
  }

  // 6. Threshold
  if (image.filters.threshold > 0) {
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyThreshold(id.data, image.filters.threshold);
    ctx.putImageData(id, 0, 0);
  }

  // 7. Rotation (90 deg increments - Handled *after* processing to keep logic simple)
  if (image.rotation !== 0) {
    const rotC = document.createElement('canvas');
    const is90or270 = image.rotation === 90 || image.rotation === 270;
    rotC.width = is90or270 ? canvas.height : canvas.width;
    rotC.height = is90or270 ? canvas.width : canvas.height;
    const rCtx = rotC.getContext('2d')!;

    rCtx.translate(rotC.width / 2, rotC.height / 2);
    rCtx.rotate((image.rotation * Math.PI) / 180);
    rCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    return rotC.toDataURL('image/png'); // PNG for lossless quality
  }

  return canvas.toDataURL('image/png'); // PNG for lossless quality
};