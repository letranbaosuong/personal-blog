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

  // Import blog data
  const { blogPosts, blogPostsContent } = await import('@/data/blog-posts');
  const posts = blogPosts;
  const postsContent = blogPostsContent[locale] || blogPostsContent.en;

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

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const content = postsContent[post.slug];
            if (!content) return null;

            return (
              <article
                key={post.id}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={post.image}
                    alt={content.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {post.featured && (
                    <div className="absolute right-2 top-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category and Reading Time */}
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {t(`categories.${post.category}`)}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {t('readingTime', { minutes: post.readingTime })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {content.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mb-4 line-clamp-2 text-slate-600 dark:text-slate-300">
                    {content.excerpt}
                  </p>

                  {/* Date */}
                  <time className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
