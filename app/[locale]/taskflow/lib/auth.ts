/**
 * Firebase Authentication Service
 *
 * Provides simple anonymous authentication for TaskFlow sharing.
 * Users are automatically signed in anonymously when they open the app.
 * This enables tracking who created/edited shared items without requiring registration.
 */

import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { getFirebaseApp } from './firebase';

let auth: Auth | null = null;
let currentUser: User | null = null;

/**
 * Initialize Firebase Auth
 * Returns null if Firebase is not configured
 */
export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering guard
  }

  try {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) {
      console.warn('Firebase app not initialized. Auth unavailable.');
      return null;
    }

    if (!auth) {
      auth = getAuth(firebaseApp);
    }
    return auth;
  } catch (error) {
    console.error('Firebase Auth initialization error:', error);
    return null;
  }
};

/**
 * Sign in user anonymously
 * This is called automatically when app loads
 */
export const signInUser = async (): Promise<User | null> => {
  try {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      console.warn('Firebase Auth not available');
      return null;
    }

    // Check if already signed in
    if (firebaseAuth.currentUser) {
      currentUser = firebaseAuth.currentUser;
      return currentUser;
    }

    // Sign in anonymously
    const userCredential = await signInAnonymously(firebaseAuth);
    currentUser = userCredential.user;

    console.log('✅ User signed in anonymously:', currentUser.uid);
    return currentUser;
  } catch (error: any) {
    // Handle specific Firebase Auth errors
    const errorCode = error?.code;
    const errorMessage = error?.message;

    if (errorCode === 'auth/admin-restricted-operation') {
      console.error('❌ Firebase Anonymous Auth not enabled!');
      console.error('📝 Please enable Anonymous Authentication in Firebase Console:');
      console.error('   1. Go to: https://console.firebase.google.com/');
      console.error('   2. Select your project');
      console.error('   3. Build → Authentication → Sign-in method');
      console.error('   4. Enable "Anonymous" sign-in');
      console.error('   5. Refresh this page');
      console.error('');
      console.error('📚 See FIREBASE_AUTH_SETUP.md for detailed steps');
    } else {
      console.error('Error signing in anonymously:', errorMessage || error);
    }

    return null;
  }
};

/**
 * Get current signed-in user
 */
export const getCurrentUser = (): User | null => {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) return null;

  return firebaseAuth.currentUser || currentUser;
};

/**
 * Get user display name
 * Returns "Anonymous User" if no display name set
 */
export const getUserDisplayName = (user: User | null = null): string => {
  const u = user || getCurrentUser();
  if (!u) return 'Anonymous User';

  return u.displayName || `User ${u.uid.substring(0, 6)}`;
};

/**
 * Get user ID
 * Returns null if not signed in
 */
export const getUserId = (): string | null => {
  const user = getCurrentUser();
  return user?.uid || null;
};

/**
 * Listen for auth state changes
 * Callback is called when user signs in/out
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) | null => {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    return null;
  }

  const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
    currentUser = user;
    callback(user);
  });

  return unsubscribe;
};

/**
 * Check if user is signed in
 */
export const isSignedIn = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Check if auth is available
 */
export const isAuthAvailable = (): boolean => {
  return getFirebaseAuth() !== null;
};

/**
 * Sign in with email and password
 * Returns user if successful, null if failed
 */
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      throw new Error('Firebase Auth not available');
    }

    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    currentUser = userCredential.user;

    console.log('✅ User signed in with email:', currentUser.email);
    return currentUser;
  } catch (error: any) {
    const errorCode = error?.code;
    const errorMessage = error?.message;

    // Handle specific errors
    if (errorCode === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check and try again.');
    } else if (errorCode === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    } else if (errorCode === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (errorCode === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (errorCode === 'auth/user-disabled') {
      throw new Error('This account has been disabled');
    } else if (errorCode === 'auth/operation-not-allowed') {
      console.error('❌ Email/Password Authentication not enabled!');
      console.error('📝 Please enable Email/Password Authentication in Firebase Console:');
      console.error('   1. Go to: https://console.firebase.google.com/');
      console.error('   2. Select your project');
      console.error('   3. Build → Authentication → Sign-in method');
      console.error('   4. Enable "Email/Password" sign-in');
      console.error('   5. Refresh this page');
      throw new Error('Email/Password authentication is not enabled. Please contact support.');
    } else if (errorCode === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later.');
    } else {
      throw new Error(errorMessage || 'Failed to sign in');
    }
  }
};

/**
 * Create new user with email and password
 * Returns user if successful, throws error if failed
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User | null> => {
  try {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      throw new Error('Firebase Auth not available');
    }

    // Create user
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    currentUser = userCredential.user;

    // Update display name
    await updateProfile(currentUser, { displayName });

    console.log('✅ User created successfully:', currentUser.email);
    return currentUser;
  } catch (error: any) {
    const errorCode = error?.code;
    const errorMessage = error?.message;

    // Handle specific errors
    if (errorCode === 'auth/email-already-in-use') {
      throw new Error('Email already in use. Please sign in instead.');
    } else if (errorCode === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else if (errorCode === 'auth/weak-password') {
      throw new Error('Password is too weak. Use at least 6 characters.');
    } else if (errorCode === 'auth/operation-not-allowed') {
      console.error('❌ Email/Password Authentication not enabled!');
      console.error('📝 Please enable Email/Password Authentication in Firebase Console:');
      console.error('   1. Go to: https://console.firebase.google.com/');
      console.error('   2. Select your project');
      console.error('   3. Build → Authentication → Sign-in method');
      console.error('   4. Enable "Email/Password" sign-in');
      console.error('   5. Refresh this page');
      throw new Error('Email/Password authentication is not enabled. Please contact support.');
    } else {
      throw new Error(errorMessage || 'Failed to create account');
    }
  }
};

/**
 * Sign out current user
 * Clears the current user session
 */
export const signOutUser = async (): Promise<boolean> => {
  try {
    const firebaseAuth = getFirebaseAuth();
    if (!firebaseAuth) {
      console.warn('Firebase Auth not available');
      return false;
    }

    await signOut(firebaseAuth);
    currentUser = null;

    console.log('✅ User signed out successfully');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};

/**
 * Get user avatar URL
 * Returns initials-based placeholder if no photo
 */
export const getUserAvatar = (user: User | null = null): string | null => {
  const u = user || getCurrentUser();
  return u?.photoURL || null;
};

/**
 * Get user initials for avatar placeholder
 */
export const getUserInitials = (user: User | null = null): string => {
  const u = user || getCurrentUser();
  if (!u) return '?';

  const displayName = getUserDisplayName(u);
  return displayName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Export type for external use
export type { User };
