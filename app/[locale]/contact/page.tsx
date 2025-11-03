/**
 * Contact Page - Internationalized
 */

import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';
import Container from '@/components/common/Container';
import ContactForm from '@/components/contact/ContactForm';
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

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {t('form.send')}
            </h2>
            <ContactForm
              labels={{
                name: t('form.name'),
                namePlaceholder: t('form.namePlaceholder'),
                email: t('form.email'),
                emailPlaceholder: t('form.emailPlaceholder'),
                subject: t('form.subject'),
                subjectPlaceholder: t('form.subjectPlaceholder'),
                message: t('form.message'),
                messagePlaceholder: t('form.messagePlaceholder'),
                send: t('form.send'),
                sending: t('form.sending'),
                success: t('form.success'),
                error: t('form.error'),
              }}
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {t('info.title')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {t('info.email')}
                    </h3>
                    <a
                      href="mailto:your.email@example.com"
                      className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                    >
                      your.email@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {t('info.location')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Ho Chi Minh City, Vietnam
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {t('social.title')}
              </h2>
              <div className="flex gap-4">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-white transition-colors hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
