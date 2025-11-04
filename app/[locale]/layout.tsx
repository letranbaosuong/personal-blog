import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from "@/components/common/ThemeProvider";
import MainLayout from "@/components/layout/MainLayout";
import { SITE_CONFIG, DEFAULT_SEO } from "@/lib/constants";
import { routing, type Locale } from '@/lib/i18n/routing';
import { localeNames, localeDirs } from '@/lib/i18n/config';
import { LocaleLayoutProps } from '@/types/i18n';
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: DEFAULT_SEO.title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: DEFAULT_SEO.description,
    keywords: DEFAULT_SEO.keywords,
    authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.author,
    openGraph: {
      type: "website",
      locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
      url: SITE_CONFIG.url,
      title: DEFAULT_SEO.title,
      description: DEFAULT_SEO.description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: DEFAULT_SEO.image,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_SEO.title,
      description: DEFAULT_SEO.description,
      images: [DEFAULT_SEO.image],
      creator: "@yourusername",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={localeDirs[locale as Locale]} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-slate-900`}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="Asia/Ho_Chi_Minh"
        >
          <ThemeProvider>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
