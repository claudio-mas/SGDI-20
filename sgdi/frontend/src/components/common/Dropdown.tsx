import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';
  className?: string;
  'aria-label'?: string;
}

const sizeStyles: Record<string, { trigger: string; menu: string; option: string }> = {
  sm: {
    trigger: 'h-8 px-2.5 text-xs gap-1.5',
    menu: 'text-xs',
    option: 'px-2.5 py-1.5',
  },
  md: {
    trigger: 'h-10 px-3 text-sm gap-2',
    menu: 'text-sm',
    option: 'px-3 py-2',
  },
  lg: {
    trigger: 'h-12 px-4 text-base gap-2',
    menu: 'text-base',
    option: 'px-4 py-2.5',
  },
};

const variantStyles: Record<string, string> = {
  default: 'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-none',
};

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      const option = options.find((opt) => opt.value === optionValue);
      if (option && !option.disabled) {
        onChange?.(optionValue);
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    },
    [onChange, options]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      const enabledOptions = options.filter((opt) => !opt.disabled);

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const enabledOption = enabledOptions[highlightedIndex];
            if (enabledOption) {
              handleSelect(enabledOption.value);
            }
          } else {
            setIsOpen(true);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < enabledOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : enabledOptions.length - 1
            );
          }
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, handleSelect]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when dropdown opens/closes
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex(
        (opt) => opt.value === value && !opt.disabled
      );
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, options, value]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && menuRef.current) {
      const highlightedElement = menuRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      // scrollIntoView may not be available in test environments
      if (highlightedElement?.scrollIntoView) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  const triggerClassName = [
    'inline-flex items-center justify-between rounded-lg font-medium transition-all',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
    'text-text-main dark:text-white',
    variantStyles[variant],
    sizeStyles[size].trigger,
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const menuClassName = [
    'absolute z-50 mt-1 w-full min-w-[120px] rounded-lg shadow-lg',
    'bg-white dark:bg-surface-dark',
    'border border-border-light dark:border-border-dark',
    'py-1 overflow-auto max-h-60',
    sizeStyles[size].menu,
  ].join(' ');

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        data-testid="dropdown-trigger"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className={!selectedOption ? 'text-text-secondary' : ''}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <span
          className={`material-symbols-outlined text-[18px] text-text-secondary transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          role="listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `dropdown-option-${highlightedIndex}` : undefined
          }
          className={menuClassName}
          data-testid="dropdown-menu"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            const isDanger = option.variant === 'danger';

            const optionClassName = [
              'flex items-center gap-2 cursor-pointer transition-colors',
              sizeStyles[size].option,
              isHighlighted && !option.disabled
                ? 'bg-gray-100 dark:bg-gray-700'
                : '',
              isSelected && !isDanger
                ? 'text-primary font-medium'
                : isDanger
                ? 'text-red-500 dark:text-red-400'
                : 'text-text-main dark:text-white',
              option.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <li
                key={option.value}
                id={`dropdown-option-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                className={optionClassName}
                onClick={() => !option.disabled && handleSelect(option.value)}
                onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                data-testid={`dropdown-option-${option.value}`}
              >
                {option.icon}
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px] ml-auto">
                    check
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
