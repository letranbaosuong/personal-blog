/**
 * Individual Blog Post Page
 */

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Container from '@/components/common/Container';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { formatDate } from '@/lib/utils';
import { BLOG_CATEGORIES } from '@/lib/constants';
import type { BlogPost } from '@/lib/types';

// Sample blog post content
const samplePost: BlogPost = {
  id: '1',
  title: 'Getting Started with Next.js 15',
  slug: 'getting-started-with-nextjs-15',
  excerpt:
    'Learn how to build modern web applications with Next.js 15, the latest version of the popular React framework.',
  content: `
# Introduction

Next.js 15 brings exciting new features and improvements to help you build better web applications. In this post, we'll explore the key features and how to get started.

## What's New in Next.js 15

Next.js 15 introduces several powerful features:

### 1. Improved Performance

The new version comes with significant performance improvements, including:
- Faster build times
- Optimized bundle sizes
- Better caching strategies

### 2. Enhanced Developer Experience

Developer experience has been a top priority:
- Better error messages
- Improved hot reload
- TypeScript improvements

## Getting Started

To create a new Next.js 15 project, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Project Structure

A typical Next.js 15 project structure looks like this:

\`\`\`
my-app/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── public/
└── package.json
\`\`\`

## Conclusion

Next.js 15 is a powerful framework that makes building modern web applications easier and more enjoyable. Give it a try!
  `,
  category: 'technology',
  tags: ['Next.js', 'React', 'Web Development'],
  author: {
    name: 'Your Name',
    avatar: '',
    bio: 'Full Stack Developer',
    email: 'your.email@example.com',
    socialLinks: {},
  },
  coverImage: '/images/blog/nextjs.jpg',
  publishedAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  readingTime: 5,
  featured: true,
  published: true,
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // In production, fetch the post data here
  return {
    title: samplePost.title,
    description: samplePost.excerpt,
    openGraph: {
      title: samplePost.title,
      description: samplePost.excerpt,
      type: 'article',
      publishedTime: samplePost.publishedAt.toISOString(),
      authors: [samplePost.author.name],
      images: [samplePost.coverImage],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In production, fetch the post data based on params.slug
  const post = samplePost;
  const category = BLOG_CATEGORIES[post.category];

  return (
    <article className="py-16">
      <Container size="md">
        {/* Back Button */}
        <Link href="/blog" className="mb-8 inline-block">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          <div className="mb-4">
            <Badge variant="secondary">{category.label}</Badge>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <span>By {post.author.name}</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg">
            <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
              <span className="text-gray-400">Cover Image</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mb-12">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Tags */}
        <div className="mb-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            About the Author
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{post.author.bio}</p>
        </div>
      </Container>
    </article>
  );
}
