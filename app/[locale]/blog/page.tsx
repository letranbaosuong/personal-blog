/**
 * Blog Page - Internationalized
 */

import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/common/Container';
import { LocalePageProps } from '@/types/i18n';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function BlogPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('blog');

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
          <p>{t('noPostsFound')}</p>
        </div>
      </Container>
    </div>
  );
}
