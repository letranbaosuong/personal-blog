/**
 * Contact Page - Internationalized
 */

import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/common/Container';
import { LocalePageProps } from '@/types/i18n';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');

  return (
    <div className="py-16">
      <Container>
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>

        <div className="text-center text-slate-500 dark:text-slate-400">
          <p>Contact form coming soon...</p>
        </div>
      </Container>
    </div>
  );
}
