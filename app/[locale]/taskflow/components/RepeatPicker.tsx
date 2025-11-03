/**
 * RepeatPicker Component - Set task repeat pattern with dropdown
 */

'use client';

import { RotateCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { RepeatSettings, RepeatType } from '../types';

interface RepeatPickerProps {
  value?: RepeatSettings;
  onChange: (repeat: RepeatSettings | undefined) => void;
  placeholder?: string;
}

export default function RepeatPicker({ value, onChange, placeholder = 'Repeat' }: RepeatPickerProps) {
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

  const handleQuickSelect = (type: RepeatType) => {
    if (type === 'none') {
      onChange(undefined);
    } else {
      onChange({ type });
    }
    setIsOpen(false);
  };

  // Format display text
  const getDisplayText = () => {
    if (!value || value.type === 'none') return null;

    switch (value.type) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        if (value.daysOfWeek && value.daysOfWeek.length > 0) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const selectedDays = value.daysOfWeek.map(d => days[d]).join(', ');
          return `Weekly: ${selectedDays}`;
        }
        return 'Weekly';
      case 'monthly':
        if (value.dayOfMonth) {
          return `Monthly: Day ${value.dayOfMonth}`;
        }
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      case 'custom':
        return `Every ${value.interval || 1} days`;
      default:
        return null;
    }
  };

  const displayText = getDisplayText();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors ${
          value && value.type !== 'none'
            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
            : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
        }`}
        title={placeholder}
      >
        <RotateCw className="h-3.5 w-3.5" />
        {displayText && <span className="max-w-[100px] truncate">{displayText}</span>}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="p-1">
            {/* Quick options */}
            <button
              type="button"
              onClick={() => handleQuickSelect('daily')}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCw className="h-4 w-4 text-slate-400" />
              <span>Daily</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('weekly')}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCw className="h-4 w-4 text-slate-400" />
              <span>Weekly</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('monthly')}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCw className="h-4 w-4 text-slate-400" />
              <span>Monthly</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('yearly')}
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCw className="h-4 w-4 text-slate-400" />
              <span>Yearly</span>
            </button>

            {/* Weekday selection for weekly repeat */}
            {value?.type === 'weekly' && (
              <>
                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                <div className="px-3 py-2">
                  <label className="mb-2 block text-xs text-slate-500 dark:text-slate-400">
                    Repeat on
                  </label>
                  <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                      const isSelected = value.daysOfWeek?.includes(index);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentDays = value.daysOfWeek || [];
                            const newDays = isSelected
                              ? currentDays.filter(d => d !== index)
                              : [...currentDays, index].sort();
                            onChange({
                              ...value,
                              daysOfWeek: newDays.length > 0 ? newDays : undefined
                            });
                          }}
                          className={`rounded p-1 text-xs transition-colors ${
                            isSelected
                              ? 'bg-green-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Clear button */}
            {value && value.type !== 'none' && (
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
                  Don't repeat
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
