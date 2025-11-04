'use client';

/**
 * LanguageSwitcher Component
 * Beautiful dropdown for language selection with flags and smooth animations
 */

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n/config';
import { Globe } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate dropdown position based on button location
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 300; // Approximate height of dropdown

      // If not enough space below but enough space above, show above
      const shouldShowAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
      setShowAbove(shouldShowAbove);

      // Calculate position for fixed positioning
      if (shouldShowAbove) {
        // Position above button
        setDropdownPosition({
          top: rect.top - dropdownHeight - 8, // 8px gap
          left: rect.left,
        });
      } else {
        // Position below button
        setDropdownPosition({
          top: rect.bottom + 8, // 8px gap
          left: rect.left,
        });
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          'border border-gray-200 bg-white hover:bg-gray-50',
          'dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'dark:focus:ring-offset-gray-900',
          isOpen && 'ring-2 ring-blue-500'
        )}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
        <span className="sm:hidden text-gray-700 dark:text-gray-300">
          {localeFlags[locale]}
        </span>
        <svg
          className={twMerge(
            'h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
          className={twMerge(
            'fixed z-50 w-56',
            'rounded-lg border border-gray-200 bg-white shadow-lg',
            'dark:border-gray-700 dark:bg-gray-800',
            'animate-in fade-in duration-200',
            showAbove
              ? 'origin-bottom-left slide-in-from-bottom-2'
              : 'origin-top-left slide-in-from-top-2'
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-2">
            <div className="mb-2 px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Select Language
              </p>
            </div>

            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={twMerge(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all',
                  'hover:bg-gray-100 dark:hover:bg-gray-700',
                  locale === loc
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                )}
                role="menuitem"
              >
                <span className="text-xl">{localeFlags[loc]}</span>
                <span className="flex-1 text-left">{localeNames[loc]}</span>
                {locale === loc && (
                  <svg
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <p className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
              Language preference saved locally
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
