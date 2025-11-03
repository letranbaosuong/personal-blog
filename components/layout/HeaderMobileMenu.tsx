/**
 * Mobile Menu Component for Header
 * Client component to handle mobile menu state
 */

'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

interface NavLink {
  href: string;
  label: string;
}

interface HeaderMobileMenuProps {
  navLinks: NavLink[];
}

export function HeaderMobileMenu({ navLinks }: HeaderMobileMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="sr-only">Open main menu</span>
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-16 border-t border-slate-200 bg-white py-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
