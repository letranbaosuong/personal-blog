/**
 * UserProfile Component
 *
 * Displays user authentication status and profile information
 * Shows avatar/initials, user name, and sign out option
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, UserCircle2, Loader2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../hooks/useAuth';
import { signOutUser, getUserInitials } from '../lib/auth';
import { disableFirestoreSync } from '../lib/firestore-sync';
import { SignInDialog } from './SignInDialog';

interface UserProfileProps {
  className?: string;
  compact?: boolean;
}

export const UserProfile = ({ className, compact = false }: UserProfileProps) => {
  const { user, displayName, isSignedIn, isLoading, isAvailable, signInWithEmail, signUpWithEmail } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is anonymous or has email
  const isAnonymous = user?.isAnonymous ?? true;
  const userEmail = user?.email;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle sign out
  const handleSignOut = async () => {
    console.log('🚪 Sign out button clicked!');
    setIsSigningOut(true);
    try {
      // Disable Firestore sync (cleanup listeners and remove flag)
      disableFirestoreSync();

      // Sign out
      const success = await signOutUser();
      console.log('🚪 Sign out result:', success);
      if (success) {
        setIsOpen(false);
        console.log('🚪 Reloading page...');
        // Page will auto-refresh and re-authenticate as anonymous
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Handle open sign in dialog
  const handleOpenSignInDialog = () => {
    console.log('📧 Opening sign in dialog');
    setIsOpen(false); // Close dropdown
    setIsSignInDialogOpen(true);
  };

  // Handle sign in with email
  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    console.log('📧 Signing in with email:', email);

    // Save localStorage data BEFORE signing out anonymous user
    const tasksBeforeSignOut = localStorage.getItem('taskflow_tasks');
    const projectsBeforeSignOut = localStorage.getItem('taskflow_projects');
    const contactsBeforeSignOut = localStorage.getItem('taskflow_contacts');

    // Sign out anonymous user first to avoid conflicts
    if (user?.isAnonymous) {
      console.log('🚪 Signing out anonymous user first...');
      await signOutUser();
    }

    // Restore localStorage data after sign out
    if (tasksBeforeSignOut) localStorage.setItem('taskflow_tasks', tasksBeforeSignOut);
    if (projectsBeforeSignOut) localStorage.setItem('taskflow_projects', projectsBeforeSignOut);
    if (contactsBeforeSignOut) localStorage.setItem('taskflow_contacts', contactsBeforeSignOut);

    try {
      const success = await signInWithEmail(email, password);
      console.log('✅ Sign in success:', success);
      return success;
    } catch (error) {
      console.error('❌ Sign in failed:', error);
      throw error; // Let SignInDialog handle the error
    }
  };

  // Handle sign up with email
  const handleSignUp = async (email: string, password: string, displayName: string): Promise<boolean> => {
    console.log('📧 Creating account with email:', email, 'name:', displayName);

    // Save localStorage data BEFORE signing out anonymous user
    const tasksBeforeSignOut = localStorage.getItem('taskflow_tasks');
    const projectsBeforeSignOut = localStorage.getItem('taskflow_projects');
    const contactsBeforeSignOut = localStorage.getItem('taskflow_contacts');

    // Sign out anonymous user first to avoid conflicts
    if (user?.isAnonymous) {
      console.log('🚪 Signing out anonymous user first...');
      await signOutUser();
    }

    // Restore localStorage data after sign out
    if (tasksBeforeSignOut) localStorage.setItem('taskflow_tasks', tasksBeforeSignOut);
    if (projectsBeforeSignOut) localStorage.setItem('taskflow_projects', projectsBeforeSignOut);
    if (contactsBeforeSignOut) localStorage.setItem('taskflow_contacts', contactsBeforeSignOut);

    try {
      const success = await signUpWithEmail(email, password, displayName);
      console.log('✅ Sign up success:', success);
      return success;
    } catch (error) {
      console.error('❌ Sign up failed:', error);
      throw error; // Let SignInDialog handle the error
    }
  };

  // Don't show if auth is not available
  if (!isAvailable) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  // Not signed in state
  if (!isSignedIn || !user) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800',
          className
        )}
      >
        <UserCircle2 className="h-5 w-5 text-slate-400" />
        {!compact && (
          <span className="text-sm text-slate-500 dark:text-slate-400">Not signed in</span>
        )}
      </div>
    );
  }

  // Get user initials for avatar
  const initials = getUserInitials(user);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => {
          console.log('🔍 Avatar clicked! Current isOpen:', isOpen);
          setIsOpen(!isOpen);
          console.log('🔍 New isOpen will be:', !isOpen);
        }}
        className={cn(
          'flex items-center gap-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700',
          compact ? 'p-1.5' : 'px-3 py-2'
        )}
        title={displayName}
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
          {initials}
        </div>

        {/* Name (only if not compact) */}
        {!compact && (
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {displayName}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isAnonymous ? 'Anonymous' : userEmail}
            </span>
          </div>
        )}
      </button>

      {/* Dropdown Menu - Opens UPWARD because avatar is at bottom */}
      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
          {/* User Info */}
          <div className="border-b border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
                {initials}
              </div>

              {/* Details */}
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {displayName}
                </p>
                {isAnonymous ? (
                  <>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Anonymous User</p>
                    <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
                      ID: {user.uid.slice(0, 8)}...
                    </p>
                  </>
                ) : (
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="border-b border-slate-200 bg-blue-50 p-3 dark:border-slate-700 dark:bg-blue-900/20">
            <p className="text-xs text-blue-900 dark:text-blue-100">
              {isAnonymous
                ? '⚠️ Anonymous account - Data is stored locally only. Sign in with email to sync across devices.'
                : '✅ Signed in with email - Your data syncs across all devices.'}
            </p>
          </div>

          {/* Actions */}
          <div className="p-2">
            {/* Sign In with Email (only for anonymous users) */}
            {isAnonymous && (
              <button
                onClick={handleOpenSignInDialog}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                )}
              >
                <Mail className="h-4 w-4" />
                <span>Sign In with Email</span>
              </button>
            )}

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Sign In Dialog */}
      <SignInDialog
        isOpen={isSignInDialogOpen}
        onClose={() => setIsSignInDialogOpen(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    </div>
  );
};
