/**
 * useShare Hook - Reusable hook for sharing functionality
 *
 * Provides a unified interface for sharing projects, tasks, and contacts
 * with real-time sync capabilities.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  shareProject,
  shareTask,
  shareContact,
  getSharedData,
  updateSharedData,
  subscribeToSharedData,
  revokeShare,
  isSharingAvailable,
  type ShareType,
  type ShareResult,
  type SharedData,
} from '../lib/shareService';
import type { Project, Task, Contact } from '../types';

type ShareableData = Project | Task | Contact;

interface UseShareOptions {
  autoSync?: boolean; // Enable real-time sync
  onSyncUpdate?: (data: ShareableData | null) => void; // Callback for sync updates
}

interface UseShareReturn<T extends ShareableData> {
  // Sharing state
  isSharing: boolean;
  shareResult: ShareResult | null;
  shareUrl: string | null;
  shareCode: string | null;
  error: string | null;

  // Loading shared data state
  isLoading: boolean;
  sharedData: SharedData<T> | null;

  // Actions
  share: (data: T, type: ShareType) => Promise<void>;
  loadShared: (shareCode: string, type: ShareType) => Promise<void>;
  updateShared: (data: T) => Promise<void>;
  revoke: () => Promise<void>;
  copyShareUrl: () => void;
  reset: () => void;

  // Status
  isAvailable: boolean;
  isSyncing: boolean;
}

/**
 * useShare - Generic hook for sharing any type of data
 *
 * @example
 * // Share a project
 * const { share, shareUrl, isSharing } = useShare<Project>();
 * await share(project, 'project');
 *
 * // Load shared data with auto-sync
 * const { loadShared, sharedData } = useShare<Project>({ autoSync: true });
 * await loadShared('abc-def-123', 'project');
 */
export function useShare<T extends ShareableData>(
  options: UseShareOptions = {}
): UseShareReturn<T> {
  const { autoSync = false, onSyncUpdate } = options;

  // State
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState<ShareResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sharedData, setSharedData] = useState<SharedData<T> | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Refs
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const currentShareCodeRef = useRef<string | null>(null);
  const currentTypeRef = useRef<ShareType | null>(null);

  // Derived state
  const shareUrl = shareResult?.shareUrl || null;
  const shareCode = shareResult?.shareCode || null;
  const isAvailable = isSharingAvailable();

  /**
   * Share data
   */
  const share = useCallback(async (data: T, type: ShareType) => {
    setIsSharing(true);
    setError(null);
    setShareResult(null);

    try {
      let result: ShareResult;

      switch (type) {
        case 'project':
          result = await shareProject(data as Project);
          break;
        case 'task':
          result = await shareTask(data as Task);
          break;
        case 'contact':
          result = await shareContact(data as Contact);
          break;
        default:
          throw new Error(`Unknown share type: ${type}`);
      }

      setShareResult(result);

      if (!result.success) {
        setError(result.error || 'Failed to share');
      } else {
        // Store current share info for later updates
        currentShareCodeRef.current = result.shareCode || null;
        currentTypeRef.current = type;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setShareResult({ success: false, error: errorMessage });
    } finally {
      setIsSharing(false);
    }
  }, []);

  /**
   * Load shared data
   */
  const loadShared = useCallback(
    async (shareCode: string, type: ShareType) => {
      setIsLoading(true);
      setError(null);
      setSharedData(null);

      try {
        const data = await getSharedData<T>(shareCode, type);

        if (data) {
          setSharedData(data);
          currentShareCodeRef.current = shareCode;
          currentTypeRef.current = type;

          // Setup real-time sync if enabled
          if (autoSync) {
            // Unsubscribe from previous listener if any
            if (unsubscribeRef.current) {
              unsubscribeRef.current();
            }

            setIsSyncing(true);
            const unsubscribe = subscribeToSharedData<T>(
              shareCode,
              type,
              (updatedData) => {
                if (updatedData) {
                  setSharedData((prev) =>
                    prev
                      ? {
                          ...prev,
                          data: updatedData,
                          lastSync: new Date().toISOString(),
                        }
                      : null
                  );

                  // Call sync update callback
                  if (onSyncUpdate) {
                    onSyncUpdate(updatedData);
                  }
                }
              }
            );

            if (unsubscribe) {
              unsubscribeRef.current = unsubscribe;
            } else {
              setIsSyncing(false);
            }
          }
        } else {
          setError('Share not found or expired');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [autoSync, onSyncUpdate]
  );

  /**
   * Update shared data (for collaboration)
   */
  const updateShared = useCallback(
    async (data: T) => {
      if (!currentShareCodeRef.current || !currentTypeRef.current) {
        setError('No active share to update');
        return;
      }

      try {
        const success = await updateSharedData<T>(
          currentShareCodeRef.current,
          currentTypeRef.current,
          data
        );

        if (!success) {
          setError('Failed to update shared data');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      }
    },
    []
  );

  /**
   * Revoke share
   */
  const revoke = useCallback(async () => {
    if (!currentShareCodeRef.current || !currentTypeRef.current) {
      setError('No active share to revoke');
      return;
    }

    try {
      const success = await revokeShare(
        currentShareCodeRef.current,
        currentTypeRef.current
      );

      if (success) {
        // Cleanup
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }

        currentShareCodeRef.current = null;
        currentTypeRef.current = null;
        setShareResult(null);
        setSharedData(null);
        setIsSyncing(false);
      } else {
        setError('Failed to revoke share');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    }
  }, []);

  /**
   * Copy share URL to clipboard
   */
  const copyShareUrl = useCallback(() => {
    if (!shareUrl) {
      setError('No share URL to copy');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch((err) => {
        console.error('Failed to copy to clipboard:', err);
        setError('Failed to copy to clipboard');
      });
    }
  }, [shareUrl]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    // Unsubscribe from sync
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Clear refs
    currentShareCodeRef.current = null;
    currentTypeRef.current = null;

    // Clear state
    setIsSharing(false);
    setShareResult(null);
    setError(null);
    setIsLoading(false);
    setSharedData(null);
    setIsSyncing(false);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    // State
    isSharing,
    shareResult,
    shareUrl,
    shareCode,
    error,
    isLoading,
    sharedData,
    isSyncing,
    isAvailable,

    // Actions
    share,
    loadShared,
    updateShared,
    revoke,
    copyShareUrl,
    reset,
  };
}
