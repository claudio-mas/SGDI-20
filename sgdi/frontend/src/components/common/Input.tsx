import React, { useState, forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  type?: 'text' | 'email' | 'password' | 'search';
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showPasswordToggle?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<string, { input: string; icon: string }> = {
  sm: {
    input: 'h-9 text-xs',
    icon: 'text-[16px]',
  },
  md: {
    input: 'h-12 text-base',
    icon: 'text-[20px]',
  },
  lg: {
    input: 'h-14 text-lg',
    icon: 'text-[24px]',
  },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder,
      error,
      icon,
      iconPosition = 'left',
      showPasswordToggle = false,
      value,
      onChange,
      size = 'md',
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const isSearch = type === 'search';
    const actualType = isPassword && showPassword ? 'text' : type;

    const hasLeftIcon = icon && iconPosition === 'left';
    const hasRightIcon = (icon && iconPosition === 'right') || (isPassword && showPasswordToggle);

    const baseInputStyles = [
      'form-input w-full rounded-lg border bg-white dark:bg-gray-900',
      'text-[#111318] dark:text-white',
      'placeholder:text-[#9ca3af]',
      'focus:border-primary focus:ring-1 focus:ring-primary',
      'transition-colors',
      sizeStyles[size].input,
    ];

    const borderStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-[#dbdfe6] dark:border-gray-600';

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '';

    const paddingStyles = [
      hasLeftIcon ? 'pl-10' : 'pl-4',
      hasRightIcon ? 'pr-12' : 'pr-4',
    ].join(' ');

    // Search type specific styles
    const searchStyles = isSearch
      ? 'border-0 bg-[#f0f2f4] dark:bg-gray-800 ring-0 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-900'
      : '';

    const inputClassName = [
      ...baseInputStyles,
      borderStyles,
      disabledStyles,
      paddingStyles,
      searchStyles,
      className,
    ].filter(Boolean).join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const renderIcon = (position: 'left' | 'right') => {
      if (position === 'left' && hasLeftIcon) {
        return (
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${sizeStyles[size].icon}`}
            data-testid="input-icon-left"
          >
            {icon}
          </span>
        );
      }

      if (position === 'right') {
        if (isPassword && showPasswordToggle) {
          return (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-[#616f89] hover:text-[#111318] dark:text-gray-400 dark:hover:text-white transition-colors"
              data-testid="password-toggle"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              disabled={disabled}
            >
              <span className={`material-symbols-outlined ${sizeStyles[size].icon}`}>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          );
        }

        if (icon && iconPosition === 'right' && !isPassword) {
          return (
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${sizeStyles[size].icon}`}
              data-testid="input-icon-right"
            >
              {icon}
            </span>
          );
        }
      }

      return null;
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold">
            {label}
          </label>
        )}
        <div className="relative">
          {renderIcon('left')}
          <input
            ref={ref}
            type={actualType}
            className={inputClassName}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? 'input-error' : undefined}
            {...props}
          />
          {renderIcon('right')}
        </div>
        {error && (
          <span
            id="input-error"
            className="text-red-500 text-xs font-medium"
            role="alert"
            data-testid="input-error"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
