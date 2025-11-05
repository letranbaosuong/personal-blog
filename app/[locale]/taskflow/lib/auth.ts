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

    console.log('User signed in anonymously:', currentUser.uid);
    return currentUser;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
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

// Export type for external use
export type { User };
