# Personal Blog & Portfolio Website

A modern, responsive personal blog and portfolio website built with Next.js 15, TypeScript, and Firebase. Perfect for showcasing your professional experience, skills, and sharing your thoughts through blog posts.

## Features

### Core Features
- Modern, clean, and professional design
- Fully responsive (mobile, tablet, desktop)
- Dark/Light mode theme toggle
- SEO optimized with metadata
- Fast performance and optimized loading

### Blog Features
- Multiple blog categories (Technology, Health, Calisthenics, Guitar, etc.)
- Category filtering
- Search functionality
- Markdown support with syntax highlighting
- Reading time estimation
- Featured posts

### Portfolio Features
- Professional CV/About section
- Work experience showcase
- Education history
- Skills and technologies display
- Project portfolio with live demos and GitHub links

### Technical Features
- Firebase integration for content management
- Image optimization with Next.js Image
- TypeScript for type safety
- Clean architecture
- Reusable components
- Easy to maintain and extend

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Markdown**: react-markdown with syntax highlighting
- **Icons**: Lucide React
- **Theme**: next-themes
- **Package Manager**: npm

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18.x or higher
- npm 9.x or higher
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/personal-blog.git
cd personal-blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Firebase configuration:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Follow the setup wizard
4. Choose a plan (Spark/Free plan is sufficient to start)

### Step 2: Enable Services

In your Firebase project, enable:

1. **Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Choose production mode
   - Select a location

2. **Storage**
   - Go to Storage
   - Click "Get started"
   - Accept the default rules (we'll update them later)

3. **Authentication** (Optional, for admin panel)
   - Go to Authentication
   - Click "Get started"
   - Enable Email/Password sign-in method

### Step 3: Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app
5. Copy the Firebase configuration
6. Add it to your `.env.local` file

### Step 4: Set Up Firestore Collections

Create these collections in Firestore:

1. **posts**
   - Used for blog posts
   - Structure:
     ```javascript
     {
       id: string,
       title: string,
       slug: string,
       excerpt: string,
       content: string,
       category: string,
       tags: array,
       coverImage: string,
       publishedAt: timestamp,
       updatedAt: timestamp,
       readingTime: number,
       featured: boolean,
       published: boolean
     }
     ```

2. **projects**
   - Used for portfolio projects
   - Structure:
     ```javascript
     {
       id: string,
       title: string,
       description: string,
       technologies: array,
       imageUrl: string,
       demoUrl: string,
       githubUrl: string,
       featured: boolean,
       status: string
     }
     ```

### Step 5: Configure Security Rules

Update Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts - public read, admin write
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     request.auth.token.admin == true;
    }

    // Projects - public read, admin write
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     request.auth.token.admin == true;
    }
  }
}
```

Update Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blog-images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     request.auth.token.admin == true;
    }
    match /project-images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     request.auth.token.admin == true;
    }
  }
}
```

## Customization

### 1. Update Site Configuration

Edit `lib/constants/index.ts`:

```typescript
export const SITE_CONFIG = {
  name: 'Your Name',
  title: 'Your Name - Full Stack Developer',
  description: 'Your description here',
  url: 'https://yourdomain.com',
  author: 'Your Name',
  email: 'your.email@example.com',
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://twitter.com/yourusername',
  },
};
```

### 2. Update Personal Information

Edit the following files with your information:
- `app/page.tsx` - Homepage content
- `app/about/page.tsx` - About/CV information
- `app/contact/page.tsx` - Contact information
- `components/layout/Footer.tsx` - Footer content

### 3. Add Your Profile Image

Replace the placeholder in `app/page.tsx` with your actual image:

```typescript
<Image
  src="/images/profile.jpg"  // Add your image to public/images/
  alt="Your Name"
  fill
  className="object-cover"
/>
```

### 4. Customize Blog Categories

Edit `lib/constants/index.ts` to add or modify blog categories:

```typescript
export const BLOG_CATEGORIES = {
  technology: {
    label: 'Technology',
    description: 'Your description',
    color: 'blue',
    icon: 'code',
  },
  // Add more categories
};
```

## Project Structure

```
personal-blog/
├── app/                      # Next.js App Router
│   ├── about/               # About page
│   ├── blog/                # Blog pages
│   │   ├── [slug]/         # Individual blog post
│   │   └── page.tsx        # Blog listing
│   ├── contact/            # Contact page
│   ├── projects/           # Projects page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── common/             # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── blog/               # Blog components
│       ├── BlogCard.tsx
│       ├── CategoryFilter.tsx
│       └── MarkdownRenderer.tsx
├── lib/                     # Core logic
│   ├── firebase/           # Firebase utilities
│   │   ├── config.ts
│   │   ├── firestore.ts
│   │   └── storage.ts
│   ├── utils/              # Utility functions
│   │   └── index.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   └── constants/          # Constants
│       └── index.ts
├── public/                  # Static assets
│   └── images/             # Images
├── rules.md                 # Development guidelines
├── README.md               # This file
└── package.json            # Dependencies
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Creating Content

### Adding a Blog Post (via Firebase Console)

1. Go to Firestore Database in Firebase Console
2. Select the `posts` collection
3. Click "Add document"
4. Fill in the fields:
   - **id**: Auto-generate or custom
   - **title**: Your post title
   - **slug**: URL-friendly version (e.g., "my-first-post")
   - **excerpt**: Short description
   - **content**: Full markdown content
   - **category**: One of: technology, health, calisthenics, guitar, lifestyle, other
   - **tags**: Array of tags
   - **coverImage**: URL to cover image (upload to Storage first)
   - **publishedAt**: Timestamp
   - **readingTime**: Number (minutes)
   - **featured**: Boolean
   - **published**: Boolean
5. Save the document

### Uploading Images

1. Go to Storage in Firebase Console
2. Create folders: `blog-images`, `project-images`
3. Upload your images
4. Copy the download URL
5. Use the URL in your Firestore documents

### Adding a Project

Similar process in the `projects` collection with project-specific fields.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables from your `.env.local`
7. Click "Deploy"

Your site will be live at `https://your-project.vercel.app`

### Custom Domain

After deployment:
1. Go to your deployment settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` in environment variables

## Performance Optimization

The site is optimized for performance:

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Dynamic imports for large components
- **CSS Optimization**: Tailwind CSS with PurgeCSS
- **Font Optimization**: Next.js Font optimization
- **Caching**: Static generation and ISR where possible

## SEO Features

- Metadata configuration for all pages
- Open Graph tags for social sharing
- Twitter Card support
- Semantic HTML structure
- Sitemap generation capability
- Robots.txt configuration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Firebase Connection Issues

- Check environment variables are correct
- Verify Firebase project is active
- Check Firebase billing status
- Review security rules

### Styling Issues

- Clear browser cache
- Check Tailwind configuration
- Verify dark mode classes

## Contributing

This is a personal project, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the [rules.md](rules.md) for development guidelines
- Review component examples in the codebase
- Check Next.js and Firebase documentation

## Roadmap

Future enhancements:
- [ ] Admin panel for content management
- [ ] Comments system
- [ ] Newsletter subscription
- [ ] Search with Algolia
- [ ] Analytics integration
- [ ] RSS feed
- [ ] i18n support (multiple languages)
- [ ] Progressive Web App (PWA)

## Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Firebase](https://firebase.google.com) - Backend as a service
- [Lucide](https://lucide.dev) - Beautiful icons
- [shadcn/ui](https://ui.shadcn.com) - Component inspiration

---

Built with passion using Next.js and TypeScript

**Happy coding!**
