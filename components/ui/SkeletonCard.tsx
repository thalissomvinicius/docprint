import React from 'react';

interface SkeletonCardProps {
    variant?: 'default' | 'dashboard' | 'list';
    className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
    variant = 'default',
    className = ''
}) => {
    if (variant === 'dashboard') {
        return (
            <div className={`animate-pulse bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 ${className}`}>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-200" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-neutral-200 rounded-lg w-3/4" />
                        <div className="h-4 bg-neutral-200 rounded w-full" />
                        <div className="h-4 bg-neutral-200 rounded w-5/6" />
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'list') {
        return (
            <div className={`animate-pulse space-y-2 ${className}`}>
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-4 bg-neutral-200 rounded w-5/6" />
                <div className="h-4 bg-neutral-200 rounded w-4/6" />
            </div>
        );
    }

    return (
        <div className={`animate-pulse space-y-4 ${className}`}>
            <div className="h-12 bg-neutral-200 rounded-xl" />
            <div className="h-64 bg-neutral-200 rounded-2xl" />
            <div className="grid grid-cols-3 gap-2">
                <div className="h-8 bg-neutral-200 rounded-lg" />
                <div className="h-8 bg-neutral-200 rounded-lg" />
                <div className="h-8 bg-neutral-200 rounded-lg" />
            </div>
        </div>
    );
};
