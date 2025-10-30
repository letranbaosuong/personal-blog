# Firebase Setup Guide

Complete guide to setting up Firebase for your Personal Blog & Portfolio website.

## Table of Contents
1. [Create Firebase Project](#create-firebase-project)
2. [Enable Required Services](#enable-required-services)
3. [Configure Authentication](#configure-authentication)
4. [Set Up Firestore Database](#set-up-firestore-database)
5. [Configure Storage](#configure-storage)
6. [Get Firebase Configuration](#get-firebase-configuration)
7. [Set Up Environment Variables](#set-up-environment-variables)
8. [Security Rules](#security-rules)
9. [Create Initial Data](#create-initial-data)

---

## Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" or "Create a project"
3. Enter your project name (e.g., "personal-blog")
4. Click "Continue"
5. Enable or disable Google Analytics (optional, recommended)
6. If enabled, select or create a Google Analytics account
7. Click "Create Project"
8. Wait for the project to be created
9. Click "Continue" to go to your project

---

## Enable Required Services

### Firestore Database

1. In the left sidebar, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (we'll update rules later)
4. Select a location (choose the one closest to your users)
   - For USA: `us-central1` or `us-east1`
   - For Europe: `europe-west1`
   - For Asia: `asia-south1`
5. Click "Enable"
6. Wait for the database to be created

### Storage

1. In the left sidebar, click "Storage"
2. Click "Get started"
3. Review the security rules
4. Click "Next"
5. Select the same location as your Firestore database
6. Click "Done"

### Authentication (Optional for Admin Panel)

1. In the left sidebar, click "Authentication"
2. Click "Get started"
3. Click on "Email/Password" in the Sign-in providers
4. Toggle "Enable" to on
5. Click "Save"

---

## Configure Authentication

### Create Admin User

1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password for admin
4. Click "Add user"

### Set Admin Custom Claims (Optional)

To set admin privileges, use Firebase CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Set admin claim
firebase functions:shell
admin.auth().setCustomUserClaims('USER_UID', { admin: true })
```

Or create a Cloud Function to set claims.

---

## Set Up Firestore Database

### Create Collections

#### Posts Collection

1. Click "Start collection"
2. Collection ID: `posts`
3. Click "Next"
4. Add a sample document:
   - Document ID: Auto-generate
   - Fields:
     ```
     title: (string) "My First Blog Post"
     slug: (string) "my-first-blog-post"
     excerpt: (string) "This is a short description"
     content: (string) "# My First Post\n\nThis is the content..."
     category: (string) "technology"
     tags: (array) ["tech", "web"]
     coverImage: (string) ""
     publishedAt: (timestamp) Now
     updatedAt: (timestamp) Now
     readingTime: (number) 5
     featured: (boolean) true
     published: (boolean) true
     ```
5. Click "Save"

#### Projects Collection

1. Click "Start collection"
2. Collection ID: `projects`
3. Add a sample document:
   - Document ID: Auto-generate
   - Fields:
     ```
     title: (string) "Sample Project"
     description: (string) "Full description..."
     shortDescription: (string) "Brief description"
     technologies: (array) ["React", "Next.js"]
     imageUrl: (string) ""
     demoUrl: (string) "https://demo.example.com"
     githubUrl: (string) "https://github.com/user/project"
     featured: (boolean) true
     startDate: (timestamp) Now
     endDate: (timestamp) Now or null
     status: (string) "completed"
     ```
4. Click "Save"

### Firestore Indexes

If you need composite queries, create indexes:

1. Go to Firestore Database > Indexes
2. Click "Create index"
3. Configure based on your query needs
4. Most single-field queries work automatically

---

## Configure Storage

### Create Folders

In Firebase Storage, create these folders:
- `blog-images/` - For blog post cover images
- `project-images/` - For project screenshots
- `profile/` - For profile pictures

### Upload Test Images

1. Click on a folder
2. Click "Upload file"
3. Select an image
4. Copy the download URL for use in Firestore

---

## Get Firebase Configuration

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register your app:
   - App nickname: "Personal Blog"
   - Firebase Hosting: No (optional)
6. Click "Register app"
7. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## Set Up Environment Variables

1. In your project root, create `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your Firebase config:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Save the file
4. Restart your development server

---

## Security Rules

### Firestore Security Rules

1. Go to Firestore Database > Rules
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.admin == true;
    }

    // Posts Collection
    match /posts/{postId} {
      // Anyone can read published posts
      allow read: if resource.data.published == true;

      // Only admins can read unpublished posts
      allow read: if isAdmin();

      // Only admins can create, update, delete
      allow create, update, delete: if isAdmin();
    }

    // Projects Collection
    match /projects/{projectId} {
      // Anyone can read
      allow read: if true;

      // Only admins can write
      allow create, update, delete: if isAdmin();
    }

    // Comments Collection (if you add it later)
    match /comments/{commentId} {
      // Anyone can read
      allow read: if true;

      // Authenticated users can create
      allow create: if request.auth != null;

      // Only comment author or admin can update/delete
      allow update, delete: if request.auth != null &&
        (request.auth.uid == resource.data.authorId || isAdmin());
    }

    // Users Collection (if you add it later)
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null &&
                    request.auth.uid == userId;

      // Users can update their own data
      allow update: if request.auth != null &&
                      request.auth.uid == userId;

      // Admins can read/write all user data
      allow read, write: if isAdmin();
    }
  }
}
```

3. Click "Publish"

### Storage Security Rules

1. Go to Storage > Rules
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.admin == true;
    }

    // Blog images
    match /blog-images/{imageId} {
      // Anyone can read
      allow read: if true;

      // Only admins can upload/delete
      allow write, delete: if isAdmin();
    }

    // Project images
    match /project-images/{imageId} {
      // Anyone can read
      allow read: if true;

      // Only admins can upload/delete
      allow write, delete: if isAdmin();
    }

    // Profile images
    match /profile/{imageId} {
      // Anyone can read
      allow read: if true;

      // Only admins can upload/delete
      allow write, delete: if isAdmin();
    }

    // User uploads (if you add user-generated content)
    match /user-uploads/{userId}/{allPaths=**} {
      // User can read their own uploads
      allow read: if request.auth != null &&
                    request.auth.uid == userId;

      // User can upload to their own folder
      allow write: if request.auth != null &&
                     request.auth.uid == userId;

      // Admins can read/write all
      allow read, write: if isAdmin();
    }
  }
}
```

3. Click "Publish"

---

## Create Initial Data

### Add Blog Posts

Use the Firestore console or create a script:

```typescript
// scripts/seed-data.ts
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const samplePosts = [
  {
    title: 'Getting Started with Next.js',
    slug: 'getting-started-nextjs',
    excerpt: 'Learn the basics of Next.js',
    content: '# Getting Started\n\nNext.js is amazing...',
    category: 'technology',
    tags: ['nextjs', 'react', 'web'],
    coverImage: 'https://...',
    publishedAt: new Date(),
    updatedAt: new Date(),
    readingTime: 5,
    featured: true,
    published: true,
  },
  // Add more posts...
];

async function seedPosts() {
  for (const post of samplePosts) {
    await addDoc(collection(db, 'posts'), post);
  }
}

seedPosts();
```

### Upload Images

1. Prepare your images (optimize them first)
2. Go to Storage in Firebase Console
3. Navigate to the appropriate folder
4. Click "Upload file"
5. Select your image
6. After upload, click on the file
7. Copy the download URL
8. Use this URL in your Firestore documents

---

## Verification

### Test Firestore Connection

```typescript
// Test in your app
import { getBlogPosts } from '@/lib/firebase/firestore';

const posts = await getBlogPosts();
console.log(posts);
```

### Test Storage

```typescript
// Test image upload
import { uploadImage } from '@/lib/firebase/storage';

const url = await uploadImage(file, 'blog-images/test.jpg');
console.log(url);
```

### Test Authentication

```typescript
// Test admin login
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

const result = await signInWithEmailAndPassword(
  auth,
  'admin@example.com',
  'password'
);
```

---

## Troubleshooting

### Permission Denied Errors

- Check security rules
- Verify user is authenticated (if required)
- Check admin custom claims

### Images Not Loading

- Check CORS settings in Storage
- Verify storage rules allow read access
- Check image URLs are correct

### Connection Issues

- Verify environment variables are correct
- Check Firebase project is active
- Review billing status (free tier limits)

### Build Errors

- Ensure all environment variables are set
- Check Firebase SDK versions compatibility
- Clear `.next` folder and rebuild

---

## Production Checklist

Before deploying to production:

- [ ] Update security rules for production
- [ ] Set up proper indexes for queries
- [ ] Configure CORS for Storage
- [ ] Set up billing alerts
- [ ] Enable Firebase App Check (recommended)
- [ ] Set up monitoring and logging
- [ ] Create backup strategy
- [ ] Document admin procedures
- [ ] Test all CRUD operations
- [ ] Verify authentication flows

---

## Useful Firebase CLI Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# View logs
firebase functions:log

# Backup Firestore
firebase firestore:export gs://your-bucket/backups

# Import Firestore
firebase firestore:import gs://your-bucket/backups
```

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

## Support

If you encounter issues:
1. Check the [Firebase Status](https://status.firebase.google.com)
2. Review the [troubleshooting](#troubleshooting) section
3. Check Firebase Console for error messages
4. Review security rules carefully
5. Test with Firebase Emulator Suite locally

---

**Good luck with your Firebase setup!**
