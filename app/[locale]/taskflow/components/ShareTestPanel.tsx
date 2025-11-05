/**
 * ShareTestPanel - Firebase Connection Test UI
 *
 * A developer tool panel for testing Firebase configuration.
 * Shows diagnostics and helps debug share feature issues.
 */

'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, TestTube, X } from 'lucide-react';
import { testFirebaseConnection } from '../lib/testFirebase';

interface TestResult {
  configured: boolean;
  connected: boolean;
  rulesOk: boolean;
  error?: string;
  details: string[];
}

export const ShareTestPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const runTest = async () => {
    setIsTesting(true);
    setResult(null);

    try {
      const testResult = await testFirebaseConnection();
      setResult(testResult);
    } catch (error) {
      setResult({
        configured: false,
        connected: false,
        rulesOk: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: ['❌ Test failed with error'],
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl dark:bg-blue-500 dark:hover:bg-blue-600"
        title="Test Firebase Connection"
      >
        <TestTube className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Firebase Test
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="max-h-96 overflow-y-auto p-4">
        {/* Run Test Button */}
        <button
          onClick={runTest}
          disabled={isTesting}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <TestTube className="h-4 w-4" />
              Run Test
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-3">
            {/* Status Summary */}
            <div className="space-y-2">
              <StatusItem
                label="Configuration"
                ok={result.configured}
              />
              <StatusItem
                label="Connection"
                ok={result.connected}
              />
              <StatusItem
                label="Database Rules"
                ok={result.rulesOk}
              />
            </div>

            {/* Details */}
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
              <div className="mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                Details:
              </div>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {result.details.map((detail, index) => (
                  <div
                    key={index}
                    className={`font-mono ${
                      detail.startsWith('✅')
                        ? 'text-green-600 dark:text-green-400'
                        : detail.startsWith('❌')
                        ? 'text-red-600 dark:text-red-400'
                        : detail.startsWith('💡')
                        ? 'text-blue-600 dark:text-blue-400'
                        : ''
                    }`}
                  >
                    {detail}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {result.error && !result.rulesOk && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-red-900 dark:text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  Action Required
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Please update Firebase Database Rules:
                </p>
                <ol className="mt-2 space-y-1 text-xs text-red-700 dark:text-red-300">
                  <li>1. Go to Firebase Console</li>
                  <li>2. Select: Realtime Database → Rules</li>
                  <li>3. Update rules and click Publish</li>
                </ol>
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-red-600 underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Open Firebase Console →
                </a>
              </div>
            )}

            {/* Success Message */}
            {result.rulesOk && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-900 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  All Tests Passed!
                </div>
                <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                  Firebase is ready. Share feature should work correctly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        {!result && !isTesting && (
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <p className="mb-2">
              This tool tests your Firebase configuration:
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Environment variables</li>
              <li>Database connection</li>
              <li>Read/Write permissions</li>
            </ul>
            <p className="mt-3">
              Run the test to diagnose any issues with the share feature.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Need help? Check{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-700">
            FIREBASE_RULES_FIX.md
          </code>
        </div>
      </div>
    </div>
  );
};

// Status Item Component
const StatusItem = ({ label, ok }: { label: string; ok: boolean }) => (
  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900">
    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
    {ok ? (
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
    )}
  </div>
);
