/**
 * About Page - Internationalized
 */

import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Briefcase, GraduationCap, Code2, Award } from 'lucide-react';
import Container from '@/components/common/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { LocalePageProps } from '@/types/i18n';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function AboutPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');

  // Sample data - replace with actual data from Firebase or static content
  const experiences = [
    {
      id: '1',
      company: 'Tech Company',
      position: 'Full Stack Developer',
      period: '2022 - Present',
      description:
        'Developing and maintaining web applications using React, Next.js, and Node.js.',
      technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB'],
    },
  ];

  const skillsData = [
    { key: 'frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'] },
    { key: 'backend', items: ['Node.js', 'Express', 'REST APIs', 'GraphQL'] },
    { key: 'tools', items: ['MongoDB', 'PostgreSQL', 'Git', 'Docker', 'Figma'] },
  ];

  return (
    <div className="py-16">
      <Container>
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Professional Summary */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                {t('intro.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                {t('intro.description')}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            {t('skills.title')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skillsData.map(({ key, items }) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t(`skills.${key}` as any)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {items.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t('interests.title')}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['technology', 'health', 'guitar', 'calisthenics'].map((interest) => (
              <Card key={interest}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t(`interests.${interest}.title` as any)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t(`interests.${interest}.description` as any)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
