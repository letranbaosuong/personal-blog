/**
 * Header Component with Navigation
 * Internationalized with next-intl
 */

import { getTranslations } from 'next-intl/server';
import Container from '@/components/common/Container';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { Link } from '@/lib/i18n/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export default async function Header() {
  const t = await getTranslations('nav');

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/projects', label: t('projects') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-700 dark:bg-slate-900/95">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Language Switcher, Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <HeaderMobileMenu navLinks={navLinks} />
          </div>
        </div>
      </Container>
    </header>
  );
}
