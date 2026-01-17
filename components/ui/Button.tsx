import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-light shadow-lg shadow-blue-500/20 rounded-lg px-6 py-3 border border-transparent",
    secondary: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm rounded-lg px-6 py-3",
    ghost: "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 px-4 py-2 rounded-lg",
    icon: "p-3 text-neutral-700 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 shadow-sm",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};