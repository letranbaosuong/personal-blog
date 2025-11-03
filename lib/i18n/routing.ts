/**
 * i18n Routing Configuration
 * Uses next-intl v4 defineRouting API
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'vi', 'ja', 'zh', 'ko', 'th'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always use locale prefix
  localePrefix: 'always'
});

// Locale type for TypeScript
export type Locale = (typeof routing.locales)[number];
