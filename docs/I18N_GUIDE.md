# Internationalization (i18n) Guide

Complete guide for working with internationalization in this Next.js 16 project.

## Overview

This project uses `next-intl` for internationalization, supporting 6 languages:
- English (en) - Default
- Vietnamese (vi)
- Japanese (ja)
- Chinese (zh)
- Korean (ko)
- Thai (th)

## Architecture

### Folder Structure

```
project/
├── app/
│   └── [locale]/              # Dynamic locale segment
│       ├── layout.tsx         # Locale-specific layout
│       ├── page.tsx           # Home page
│       ├── about/
│       ├── blog/
│       ├── projects/
│       └── contact/
├── messages/                  # Translation files
│   ├── en.json
│   ├── vi.json
│   ├── ja.json
│   ├── zh.json
│   ├── ko.json
│   └── th.json
├── lib/
│   └── i18n/
│       ├── config.ts         # i18n configuration
│       ├── request.ts        # Server-side i18n
│       └── navigation.ts     # Type-safe navigation
├── components/
│   └── common/
│       └── LanguageSwitcher.tsx
├── types/
│   └── i18n.d.ts            # TypeScript types
└── middleware.ts            # Locale detection & routing
```

## Configuration Files

### 1. lib/i18n/config.ts
Core i18n configuration with locale definitions, flags, and utility functions.

### 2. lib/i18n/request.ts
Server-side translation configuration for Next.js App Router.

### 3. lib/i18n/navigation.ts
Type-safe navigation utilities that automatically handle locale prefixes.

### 4. middleware.ts
Handles automatic locale detection and routing.

## Translation Files

Translation files are organized in namespaces:

```json
{
  "common": {
    "readMore": "Read More",
    "loading": "Loading..."
  },
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "home": {
    "hero": {
      "greeting": "Hi, I'm"
    }
  }
}
```

### Namespace Structure
- `common`: Shared translations (buttons, labels, etc.)
- `nav`: Navigation items
- `footer`: Footer content
- `home`: Homepage content
- `about`: About page content
- `blog`: Blog page content
- `projects`: Projects page content
- `contact`: Contact page content
- `errors`: Error messages

## Usage

### 1. Using Translations in Server Components

```tsx
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

// For metadata
export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

// In component
export default async function Page({ params }: LocalePageProps) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const t = await getTranslations('home');

  return <h1>{t('hero.greeting')}</h1>;
}
```

### 2. Using Translations in Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('nav');

  return <button>{t('home')}</button>;
}
```

### 3. Using Scoped Translations

```tsx
const t = useTranslations('home.hero');

<h1>{t('greeting')}</h1>  // Translates: home.hero.greeting
```

### 4. Type-Safe Navigation

Always use the i18n-aware Link and navigation hooks:

```tsx
import { Link, useRouter, usePathname } from '@/lib/i18n/navigation';

// Link component
<Link href="/about">About</Link>

// Programmatic navigation
const router = useRouter();
router.push('/blog');

// Get current pathname (without locale)
const pathname = usePathname();
```

### 5. Language Switcher

The LanguageSwitcher component is already integrated in the Header:

```tsx
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

<LanguageSwitcher />
```

## Adding a New Language

### Step 1: Add locale to config

Edit `lib/i18n/config.ts`:

```typescript
export type Locale = 'en' | 'vi' | 'ja' | 'zh' | 'ko' | 'th' | 'fr'; // Add 'fr'

export const locales: Locale[] = ['en', 'vi', 'ja', 'zh', 'ko', 'th', 'fr'];

export const localeNames: Record<Locale, string> = {
  // ... existing
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  // ... existing
  fr: '🇫🇷',
};
```

### Step 2: Create translation file

Create `messages/fr.json` with all required translations. Use `messages/en.json` as a template.

### Step 3: Test

The new language will automatically appear in the LanguageSwitcher dropdown.

## Adding New Translation Keys

### Step 1: Add to English (base)

Edit `messages/en.json`:

```json
{
  "myNewSection": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

### Step 2: Add to all other languages

Add the same keys to `vi.json`, `ja.json`, `zh.json`, `ko.json`, `th.json`.

### Step 3: Use in components

```tsx
const t = useTranslations('myNewSection');
<h1>{t('title')}</h1>
```

## Best Practices

### 1. Namespace Organization
- Keep translations organized by page/feature
- Use nested keys for related content
- Avoid deeply nested structures (max 3 levels)

### 2. Translation Keys
- Use camelCase for keys: `heroGreeting`, not `hero-greeting`
- Be descriptive: `submitButton`, not just `submit`
- Group related translations: `form.name`, `form.email`

### 3. Avoid Hardcoded Text
❌ Bad:
```tsx
<button>Submit</button>
```

✅ Good:
```tsx
<button>{t('common.submit')}</button>
```

### 4. Use Rich Text Carefully
For HTML in translations:

```json
{
  "welcome": "Welcome <strong>back</strong>!"
}
```

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations();
<div dangerouslySetInnerHTML={{ __html: t('welcome') }} />
```

### 5. Pluralization

```json
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{count} items"
  }
}
```

```tsx
t('items', { count: 5 }) // "5 items"
```

### 6. Date and Number Formatting

```tsx
import { useFormatter } from 'next-intl';

const format = useFormatter();

// Dates
format.dateTime(new Date(), { dateStyle: 'long' });

// Numbers
format.number(1234.56, { style: 'currency', currency: 'USD' });
```

## URL Structure

With `localePrefix: 'always'`, URLs always include the locale:

```
/en              → English homepage
/vi              → Vietnamese homepage
/en/about        → English about page
/ja/blog         → Japanese blog page
```

Accessing `/` redirects to `/en` (default locale).

## SEO Considerations

### 1. Hreflang Tags

The layout automatically sets the correct `lang` attribute:

```tsx
<html lang={locale}>
```

### 2. Alternate Language Links

Add to your layout:

```tsx
export async function generateMetadata({ params }: LocaleLayoutProps) {
  return {
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        'en': '/en',
        'vi': '/vi',
        'ja': '/ja',
        'zh': '/zh',
        'ko': '/ko',
        'th': '/th',
      },
    },
  };
}
```

## TypeScript Support

Full type safety for translations:

```tsx
// Types are automatically inferred from en.json
const t = useTranslations('home');
t('hero.greeting'); // ✅ Type-safe
t('hero.invalid');  // ❌ Type error
```

## Debugging

### Check Current Locale

```tsx
import { useLocale } from 'next-intl';

const locale = useLocale(); // 'en', 'vi', etc.
```

### Check Available Translations

```tsx
const t = useTranslations();
console.log(t.raw('home')); // Logs all home translations
```

### Middleware Debugging

Check middleware.ts for routing issues. The middleware logs locale detection.

## Performance

### Static Generation

All locale paths are pre-generated at build time:

```tsx
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

### Message Loading

Messages are loaded per route, not all at once, for optimal performance.

## Common Issues

### Issue: "Locale not found"
**Solution**: Ensure locale is in `locales` array in `config.ts`

### Issue: Missing translations show keys
**Solution**: Add the translation key to all language files

### Issue: Navigation doesn't update locale
**Solution**: Use `Link` from `@/lib/i18n/navigation`, not `next/link`

### Issue: Client component errors
**Solution**: Wrap client components with `NextIntlClientProvider` in layout

## Migration Checklist

When adding i18n to an existing page:

- [ ] Move page to `app/[locale]/` directory
- [ ] Add `LocalePageProps` type to page props
- [ ] Call `unstable_setRequestLocale(locale)` at start
- [ ] Replace hardcoded text with `t()` calls
- [ ] Add translations to all language files
- [ ] Update `generateMetadata` for i18n
- [ ] Use i18n-aware `Link` component
- [ ] Test all supported languages

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

## Support

For questions or issues with i18n:
1. Check this guide
2. Review `messages/en.json` for examples
3. Check the next-intl documentation
4. Review existing pages for implementation patterns
