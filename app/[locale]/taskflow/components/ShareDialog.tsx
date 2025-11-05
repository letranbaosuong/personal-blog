/**
 * ShareDialog Component
 *
 * Modal dialog for sharing projects, tasks, and contacts
 * Displays share URL, copy button, and QR code option
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useShare } from '../hooks/useShare';
import type { ShareType } from '../lib/shareService';
import type { Project, Task, Contact } from '../types';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: Project | Task | Contact;
  type: ShareType;
  title?: string;
}

export const ShareDialog = ({ isOpen, onClose, data, type, title }: ShareDialogProps) => {
  const t = useTranslations('taskflow');
  const [copied, setCopied] = useState(false);
  const { share, shareUrl, isSharing, error, isAvailable } = useShare();

  // Share data when dialog opens
  useEffect(() => {
    if (isOpen && isAvailable) {
      share(data, type);
    }
  }, [isOpen, isAvailable]); // Only depend on isOpen and isAvailable

  // Reset copied state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  // Handle copy to clipboard
  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getItemName = () => {
    if ('title' in data) return data.title; // Task
    if ('name' in data) return data.name; // Project or Contact
    return 'Item';
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'project':
        return t('share.project') || 'Project';
      case 'task':
        return t('share.task') || 'Task';
      case 'contact':
        return t('share.contact') || 'Contact';
      default:
        return 'Item';
    }
  };

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
              <Share2 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title || t('share.title') || 'Share'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getTypeLabel()}: {getItemName()}
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
        <div className="p-4">
          {!isAvailable ? (
            // Firebase not configured
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
              <AlertCircle size={20} className="mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  {t('share.notConfigured') || 'Sharing not available'}
                </p>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                  {t('share.configureFirebase') ||
                    'Please configure Firebase to enable sharing features.'}
                </p>
              </div>
            </div>
          ) : error ? (
            // Error state
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <AlertCircle size={20} className="mt-0.5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {t('share.error') || 'Error'}
                </p>
                <p className="mt-1 text-xs text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          ) : isSharing || !shareUrl ? (
            // Loading state
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('share.generating') || 'Generating share link...'}
                </p>
              </div>
            </div>
          ) : (
            // Success state
            <div className="space-y-4">
              {/* Info */}
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  {t('share.description') ||
                    'Anyone with this link can view and collaborate on this item in real-time.'}
                </p>
              </div>

              {/* Share URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('share.shareLink') || 'Share Link'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      copied
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    )}
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        <span>{t('share.copied') || 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>{t('share.copy') || 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('share.features') || 'Features'}:
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {t('share.feature1') || 'Real-time synchronization'}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {t('share.feature2') || 'No login required'}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {t('share.feature3') || 'Collaborative editing'}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-700">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t('share.close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
