/**
 * SignInDialog Component
 *
 * Modal dialog for Email/Password sign in/sign up
 * Allows users to create account and sync across devices
 */

'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { enableFirestoreSync } from '../lib/firestore-sync';
import { getUserId } from '../lib/auth';

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (email: string, password: string, displayName: string) => Promise<boolean>;
}

export const SignInDialog = ({ isOpen, onClose, onSignIn, onSignUp }: SignInDialogProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let success = false;

      if (mode === 'signin') {
        success = await onSignIn(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        success = await onSignUp(email, password, displayName);
      }

      if (success) {
        // Close dialog first
        onClose();

        // Wait for Firebase Auth state to update, then sync data
        console.log('⏳ Waiting for Firebase Auth state to update...');
        setTimeout(async () => {
          // Get current user ID
          const userId = getUserId();
          if (!userId) {
            console.error('❌ No user ID available after sign in!');
            window.location.reload();
            return;
          }

          console.log('✅ Sign in successful! User ID:', userId);
          console.log('🔄 Enabling Firestore sync...');
          await enableFirestoreSync(userId);
          console.log('✅ Sync complete! Reloading page...');

          // Reload page to refresh UI with synced data
          window.location.reload();
        }, 500); // Wait 500ms for Firebase Auth state to update
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {mode === 'signin' ? 'Welcome back!' : 'Join TaskFlow today'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Display Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Display Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  required
                />
              </div>
              {mode === 'signup' && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                <AlertCircle size={18} className="mt-0.5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {mode === 'signin'
                  ? '🔐 Sign in to sync your data across all devices'
                  : '✨ Create an account to access your tasks from any device'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                }}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                {mode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
