/**
 * ShareButton Component
 *
 * Reusable button component for triggering share actions
 */

'use client';

import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export const ShareButton = ({
  onClick,
  disabled = false,
  variant = 'ghost',
  size = 'md',
  label,
  showIcon = true,
  className,
}: ShareButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
    ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
    outline:
      'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      aria-label={label || 'Share'}
    >
      {showIcon && <Share2 size={iconSizes[size]} />}
      {label && <span>{label}</span>}
    </button>
  );
};
