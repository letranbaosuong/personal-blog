/**
 * DatePicker Component - Quick date selection with dropdown
 */

'use client';

import { Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value?: string; // ISO date string
  onChange: (date: string | undefined) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = 'Due date' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Quick date options
  const getToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today.toISOString();
  };

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    return tomorrow.toISOString();
  };

  const getNextWeek = () => {
    const nextWeek = new Date();
    const dayOfWeek = nextWeek.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    nextWeek.setDate(nextWeek.getDate() + daysUntilMonday);
    nextWeek.setHours(23, 59, 59, 999);
    return nextWeek.toISOString();
  };

  const handleQuickSelect = (dateGetter: () => string) => {
    onChange(dateGetter());
    setIsOpen(false);
  };

  const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      date.setHours(23, 59, 59, 999);
      onChange(date.toISOString());
    } else {
      onChange(undefined);
    }
    setIsOpen(false);
  };

  // Format display text
  const getDisplayText = () => {
    if (!value) return null;

    const date = new Date(value);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayText = getDisplayText();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors ${
          value
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
        title={placeholder}
      >
        <Calendar className="h-3.5 w-3.5" />
        {displayText && <span>{displayText}</span>}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="p-1">
            {/* Quick options */}
            <button
              type="button"
              onClick={() => handleQuickSelect(getToday)}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Today</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(getTomorrow)}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Tomorrow</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(getNextWeek)}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Next week</span>
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />

            {/* Custom date picker */}
            <div className="px-3 py-2">
              <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                Pick a date
              </label>
              <input
                type="date"
                onChange={handleCustomDate}
                className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>

            {/* Clear button */}
            {value && (
              <>
                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                <button
                  type="button"
                  onClick={() => {
                    onChange(undefined);
                    setIsOpen(false);
                  }}
                  className="w-full rounded px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Clear due date
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
