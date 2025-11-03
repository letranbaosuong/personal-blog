/**
 * ReminderPicker Component - Set reminder time with dropdown
 */

'use client';

import { Bell } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ReminderPickerProps {
  value?: string; // ISO date string
  onChange: (reminder: string | undefined) => void;
  placeholder?: string;
}

export default function ReminderPicker({ value, onChange, placeholder = 'Remind me' }: ReminderPickerProps) {
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

  // Quick reminder options
  const getLaterToday = () => {
    const later = new Date();
    later.setHours(later.getHours() + 3);
    later.setMinutes(0, 0, 0);
    return later.toISOString();
  };

  const getTomorrow9AM = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString();
  };

  const getNextWeek9AM = () => {
    const nextWeek = new Date();
    const dayOfWeek = nextWeek.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    nextWeek.setDate(nextWeek.getDate() + daysUntilMonday);
    nextWeek.setHours(9, 0, 0, 0);
    return nextWeek.toISOString();
  };

  const handleQuickSelect = (dateGetter: () => string, label: string) => {
    onChange(dateGetter());
    setIsOpen(false);
  };

  const handleCustomReminder = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
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
    const now = new Date();

    // If today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    // If this week
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return `Tomorrow ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }

    if (diffDays > 1 && diffDays < 7) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit'
      });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
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
            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50'
            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
        title={placeholder}
      >
        <Bell className="h-3.5 w-3.5" />
        {displayText && <span className="max-w-[100px] truncate">{displayText}</span>}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="p-1">
            {/* Quick options */}
            <button
              type="button"
              onClick={() => handleQuickSelect(getLaterToday, 'Later today')}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Bell className="h-4 w-4 text-slate-400" />
              <div className="flex flex-1 items-center justify-between">
                <span>Later today</span>
                <span className="text-xs text-slate-400">
                  {new Date(getLaterToday()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(getTomorrow9AM, 'Tomorrow')}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Bell className="h-4 w-4 text-slate-400" />
              <div className="flex flex-1 items-center justify-between">
                <span>Tomorrow</span>
                <span className="text-xs text-slate-400">9:00 AM</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(getNextWeek9AM, 'Next week')}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Bell className="h-4 w-4 text-slate-400" />
              <div className="flex flex-1 items-center justify-between">
                <span>Next week</span>
                <span className="text-xs text-slate-400">Mon 9:00 AM</span>
              </div>
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-slate-200 dark:border-slate-700" />

            {/* Custom datetime picker */}
            <div className="px-3 py-2">
              <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                Custom time
              </label>
              <input
                type="datetime-local"
                onChange={handleCustomReminder}
                className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
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
                  Clear reminder
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
