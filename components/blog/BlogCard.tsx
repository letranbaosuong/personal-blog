/**
 * Blog Post Card Component
 */

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatDate } from '@/lib/utils';
import { BLOG_CATEGORIES } from '@/lib/constants';
import type { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const category = BLOG_CATEGORIES[post.category];

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/blog/${post.slug}`}>
        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        <CardHeader>
          {/* Category Badge */}
          <div className="mb-3">
            <Badge variant="secondary">{category.label}</Badge>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent>
          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 dark:text-gray-400">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt, 'short')}</span>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} min read</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
