/**
 * Application-wide constants
 */

import type { BlogCategory } from '@/lib/types';

// Site Configuration
export const SITE_CONFIG = {
  name: 'Personal Blog & Portfolio',
  title: 'Your Name - Full Stack Developer',
  description:
    'Personal blog and portfolio showcasing projects, skills, and thoughts on technology, health, fitness, and music.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: 'Your Name',
  email: 'your.email@example.com',
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
} as const;

// Blog Categories with Display Information
export const BLOG_CATEGORIES: Record<
  BlogCategory,
  {
    label: string;
    description: string;
    color: string;
    icon: string;
  }
> = {
  technology: {
    label: 'Technology',
    description: 'Web development, programming, and tech trends',
    color: 'blue',
    icon: 'code',
  },
  health: {
    label: 'Health',
    description: 'Wellness, nutrition, and healthy living',
    color: 'green',
    icon: 'heart',
  },
  calisthenics: {
    label: 'Calisthenics',
    description: 'Bodyweight training and fitness',
    color: 'orange',
    icon: 'dumbbell',
  },
  guitar: {
    label: 'Guitar',
    description: 'Music, guitar playing, and learning',
    color: 'purple',
    icon: 'music',
  },
  lifestyle: {
    label: 'Lifestyle',
    description: 'Personal development and life experiences',
    color: 'pink',
    icon: 'sparkles',
  },
  other: {
    label: 'Other',
    description: 'Miscellaneous topics and thoughts',
    color: 'gray',
    icon: 'folder',
  },
} as const;

// Navigation Links
export const NAV_LINKS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Projects',
    href: '/projects',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
] as const;

// Pagination
export const POSTS_PER_PAGE = 9;
export const PROJECTS_PER_PAGE = 6;

// Date Formats
export const DATE_FORMAT = {
  full: 'MMMM dd, yyyy',
  short: 'MMM dd, yyyy',
  month: 'MMMM yyyy',
  year: 'yyyy',
} as const;

// Reading Time (words per minute)
export const WORDS_PER_MINUTE = 200;

// Firebase Collections
export const FIREBASE_COLLECTIONS = {
  posts: 'posts',
  projects: 'projects',
  comments: 'comments',
  users: 'users',
} as const;

// Image Optimization
export const IMAGE_SIZES = {
  thumbnail: 400,
  small: 640,
  medium: 1024,
  large: 1920,
  avatar: 200,
} as const;

// SEO Defaults
export const DEFAULT_SEO = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: [
    'personal blog',
    'portfolio',
    'web development',
    'technology',
    'health',
    'fitness',
    'calisthenics',
    'guitar',
  ] as string[],
  image: '/images/og-image.jpg',
  type: 'website' as const,
} as const;

// Skill Categories Display
export const SKILL_CATEGORIES = {
  frontend: {
    label: 'Frontend',
    color: 'blue',
  },
  backend: {
    label: 'Backend',
    color: 'green',
  },
  database: {
    label: 'Database',
    color: 'purple',
  },
  devops: {
    label: 'DevOps',
    color: 'orange',
  },
  tools: {
    label: 'Tools',
    color: 'gray',
  },
  'soft-skills': {
    label: 'Soft Skills',
    color: 'pink',
  },
} as const;

// Admin Roles
export const ADMIN_ROLES = {
  admin: 'admin',
  editor: 'editor',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  notFound: 'The requested resource was not found.',
  unauthorized: 'You are not authorized to access this resource.',
  validation: 'Please check your input and try again.',
  firebase: 'Firebase operation failed. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  saved: 'Changes saved successfully!',
  deleted: 'Deleted successfully!',
  sent: 'Message sent successfully!',
  uploaded: 'File uploaded successfully!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'theme-preference',
  drafts: 'blog-drafts',
  recentPosts: 'recent-posts',
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
