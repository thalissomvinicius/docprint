import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SpringButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
    fullWidth?: boolean;
    withRipple?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const SpringButton: React.FC<SpringButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    withRipple = false,
    className = '',
    onClick,
    disabled,
    type = 'button'
}) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

    const variants = {
        primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40",
        secondary: "bg-white border-2 border-neutral-200 text-neutral-700 hover:border-neutral-300 shadow-sm hover:shadow-md",
        ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100",
        icon: "p-3 text-neutral-700 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 shadow-sm"
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (withRipple) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const newRipple = { x, y, id: Date.now() };
            setRipples([...ripples, newRipple]);
            setTimeout(() => setRipples(r => r.filter(ripple => ripple.id !== newRipple.id)), 600);
        }
        onClick?.(e);
    };

    return (
        <motion.button
            type={type}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={handleClick}
            className={`relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            {children}
            {withRipple && ripples.map(ripple => (
                <motion.span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30 pointer-events-none"
                    style={{ left: ripple.x, top: ripple.y }}
                    initial={{ width: 0, height: 0, x: 0, y: 0 }}
                    animate={{ width: 300, height: 300, x: -150, y: -150, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            ))}
        </motion.button>
    );
};
