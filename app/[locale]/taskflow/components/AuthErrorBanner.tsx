/**
 * AuthErrorBanner - Shows warning when Firebase Auth is not configured
 *
 * Displays friendly message to help users fix auth/admin-restricted-operation error
 */

'use client';

import { AlertCircle, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';

interface AuthErrorBannerProps {
  error: string | null;
}

export const AuthErrorBanner = ({ error }: AuthErrorBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Only show for admin-restricted-operation error
  const isAuthNotEnabled = error?.includes('admin-restricted-operation') ||
    error?.includes('Anonymous Auth not enabled');

  if (!isAuthNotEnabled || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4">
      <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4 shadow-lg dark:border-yellow-600 dark:bg-yellow-900/20">
        {/* Close button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-3 top-3 rounded p-1 text-yellow-700 transition-colors hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-800"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
              Firebase Anonymous Auth Not Enabled
            </h3>
            <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
              Share feature requires Anonymous Authentication to track ownership.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="ml-9 space-y-3">
          <div className="rounded bg-yellow-100 p-3 dark:bg-yellow-900/40">
            <p className="mb-2 text-sm font-medium text-yellow-900 dark:text-yellow-100">
              Quick Fix (2 minutes):
            </p>
            <ol className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
              <li>1. Open Firebase Console</li>
              <li>2. Select your project</li>
              <li>3. Go to: Build → Authentication → Sign-in method</li>
              <li>4. Enable "Anonymous" sign-in</li>
              <li>5. Refresh this page</li>
            </ol>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600"
            >
              Open Firebase Console
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/letranbaosuong/personal-blog/blob/main/FIREBASE_AUTH_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-yellow-600 px-4 py-2 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100 dark:border-yellow-500 dark:text-yellow-300 dark:hover:bg-yellow-900/40"
            >
              Detailed Guide
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Note */}
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            💡 <strong>Note:</strong> TaskFlow will work without auth, but share tracking won't be available until this is fixed.
          </p>
        </div>
      </div>
    </div>
  );
};
