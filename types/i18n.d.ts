/**
 * TypeScript Type Definitions for i18n
 * Provides type safety for translations and locale handling
 */

import { Locale } from '@/lib/i18n/config';

// Type for messages structure
type Messages = typeof import('../messages/en.json');

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

// Page props with locale parameter (Next.js 16 async params)
export interface LocalePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Layout props with locale parameter (Next.js 16 async params)
export interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// Page props with locale and additional params (Next.js 16 async params)
export interface LocaleParamsPageProps<T = {}> {
  params: Promise<{
    locale: string;
  } & T>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export type { Locale };
