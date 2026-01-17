import React, { useRef } from 'react';

interface FileInputProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    capture?: boolean | 'user' | 'environment';
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

/**
 * Reusable file input component that wraps any children with file selection functionality
 */
export const FileInput: React.FC<FileInputProps> = ({
    onFilesSelected,
    accept = 'image/*,application/pdf',
    multiple = false,
    capture,
    children,
    className = '',
    disabled = false
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesSelected(Array.from(e.target.files));
            // Reset input so same file can be selected again
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    return (
        <div className={`relative ${className}`}>
            {children}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                capture={capture}
                disabled={disabled}
                className="absolute inset-0 opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
                onChange={handleChange}
                aria-label={capture ? 'Capturar foto' : 'Selecionar arquivo'}
            />
        </div>
    );
};
