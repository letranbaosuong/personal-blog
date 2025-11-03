/**
 * i18n Configuration
 * Centralized configuration for internationalization settings
 */

export type Locale = 'en' | 'vi' | 'ja' | 'zh' | 'ko' | 'th';

export const locales: Locale[] = ['en', 'vi', 'ja', 'zh', 'ko', 'th'];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  ja: '日本語',
  zh: '中文',
  ko: '한국어',
  th: 'ไทย',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  vi: '🇻🇳',
  ja: '🇯🇵',
  zh: '🇨🇳',
  ko: '🇰🇷',
  th: '🇹🇭',
};

export const localeDirs: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  vi: 'ltr',
  ja: 'ltr',
  zh: 'ltr',
  ko: 'ltr',
  th: 'ltr',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return null;
}

export function removeLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (locale) {
    return pathname.replace(`/${locale}`, '') || '/';
  }
  return pathname;
}
