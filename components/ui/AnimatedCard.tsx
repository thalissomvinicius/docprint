import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    delay = 0,
    className = '',
    onClick,
    style
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay
            }}
            whileHover={{
                y: -4,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            onClick={onClick}
            style={style}
            className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 ${className}`}
        >
            {children}
        </motion.div>
    );
};
