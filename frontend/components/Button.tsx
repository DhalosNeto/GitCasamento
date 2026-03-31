import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2 rounded-sm font-sans tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-wedding-primary text-white hover:bg-opacity-90 shadow-md",
    secondary: "bg-wedding-secondary text-white hover:bg-opacity-90 shadow-md",
    outline: "border border-wedding-primary text-wedding-primary hover:bg-wedding-primary hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : children}
    </button>
  );
};