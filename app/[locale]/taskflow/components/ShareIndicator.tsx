/**
 * ShareIndicator Component
 *
 * Badge component to indicate shared status
 */

'use client';

import { Share2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareIndicatorProps {
  isShared: boolean;
  variant?: 'badge' | 'icon' | 'full';
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}

export const ShareIndicator = ({
  isShared,
  variant = 'badge',
  size = 'sm',
  label,
  className,
}: ShareIndicatorProps) => {
  if (!isShared) return null;

  const iconSizes = {
    sm: 12,
    md: 14,
  };

  if (variant === 'icon') {
    return (
      <Share2
        size={iconSizes[size]}
        className={cn('text-blue-500 dark:text-blue-400', className)}
        aria-label={label || 'Shared'}
      />
    );
  }

  if (variant === 'full') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2 py-1 dark:bg-blue-900/30',
          size === 'sm' ? 'text-xs' : 'text-sm',
          className
        )}
      >
        <Users size={iconSizes[size]} className="text-blue-600 dark:text-blue-400" />
        <span className="font-medium text-blue-700 dark:text-blue-300">
          {label || 'Shared'}
        </span>
      </div>
    );
  }

  // Badge variant (default)
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/30',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      <Share2
        size={iconSizes[size]}
        className="text-blue-600 dark:text-blue-400"
        aria-hidden="true"
      />
      <span className="font-medium text-blue-700 dark:text-blue-300">
        {label || 'Shared'}
      </span>
    </div>
  );
};
