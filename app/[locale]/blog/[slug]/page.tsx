/**
 * Blog Post Detail Page - Dynamic route for individual blog posts
 */

import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Container from '@/components/common/Container';
import { LocalePageProps } from '@/types/i18n';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

interface BlogPostDetailPageProps extends LocalePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { blogPosts, blogPostsContent } = await import('@/data/blog-posts');

  const post = blogPosts.find((p) => p.slug === slug);
  const content = blogPostsContent[locale] || blogPostsContent.en;
  const postContent = content[slug];

  if (!post || !postContent) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: postContent.title,
    description: postContent.excerpt,
  };
}

export async function generateStaticParams() {
  const { blogPosts } = await import('@/data/blog-posts');
  const locales = ['en', 'vi', 'ja', 'zh', 'ko', 'th'];

  const params = [];
  for (const post of blogPosts) {
    for (const locale of locales) {
      params.push({
        locale,
        slug: post.slug,
      });
    }
  }

  return params;
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('blog');

  // Import blog data
  const { blogPosts, blogPostsContent } = await import('@/data/blog-posts');
  const post = blogPosts.find((p) => p.slug === slug);
  const content = blogPostsContent[locale] || blogPostsContent.en;
  const postContent = content[slug];

  if (!post || !postContent) {
    notFound();
  }

  return (
    <div className="py-16">
      <Container>
        {/* Back Button */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Blog</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="mb-8">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {t(`categories.${post.category}`)}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-6 text-4xl font-bold text-slate-900 dark:text-slate-100">
                {postContent.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time>
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{t('readingTime', { minutes: post.readingTime })}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              <img
                src={post.image}
                alt={postContent.title}
                className="h-auto w-full object-cover"
              />
            </div>

            {/* Excerpt */}
            <div className="mb-8">
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {postContent.excerpt}
              </p>
            </div>

            {/* Main Content */}
            <div className="rounded-lg border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
              <div className="prose prose-slate max-w-none dark:prose-invert">
                <p className="text-slate-700 dark:text-slate-300">
                  {postContent.content || postContent.excerpt}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Information */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Post Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Category</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {t(`categories.${post.category}`)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Reading Time</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {post.readingTime} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Published</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {post.featured && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Featured</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      Yes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Share Section (placeholder) */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Share This Post
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share buttons will be implemented here
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
