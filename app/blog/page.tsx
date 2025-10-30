/**
 * Blog Listing Page with Category Filtering
 */

'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Search } from 'lucide-react';
import Container from '@/components/common/Container';
import BlogCard from '@/components/blog/BlogCard';
import CategoryFilter from '@/components/blog/CategoryFilter';
import type { BlogCategory, BlogPost } from '@/lib/types';
import { calculateReadingTime } from '@/lib/utils';

// Sample blog posts - replace with actual data from Firebase
const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    slug: 'getting-started-with-nextjs-15',
    excerpt:
      'Learn how to build modern web applications with Next.js 15, the latest version of the popular React framework.',
    content: '',
    category: 'technology',
    tags: ['Next.js', 'React', 'Web Development'],
    author: {
      name: 'Your Name',
      avatar: '',
      bio: '',
      email: 'your.email@example.com',
      socialLinks: {},
    },
    coverImage: '/images/blog/nextjs.jpg',
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    readingTime: 5,
    featured: true,
    published: true,
  },
  {
    id: '2',
    title: '5 Calisthenics Exercises for Beginners',
    slug: '5-calisthenics-exercises-for-beginners',
    excerpt:
      'Start your calisthenics journey with these fundamental bodyweight exercises that build strength and muscle.',
    content: '',
    category: 'calisthenics',
    tags: ['Fitness', 'Bodyweight', 'Training'],
    author: {
      name: 'Your Name',
      avatar: '',
      bio: '',
      email: 'your.email@example.com',
      socialLinks: {},
    },
    coverImage: '/images/blog/calisthenics.jpg',
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    readingTime: 7,
    featured: false,
    published: true,
  },
  {
    id: '3',
    title: 'The Benefits of a Plant-Based Diet',
    slug: 'benefits-of-plant-based-diet',
    excerpt:
      'Discover the health benefits of incorporating more plant-based foods into your daily meals.',
    content: '',
    category: 'health',
    tags: ['Nutrition', 'Health', 'Lifestyle'],
    author: {
      name: 'Your Name',
      avatar: '',
      bio: '',
      email: 'your.email@example.com',
      socialLinks: {},
    },
    coverImage: '/images/blog/health.jpg',
    publishedAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    readingTime: 6,
    featured: false,
    published: true,
  },
  {
    id: '4',
    title: 'Learning Guitar: First Month Journey',
    slug: 'learning-guitar-first-month',
    excerpt:
      'My experience and lessons learned during the first month of learning to play guitar.',
    content: '',
    category: 'guitar',
    tags: ['Music', 'Learning', 'Guitar'],
    author: {
      name: 'Your Name',
      avatar: '',
      bio: '',
      email: 'your.email@example.com',
      socialLinks: {},
    },
    coverImage: '/images/blog/guitar.jpg',
    publishedAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    readingTime: 4,
    featured: false,
    published: true,
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter posts based on category and search term
  const filteredPosts = samplePosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-16">
      <Container>
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Thoughts, tutorials, and insights on technology, health, fitness, and
            music
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex justify-center">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No posts found matching your criteria.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
