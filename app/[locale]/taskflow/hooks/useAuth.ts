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
   * Refresh user state
   */
  const refresh = useCallback(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  /**
   * Auto sign-in on mount
   */
  useEffect(() => {
    if (!available) {
      setIsLoading(false);
      return;
    }

    // Check if already signed in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoading(false);
      return;
    }

    // Sign in anonymously
    signIn();
  }, [available, signIn]);

  /**
   * Listen for auth state changes
   */
  useEffect(() => {
    if (!available) return;

    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setIsLoading(false);
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
    refresh,
  };
}
