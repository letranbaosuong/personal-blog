/**
 * Core type definitions for the personal blog application
 */

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  author: Author;
  coverImage: string;
  publishedAt: Date;
  updatedAt: Date;
  readingTime: number;
  featured: boolean;
  published: boolean;
}

export type BlogCategory =
  | 'health'
  | 'technology'
  | 'calisthenics'
  | 'guitar'
  | 'lifestyle'
  | 'other';

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  email: string;
  socialLinks: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

// Portfolio/CV Types
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string;
  technologies: string[];
  location: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  gpa?: number;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  startDate: Date;
  endDate: Date | null;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon?: string;
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'tools'
  | 'soft-skills';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Personal Information
export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  phone?: string;
  location: string;
  website?: string;
  socialLinks: SocialLinks;
  resume?: string;
}

// Contact Form
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor';
}

// Firebase Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// UI Component Props
export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  children: React.ReactNode;
}

// Blog Filter & Search
export interface BlogFilters {
  category?: BlogCategory;
  tags?: string[];
  search?: string;
  featured?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// SEO Metadata
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedAt?: Date;
  modifiedAt?: Date;
}

// Theme
export type Theme = 'light' | 'dark' | 'system';
