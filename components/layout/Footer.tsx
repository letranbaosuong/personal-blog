/**
 * Footer Component
 * Internationalized with next-intl
 */

'use client';

import { useTranslations } from 'next-intl';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Container from '@/components/common/Container';
import { Link } from '@/lib/i18n/navigation';
import { SITE_CONFIG } from '@/lib/constants';

export default function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      href: SITE_CONFIG.social.github,
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: SITE_CONFIG.social.linkedin,
      icon: Linkedin,
    },
    {
      name: 'Twitter',
      href: SITE_CONFIG.social.twitter,
      icon: Twitter,
    },
    {
      name: 'Email',
      href: `mailto:${SITE_CONFIG.email}`,
      icon: Mail,
    },
  ];

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* About */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {SITE_CONFIG.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('home.hero.description')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t('footer.connect')}
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
            <div className="flex flex-col items-center gap-2">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                &copy; {currentYear} {SITE_CONFIG.author}. {t('footer.copyright')}
              </p>
              <p className="text-center text-xs text-gray-500 dark:text-gray-500">
                {t('footer.builtWith')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
