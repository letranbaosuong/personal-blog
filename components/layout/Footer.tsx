/**
 * Footer Component
 */

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import Container from '@/components/common/Container';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
                Personal blog and portfolio showcasing my projects, skills, and
                thoughts on technology, health, fitness, and music.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
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
                Connect
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
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} {SITE_CONFIG.author}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
