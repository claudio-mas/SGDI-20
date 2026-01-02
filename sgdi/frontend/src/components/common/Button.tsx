import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary hover:bg-blue-700 text-white shadow-md',
  secondary: 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
  ghost: 'text-[#616f89] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-gray-800 hover:text-[#111318] dark:hover:text-white',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const LoadingSpinner: React.FC<{ size: string }> = ({ size }) => {
  const spinnerSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <svg
      className={`animate-spin ${spinnerSize}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      data-testid="loading-spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabledStyles,
    className,
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (loading) {
      return <LoadingSpinner size={size} />;
    }
    return icon;
  };

  const iconElement = renderIcon();
  const showLeftIcon = iconElement && iconPosition === 'left';
  const showRightIcon = iconElement && iconPosition === 'right' && !loading;

  return (
    <button
      className={combinedClassName}
      disabled={isDisabled}
      {...props}
    >
      {showLeftIcon && iconElement}
      {children}
      {showRightIcon && iconElement}
    </button>
  );
};

export default Button;
