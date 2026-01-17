/**
 * File Validation Utilities
 * Validates uploaded files for size, type, and integrity
 */

export interface FileValidationError {
    type: 'SIZE' | 'TYPE' | 'CORRUPTED' | 'UNKNOWN';
    message: string;
}

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'application/pdf'
];

/**
 * Validates a single file
 * @param file - File to validate
 * @returns null if valid, FileValidationError if invalid
 */
export const validateFile = (file: File): FileValidationError | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            type: 'SIZE',
            message: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo permitido: 10MB`
        };
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        return {
            type: 'TYPE',
            message: `Tipo de arquivo não suportado: ${file.type || 'desconhecido'}. Use JPEG, PNG, WebP ou PDF.`
        };
    }

    // Check if file is empty
    if (file.size === 0) {
        return {
            type: 'CORRUPTED',
            message: 'Arquivo vazio ou corrompido'
        };
    }

    return null;
};

/**
 * Validates multiple files
 * @param files - Array of files to validate
 * @returns Object with valid files and errors
 */
export const validateFiles = (files: File[]): {
    validFiles: File[];
    errors: Array<{ file: File; error: FileValidationError }>;
} => {
    const validFiles: File[] = [];
    const errors: Array<{ file: File; error: FileValidationError }> = [];

    files.forEach(file => {
        const error = validateFile(file);
        if (error) {
            errors.push({ file, error });
        } else {
            validFiles.push(file);
        }
    });

    return { validFiles, errors };
};

/**
 * Attempts to load an image to verify it's not corrupted
 * @param file - File to verify
 * @returns Promise that resolves to true if valid, false if corrupted
 */
export const verifyImageIntegrity = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Image loaded successfully
                resolve(true);
            };

            img.onerror = () => {
                // Image failed to load (corrupted)
                resolve(false);
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            // FileReader failed
            resolve(false);
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
