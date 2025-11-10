/**
 * useAuth Hook - React hook for Firebase Authentication
 *
 * Provides auth state and actions for components.
 * Automatically signs in users anonymously on mount.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  signInUser,
  signOutUser,
  signInWithEmail as authSignInWithEmail,
  signUpWithEmail as authSignUpWithEmail,
  getCurrentUser,
  getUserDisplayName,
  getUserId,
  onAuthChange,
  isSignedIn,
  isAuthAvailable,
  type User,
} from '../lib/auth';

interface UseAuthReturn {
  // State
  user: User | null;
  userId: string | null;
  displayName: string;
  isSignedIn: boolean;
  isLoading: boolean;
  isAvailable: boolean;
  error: string | null;

  // Actions
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<boolean>;
  refresh: () => void;
}

/**
 * useAuth - Hook for authentication
 *
 * @example
 * const { user, userId, displayName, signIn } = useAuth();
 *
 * // Auto-signed in anonymously on mount
 * console.log(userId); // "abc123xyz"
 * console.log(displayName); // "User abc123"
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const userId = user?.uid || null;
  const displayName = getUserDisplayName(user);
  const signedIn = isSignedIn();
  const available = isAuthAvailable();

  /**
   * Sign in user (anonymous)
   */
  const signIn = useCallback(async () => {
    if (!available) {
      setError('Firebase Auth not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const signedInUser = await signInUser();
      if (signedInUser) {
        setUser(signedInUser);
      } else {
        setError('Failed to sign in');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [available]);

  /**
   * Sign out user
   */
  const signOut = useCallback(async () => {
    if (!available) {
      setError('Firebase Auth not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await signOutUser();
      if (success) {
        setUser(null);
      } else {
        setError('Failed to sign out');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [available]);

  /**
   * Sign in with email and password
   */
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!available) {
      setError('Firebase Auth not available');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const signedInUser = await authSignInWithEmail(email, password);
      if (signedInUser) {
        setUser(signedInUser);
        return true;
      } else {
        setError('Failed to sign in with email');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Sign in with email error:', err);
      throw err; // Re-throw to allow caller to handle specific errors
    } finally {
      setIsLoading(false);
    }
  }, [available]);

  /**
   * Sign up with email, password, and display name
   */
  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string): Promise<boolean> => {
    if (!available) {
      setError('Firebase Auth not available');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newUser = await authSignUpWithEmail(email, password, displayName);
      if (newUser) {
        setUser(newUser);
        return true;
      } else {
        setError('Failed to create account');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Sign up with email error:', err);
      throw err; // Re-throw to allow caller to handle specific errors
    } finally {
      setIsLoading(false);
    }
  }, [available]);

  /**
   * Refresh user state
   */
  const refresh = useCallback(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  /**
   * Initial auth state check
   * Wait for onAuthStateChanged to fire instead of auto sign-in
   */
  useEffect(() => {
    if (!available) {
      setIsLoading(false);
      return;
    }

    // Just check current user, don't auto sign-in
    // Let onAuthStateChanged listener handle the state
    const currentUser = getCurrentUser();
    if (currentUser) {
      console.log('🔍 Current user on mount:', {
        uid: currentUser.uid,
        email: currentUser.email,
        isAnonymous: currentUser.isAnonymous,
        displayName: currentUser.displayName,
      });
    } else {
      console.log('👤 No user on mount, waiting for auth state...');
    }
  }, [available]);

  /**
   * Listen for auth state changes
   * This is the ONLY place that should trigger anonymous sign-in
   */
  useEffect(() => {
    if (!available) return;

    let hasInitialized = false;

    const unsubscribe = onAuthChange((authUser) => {
      console.log('🔔 Auth state changed:', {
        uid: authUser?.uid,
        email: authUser?.email,
        isAnonymous: authUser?.isAnonymous,
      });

      if (authUser) {
        // User exists (either email or anonymous)
        setUser(authUser);
        setIsLoading(false);
        hasInitialized = true;
      } else if (!hasInitialized) {
        // No user AND first time: sign in anonymously
        console.log('👤 No user found, signing in anonymously...');
        hasInitialized = true;
        signInUser().then((user) => {
          if (user) {
            setUser(user);
          }
          setIsLoading(false);
        });
      } else {
        // User signed out manually
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [available]);

  return {
    // State
    user,
    userId,
    displayName,
    isSignedIn: signedIn,
    isLoading,
    isAvailable: available,
    error,

    // Actions
    signIn,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    refresh,
  };
}
