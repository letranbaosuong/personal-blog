# TaskFlow Authentication Guide

Complete guide for Firebase Anonymous Authentication in TaskFlow.

## Overview

TaskFlow uses **Firebase Anonymous Authentication** to:
- Track ownership of shared items (tasks, projects, contacts)
- Enable collaborative features without requiring user registration
- Provide a seamless user experience

## Architecture

### Components

1. **Auth Service** (`lib/auth.ts`)
   - Core authentication functions
   - User session management
   - Firebase Auth integration

2. **useAuth Hook** (`hooks/useAuth.ts`)
   - React hook for auth state
   - Auto sign-in on mount
   - Sign in/out actions

3. **UserProfile Component** (`components/UserProfile.tsx`)
   - User avatar display
   - Profile dropdown menu
   - Sign out button

4. **AuthErrorBanner** (`components/AuthErrorBanner.tsx`)
   - Error handling UI
   - Setup instructions
   - Dismissible banner

## Setup Instructions

### 1. Enable Anonymous Auth in Firebase

**Step 1:** Go to [Firebase Console](https://console.firebase.google.com/)

**Step 2:** Select your project

**Step 3:** Navigate to: **Build → Authentication → Sign-in method**

**Step 4:** Enable "Anonymous" sign-in provider

**Step 5:** Click "Save"

### 2. Configure Environment Variables

Ensure `.env.local` has Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

## Usage

### Auto Sign-In

Users are automatically signed in when TaskFlow loads:

```typescript
// In TaskFlowClient.tsx
const { user, userId, displayName, isLoading } = useAuth();

// User is automatically authenticated
console.log(userId); // "abc123xyz456"
console.log(displayName); // "User abc123"
```

### User Profile Display

The UserProfile component shows in the sidebar footer:

```typescript
import { UserProfile } from './components/UserProfile';

// Compact mode (just avatar)
<UserProfile compact />

// Full mode (avatar + name)
<UserProfile />
```

### Manual Sign Out

Users can sign out from the UserProfile dropdown:

```typescript
const { signOut } = useAuth();

// Sign out
await signOut();

// Page will reload and re-authenticate
```

### Get User Info

```typescript
import { getUserDisplayName, getUserId, getUserInitials } from './lib/auth';

const displayName = getUserDisplayName(); // "User abc123"
const userId = getUserId(); // "abc123xyz456"
const initials = getUserInitials(); // "UA"
```

## Components API

### useAuth Hook

```typescript
interface UseAuthReturn {
  // State
  user: User | null;              // Firebase user object
  userId: string | null;          // User ID
  displayName: string;            // Display name
  isSignedIn: boolean;            // Auth status
  isLoading: boolean;             // Loading state
  isAvailable: boolean;           // Firebase Auth available
  error: string | null;           // Error message

  // Actions
  signIn: () => Promise<void>;    // Sign in anonymously
  signOut: () => Promise<void>;   // Sign out
  refresh: () => void;            // Refresh user state
}
```

### UserProfile Component

```typescript
interface UserProfileProps {
  className?: string;  // Custom CSS classes
  compact?: boolean;   // Compact mode (avatar only)
}

<UserProfile compact />  // Avatar only
<UserProfile />          // Avatar + name + dropdown
```

### Auth Service Functions

```typescript
// Sign in
const user = await signInUser();

// Sign out
const success = await signOutUser();

// Get current user
const user = getCurrentUser();

// Get user info
const displayName = getUserDisplayName(user);
const userId = getUserId();
const initials = getUserInitials(user);

// Check status
const signedIn = isSignedIn();
const available = isAuthAvailable();

// Listen for auth changes
const unsubscribe = onAuthChange((user) => {
  console.log('Auth state changed:', user);
});
```

## Features

### 1. Anonymous Authentication
- No email/password required
- Automatic sign-in on app load
- Persistent session (until sign out)

### 2. User Display
- Avatar with initials (gradient background)
- User ID display (first 8 characters)
- "Anonymous User" label

### 3. Profile Dropdown
- User information display
- Quick stats (ID, auth type)
- Sign out button

### 4. Error Handling
- AuthErrorBanner for setup errors
- Helpful error messages
- Links to setup guides

## User Flow

```
1. User opens TaskFlow
   ↓
2. useAuth hook initializes
   ↓
3. Check if already signed in
   ↓
4. If not → Sign in anonymously
   ↓
5. User authenticated
   ↓
6. UserProfile displays in sidebar
   ↓
7. User can:
   - View profile info
   - Sign out
   - Create/share items
```

## Sharing Integration

### Track Ownership

When sharing items, authentication provides:

```typescript
// In shareService.ts
const userId = getUserId() || 'anonymous';
const userName = getUserDisplayName();

const sharedData = {
  data: item,
  createdBy: userId,        // "abc123xyz456"
  createdByName: userName,  // "User abc123"
  // ...
};
```

### Collaborative Editing

- Each edit tracked with user ID
- Real-time updates show who made changes
- Permission management based on user ID

## Security Considerations

### Anonymous Auth Limitations

1. **No Email/Password**
   - Users can't recover lost sessions
   - Data tied to anonymous UID

2. **Session Management**
   - Sign out = lose all data
   - New sign-in = new UID

3. **Recommendations**
   - Save important data locally
   - Export shared links before signing out
   - Use Firebase persistence for convenience

### Security Rules

Configure Firebase Realtime Database rules:

```json
{
  "rules": {
    "shared": {
      ".read": true,
      ".write": "auth != null",
      "$shareCode": {
        ".validate": "newData.child('createdBy').val() === auth.uid"
      }
    }
  }
}
```

## Troubleshooting

### Auth Error: admin-restricted-operation

**Problem:** Anonymous auth not enabled in Firebase

**Solution:** Enable in Firebase Console → Authentication → Sign-in method

See `FIREBASE_AUTH_SETUP.md` for detailed steps.

### User Not Auto-Signing In

**Check:**
1. Firebase config in `.env.local`
2. Firebase project active
3. Browser console for errors
4. Network connection

### Sign Out Not Working

**Check:**
1. Console for errors
2. Firebase Auth available
3. Try hard refresh (Ctrl+Shift+R)

## Best Practices

### 1. Always Check Auth Status

```typescript
const { isSignedIn, isAvailable } = useAuth();

if (!isAvailable) {
  return <div>Firebase not configured</div>;
}

if (!isSignedIn) {
  return <div>Signing in...</div>;
}
```

### 2. Handle Loading States

```typescript
const { isLoading } = useAuth();

if (isLoading) {
  return <LoadingSpinner />;
}
```

### 3. Error Boundaries

```typescript
const { error } = useAuth();

if (error) {
  return <AuthErrorBanner error={error} />;
}
```

### 4. Cleanup Listeners

```typescript
useEffect(() => {
  const unsubscribe = onAuthChange((user) => {
    // Handle auth changes
  });

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, []);
```

## Testing

### Test Sign In

```typescript
// In browser console
const user = await signInUser();
console.log('User:', user);
```

### Test Sign Out

```typescript
// In browser console
const success = await signOutUser();
console.log('Signed out:', success);
```

### Test User Info

```typescript
console.log('Display name:', getUserDisplayName());
console.log('User ID:', getUserId());
console.log('Initials:', getUserInitials());
console.log('Signed in:', isSignedIn());
```

## Migration Guide

### From No Auth to Anonymous Auth

1. Enable Anonymous Auth in Firebase
2. Update components to use useAuth
3. Add UserProfile to UI
4. Test auth flow
5. Update share service to use user IDs

### Future: Add Email Auth

To add email/password authentication later:

1. Enable Email auth in Firebase
2. Create SignInForm component
3. Add email sign-in to auth service
4. Update UserProfile for email users
5. Migrate anonymous users (link accounts)

## Resources

- [Firebase Anonymous Auth Docs](https://firebase.google.com/docs/auth/web/anonymous-auth)
- [FIREBASE_AUTH_SETUP.md](./FIREBASE_AUTH_SETUP.md)
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## Support

If you encounter issues:
1. Check Firebase Console for errors
2. Review browser console logs
3. Verify environment variables
4. Test with Firebase Emulator
5. Check `AuthErrorBanner` messages

---

**Authentication is ready!** 🎉

Users will be automatically signed in and can start using TaskFlow's collaborative features.
