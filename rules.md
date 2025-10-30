# Personal Blog & Portfolio - Development Rules and Guidelines

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Principles](#architecture-principles)
3. [Code Standards](#code-standards)
4. [Component Guidelines](#component-guidelines)
5. [TypeScript Guidelines](#typescript-guidelines)
6. [Styling Guidelines](#styling-guidelines)
7. [State Management](#state-management)
8. [API and Data Fetching](#api-and-data-fetching)
9. [Firebase Integration](#firebase-integration)
10. [Performance Optimization](#performance-optimization)
11. [SEO Best Practices](#seo-best-practices)
12. [Testing Strategy](#testing-strategy)
13. [Git Workflow](#git-workflow)
14. [Deployment](#deployment)

---

## Project Overview

### Purpose
This is a personal blog and portfolio website designed to:
- Showcase professional experience and skills to potential employers
- Share knowledge through blog posts on various topics
- Present completed and ongoing projects
- Provide contact information and professional networking

### Technology Stack
- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Markdown**: react-markdown with syntax highlighting
- **Icons**: Lucide React
- **Package Manager**: npm

---

## Architecture Principles

### Clean Architecture
The project follows clean architecture principles with clear separation of concerns:

```
personal-blog/
├── app/                    # Next.js App Router pages
│   ├── (pages)/           # Route groups
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── common/           # Reusable UI components
│   ├── layout/           # Layout components
│   ├── blog/             # Blog-specific components
│   ├── home/             # Homepage components
│   └── admin/            # Admin panel components
├── lib/                  # Core business logic
│   ├── firebase/         # Firebase configuration and utilities
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── constants/        # Application constants
├── content/              # Static content and data
│   ├── blog/            # Markdown blog posts
│   └── data/            # JSON data files
├── public/              # Static assets
└── __tests__/           # Test files
```

### Folder Organization Rules

1. **Components**: Each component should be in its own file
2. **Index Files**: Use index.ts for exporting multiple components
3. **Co-location**: Keep related files close (component + styles + tests)
4. **Single Responsibility**: Each file should have one primary export

---

## Code Standards

### General Principles

1. **Simplicity First**: Write simple, readable code that freshers can understand
2. **DRY (Don't Repeat Yourself)**: Extract reusable logic into functions/components
3. **KISS (Keep It Simple, Stupid)**: Avoid over-engineering
4. **YAGNI (You Aren't Gonna Need It)**: Don't add features until needed
5. **Clean Code**: Self-documenting code with meaningful names

### Naming Conventions

```typescript
// Components: PascalCase
export default function BlogCard() {}

// Functions: camelCase
function calculateReadingTime() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Types/Interfaces: PascalCase
interface BlogPost {}
type UserRole = 'admin' | 'editor';

// Variables: camelCase
const userName = 'John';
let isLoading = false;

// Private functions: _camelCase (optional)
function _privateHelper() {}

// File names:
// - Components: PascalCase (BlogCard.tsx)
// - Utilities: camelCase (utils.ts)
// - Pages: lowercase with hyphens (blog-post.tsx)
```

### File Structure

```typescript
/**
 * Component description
 *
 * @example
 * <BlogCard post={post} />
 */

// Imports - grouped and ordered
import React from 'react'; // 1. React
import { useState } from 'react'; // 2. React hooks
import Link from 'next/link'; // 3. Next.js
import { Icon } from 'lucide-react'; // 4. External libraries
import Button from '@/components/common/Button'; // 5. Internal components
import { formatDate } from '@/lib/utils'; // 6. Utilities
import type { BlogPost } from '@/lib/types'; // 7. Types

// Component definition
export default function ComponentName() {
  // Return JSX
}
```

### Comments

```typescript
// Use comments sparingly - code should be self-explanatory

// Good: Explains WHY, not WHAT
// Calculate reading time based on average reading speed of 200 WPM
const readingTime = calculateReadingTime(content);

// Bad: Explains WHAT (obvious from code)
// Get the user name
const userName = user.name;

// Use JSDoc for functions and components
/**
 * Calculate the estimated reading time for a text
 * @param text - The text content to analyze
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string): number {
  // Implementation
}
```

---

## Component Guidelines

### Component Structure

```typescript
/**
 * Component description
 */

import React from 'react';
import type { ComponentProps } from '@/lib/types';

// 1. Type definitions
interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  onClick?: () => void;
}

// 2. Component definition
export default function BlogCard({
  post,
  featured = false,
  onClick
}: BlogCardProps) {
  // 3. Hooks (always at the top)
  const [isExpanded, setIsExpanded] = useState(false);

  // 4. Derived state and computations
  const category = BLOG_CATEGORIES[post.category];

  // 5. Event handlers
  const handleClick = () => {
    onClick?.();
  };

  // 6. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 7. Early returns
  if (!post) return null;

  // 8. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Component Best Practices

1. **Keep Components Small**: Max 150 lines of code
2. **Single Responsibility**: One component = one responsibility
3. **Extract Complex Logic**: Use custom hooks or utility functions
4. **Use Composition**: Prefer composition over inheritance
5. **Props Destructuring**: Always destructure props
6. **Default Props**: Use default parameters, not defaultProps
7. **Prop Types**: Always define TypeScript interfaces for props

### Reusable Components

Create reusable components for common UI patterns:

```typescript
// Good: Reusable button component
<Button variant="primary" size="lg" onClick={handleClick}>
  Submit
</Button>

// Bad: Inline styling and logic everywhere
<button
  className="bg-blue-600 px-6 py-3 text-white rounded-lg"
  onClick={handleClick}
>
  Submit
</button>
```

---

## TypeScript Guidelines

### Type Safety

1. **Always Use Types**: Never use `any` unless absolutely necessary
2. **Explicit Return Types**: Define return types for functions
3. **Interface over Type**: Use `interface` for object shapes, `type` for unions
4. **Strict Mode**: Keep TypeScript strict mode enabled

### Type Definitions

```typescript
// Interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Types for unions and complex types
type Status = 'pending' | 'approved' | 'rejected';
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };

// Use Pick, Omit, Partial for type utilities
type UserPreview = Pick<User, 'id' | 'name'>;
type OptionalUser = Partial<User>;
```

### Avoid Type Assertions

```typescript
// Bad
const user = data as User;

// Good
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUser(data)) {
  // TypeScript knows data is User here
}
```

---

## Styling Guidelines

### Tailwind CSS Best Practices

1. **Use Tailwind Utilities**: Prefer Tailwind classes over custom CSS
2. **Component Classes**: Use `cn()` utility for conditional classes
3. **Responsive Design**: Mobile-first approach
4. **Dark Mode**: Support both light and dark themes
5. **Consistent Spacing**: Use Tailwind's spacing scale

### Class Organization

```typescript
import { cn } from '@/lib/utils';

// Good: Organized and readable
<div className={cn(
  // Layout
  'flex items-center justify-between',
  // Spacing
  'px-4 py-2',
  // Appearance
  'rounded-lg border border-gray-200',
  // Colors
  'bg-white text-gray-900',
  // Dark mode
  'dark:border-gray-800 dark:bg-gray-900 dark:text-white',
  // Conditional
  isActive && 'bg-blue-50',
  className
)}>
  Content
</div>
```

### Responsive Design

```typescript
// Mobile-first approach
<div className="
  text-sm          // Base (mobile)
  md:text-base     // Tablet
  lg:text-lg       // Desktop
">
  Responsive text
</div>

<div className="
  grid
  grid-cols-1      // Mobile: 1 column
  md:grid-cols-2   // Tablet: 2 columns
  lg:grid-cols-3   // Desktop: 3 columns
  gap-4
">
  Grid items
</div>
```

### Color System

Use consistent color palette from Tailwind:
- Primary: `blue-600`
- Secondary: `gray-600`
- Success: `green-600`
- Warning: `yellow-600`
- Danger: `red-600`

---

## State Management

### Local State

Use `useState` for component-local state:

```typescript
function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  return <div>{count}</div>;
}
```

### Server State

Use Next.js data fetching for server state:

```typescript
// Server Component (default)
async function BlogPage() {
  const posts = await getBlogPosts();
  return <PostList posts={posts} />;
}

// Client Component (when needed)
'use client';
function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return <div>{posts.map(...)}</div>;
}
```

### Context for Global State

Use React Context for theme, auth, etc.:

```typescript
// providers/ThemeProvider.tsx
'use client';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## API and Data Fetching

### Firebase Firestore

```typescript
// Good: Abstracted in utility functions
import { getBlogPosts, getBlogPostBySlug } from '@/lib/firebase/firestore';

const posts = await getBlogPosts();
const post = await getBlogPostBySlug(slug);

// Good: Error handling
try {
  const posts = await getBlogPosts();
  return posts;
} catch (error) {
  console.error('Failed to fetch posts:', error);
  return [];
}
```

### Loading States

```typescript
function Component() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;
  return <Data data={data} />;
}
```

---

## Firebase Integration

### Setup

1. Create Firebase project at console.firebase.google.com
2. Enable Firestore, Storage, and Authentication
3. Copy configuration to `.env.local`
4. Initialize Firebase in `lib/firebase/config.ts`

### Collections Structure

```
firestore/
├── posts/              # Blog posts
│   ├── {postId}
│   │   ├── id
│   │   ├── title
│   │   ├── slug
│   │   ├── content
│   │   ├── category
│   │   ├── publishedAt
│   │   └── ...
├── projects/          # Portfolio projects
├── users/            # User accounts (admin)
└── comments/         # Post comments (optional)
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, admin write
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

// Good: Use Next.js Image component
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>

// For external images
<Image
  src="https://example.com/image.jpg"
  alt="Description"
  width={800}
  height={600}
  unoptimized // If external CDN already optimizes
/>
```

### Code Splitting

```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('@/components/admin/AdminPanel'), {
  loading: () => <Loading />,
  ssr: false, // Client-side only if needed
});
```

### Memoization

```typescript
import { useMemo, useCallback } from 'react';

function Component({ items }) {
  // Memoize expensive computations
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.date - b.date);
  }, [items]);

  // Memoize callbacks
  const handleClick = useCallback(() => {
    // Handle click
  }, []);

  return <div>{sortedItems.map(...)}</div>;
}
```

---

## SEO Best Practices

### Metadata

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title',
    description: 'Page description',
  },
};
```

### Structured Data

```typescript
// Add JSON-LD structured data for better SEO
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      author: { '@type': 'Person', name: post.author },
      datePublished: post.publishedAt,
    }),
  }}
/>
```

---

## Testing Strategy

### Unit Tests

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from '@/components/common/Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

```typescript
// Test component integration
describe('BlogCard', () => {
  it('displays post information correctly', () => {
    const post = createMockPost();
    render(<BlogCard post={post} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(post.excerpt)).toBeInTheDocument();
  });
});
```

---

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical fixes

### Commit Messages

Follow conventional commits:

```
type(scope): description

feat(blog): add category filtering
fix(ui): resolve mobile navigation issue
docs(readme): update setup instructions
style(button): improve hover state
refactor(utils): simplify date formatting
test(blog): add BlogCard tests
chore(deps): update dependencies
```

### Code Review Checklist

- [ ] Code follows style guide
- [ ] TypeScript types are correct
- [ ] Components are properly tested
- [ ] No console.logs or debug code
- [ ] Responsive design works
- [ ] Dark mode supported
- [ ] Performance optimized
- [ ] SEO metadata added

---

## Deployment

### Environment Variables

Set up environment variables in your deployment platform:
- All `NEXT_PUBLIC_*` variables for Firebase
- `NEXT_PUBLIC_SITE_URL` for production URL

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to `main`

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] Firebase rules updated
- [ ] SEO metadata complete
- [ ] Performance tested
- [ ] Mobile responsive
- [ ] Dark mode working
- [ ] Images optimized
- [ ] No console errors

---

## Maintenance and Updates

### Regular Tasks

- Weekly: Review and update dependencies
- Monthly: Check performance metrics
- Quarterly: Security audit
- Yearly: Major version updates

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update to latest major versions (carefully)
npm install package@latest
```

---

## Resources and Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)

---

## Questions and Support

For questions or issues:
1. Check this documentation first
2. Review component examples in the codebase
3. Consult official documentation
4. Ask the team lead

Remember: **Simple, clean, maintainable code is better than clever code.**
