import React, { useEffect, useState } from 'react';
import { ToastType } from '../../types';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800',
            iconColor: 'text-green-500'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800',
            iconColor: 'text-red-500'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800',
            iconColor: 'text-yellow-500'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500'
        }
    };

    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[type];

    return (
        <div
            className={`${bgColor} ${borderColor} ${textColor} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md pointer-events-auto transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                <Icon className={`${iconColor} shrink-0 mt-0.5`} size={20} />
                <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
                <button
                    onClick={handleClose}
                    className={`${textColor} hover:opacity-70 transition-opacity shrink-0`}
                    aria-label="Fechar notificação"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};
