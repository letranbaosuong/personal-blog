/**
 * Homepage - Personal Introduction and Featured Content
 * Internationalized version with next-intl
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Code, Heart, Music, Dumbbell } from 'lucide-react';
import Container from '@/components/common/Container';
import Button from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { SITE_CONFIG, BLOG_CATEGORIES } from '@/lib/constants';
import { Link } from '@/lib/i18n/navigation';
import { LocalePageProps } from '@/types/i18n';

export default async function HomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations();

  // Enable static rendering
  setRequestLocale(locale);

  // Sample featured content
  const categories = Object.entries(BLOG_CATEGORIES).slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 dark:from-gray-900 dark:to-gray-950">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Text Content */}
            <div className="flex flex-col justify-center">
              <Badge variant="secondary" className="mb-4 w-fit">
                {t('home.hero.badge')}
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
                {t('home.hero.greeting')}{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  {SITE_CONFIG.author}
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                {t('home.hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <Button size="lg">
                    {t('home.hero.aboutButton')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" size="lg">
                    {t('home.hero.blogButton')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex items-center justify-center">
              <div className="relative h-80 w-80 overflow-hidden rounded-full border-4 border-blue-600 shadow-2xl lg:h-96 lg:w-96">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                  <span className="text-8xl font-bold">
                    {SITE_CONFIG.author.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Blog Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {t('home.categories.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('home.categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(([key, category]) => {
              const icons: Record<string, any> = {
                technology: Code,
                health: Heart,
                guitar: Music,
                calisthenics: Dumbbell,
              };
              const Icon = icons[key] || Code;

              return (
                <Link key={key} href={`/blog?category=${key}`}>
                  <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">
                        {t(`blog.categories.${key}` as any)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(`blog.categoryDescriptions.${key}` as any)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16 dark:bg-blue-700">
        <Container>
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t('home.cta.title')}
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              {t('home.cta.description')}
            </p>
            <Link href="/contact">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                {t('home.cta.button')}
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
