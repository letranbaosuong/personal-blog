/**
 * Blog Category Filter Component
 */

'use client';

import { cn } from '@/lib/utils';
import { BLOG_CATEGORIES } from '@/lib/constants';
import type { BlogCategory } from '@/lib/types';

interface CategoryFilterProps {
  selectedCategory?: BlogCategory | 'all';
  onCategoryChange: (category: BlogCategory | 'all') => void;
}

export default function CategoryFilter({
  selectedCategory = 'all',
  onCategoryChange,
}: CategoryFilterProps) {
  const categories = [
    { value: 'all' as const, label: 'All Posts' },
    ...Object.entries(BLOG_CATEGORIES).map(([value, config]) => ({
      value: value as BlogCategory,
      label: config.label,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all',
            selectedCategory === category.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
