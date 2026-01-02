import React from 'react';

export interface ProgressBarProps {
  /** Current progress value (0-100) */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /** Show percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: 'right' | 'inside' | 'top';
  /** Custom label text (overrides percentage) */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Animated/striped style */
  animated?: boolean;
}

const sizeStyles: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const variantStyles: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

const trackStyles = 'bg-gray-100 dark:bg-gray-700';

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  labelPosition = 'right',
  label,
  className = '',
  animated = false,
}) => {
  // Clamp value between 0 and max
  const clampedValue = Math.min(Math.max(0, value), max);
  const percentage = Math.round((clampedValue / max) * 100);
  const displayLabel = label ?? `${percentage}%`;

  const baseTrackStyles = 'w-full rounded-full overflow-hidden';
  const baseBarStyles = 'h-full rounded-full transition-all duration-300 ease-out';
  const animatedStyles = animated ? 'animate-pulse' : '';

  const trackClassName = [
    baseTrackStyles,
    trackStyles,
    sizeStyles[size],
    className,
  ].filter(Boolean).join(' ');

  const barClassName = [
    baseBarStyles,
    variantStyles[variant],
    animatedStyles,
  ].filter(Boolean).join(' ');

  const renderLabel = () => {
    if (!showLabel) return null;
    
    return (
      <span 
        className="text-xs font-medium text-[#616f89] dark:text-gray-400 whitespace-nowrap"
        data-testid="progress-label"
      >
        {displayLabel}
      </span>
    );
  };

  // Top label layout
  if (showLabel && labelPosition === 'top') {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          {renderLabel()}
        </div>
        <div 
          className={trackClassName}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          data-testid="progress-bar"
        >
          <div 
            className={barClassName}
            style={{ width: `${percentage}%` }}
            data-testid="progress-fill"
          />
        </div>
      </div>
    );
  }

  // Inside label layout (only for lg size)
  if (showLabel && labelPosition === 'inside' && size === 'lg') {
    return (
      <div 
        className={trackClassName}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        data-testid="progress-bar"
      >
        <div 
          className={`${barClassName} flex items-center justify-center`}
          style={{ width: `${percentage}%` }}
          data-testid="progress-fill"
        >
          <span className="text-xs font-medium text-white" data-testid="progress-label">
            {displayLabel}
          </span>
        </div>
      </div>
    );
  }

  // Right label layout (default)
  if (showLabel && labelPosition === 'right') {
    return (
      <div className="flex items-center gap-3 w-full">
        <div 
          className={`flex-1 ${trackClassName}`}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          data-testid="progress-bar"
        >
          <div 
            className={barClassName}
            style={{ width: `${percentage}%` }}
            data-testid="progress-fill"
          />
        </div>
        <span 
          className="text-xs font-medium text-[#616f89] dark:text-gray-400 w-12 text-right"
          data-testid="progress-label"
        >
          {displayLabel}
        </span>
      </div>
    );
  }

  // No label layout
  return (
    <div 
      className={trackClassName}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={max}
      data-testid="progress-bar"
    >
      <div 
        className={barClassName}
        style={{ width: `${percentage}%` }}
        data-testid="progress-fill"
      />
    </div>
  );
};

export default ProgressBar;
