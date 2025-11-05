/**
 * Share Service for TaskFlow
 *
 * Provides sharing functionality for projects, tasks, and contacts
 * using Firebase Realtime Database without authentication.
 */

import { ref, set, get, onValue, remove, update, Unsubscribe } from 'firebase/database';
import { getRealtimeDatabase, isFirebaseConfigured } from './firebase';
import type { Project, Task, Contact } from '../types';

// Share types
export type ShareType = 'project' | 'task' | 'contact';

// Shared data wrapper with metadata
export interface SharedData<T> {
  data: T;
  shareCode: string;
  type: ShareType;
  createdAt: string;
  lastSync: string;
  expiresAt?: string; // Optional expiry
}

// Share result
export interface ShareResult {
  success: boolean;
  shareCode?: string;
  shareUrl?: string;
  error?: string;
}

// Sync callback for real-time updates
export type SyncCallback<T> = (data: T | null) => void;

/**
 * Generate a unique share code (12 characters, base62: a-zA-Z0-9)
 * Format: abc-xyz-123 (3 groups of 3 characters separated by dashes)
 */
const generateShareCode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const groups = 4;
  const groupLength = 3;

  const generateGroup = () => {
    let result = '';
    for (let i = 0; i < groupLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const code = Array.from({ length: groups }, generateGroup).join('-');
  return code;
};

/**
 * Build Firebase path for shared data
 */
const getSharePath = (type: ShareType, shareCode: string): string => {
  return `shared/${type}/${shareCode}`;
};

/**
 * Build share URL
 */
const buildShareUrl = (shareCode: string, type: ShareType): string => {
  if (typeof window === 'undefined') return '';
  const baseUrl = window.location.origin;
  const locale = window.location.pathname.split('/')[1] || 'en';
  return `${baseUrl}/${locale}/taskflow?share=${shareCode}&type=${type}`;
};

/**
 * Share a project
 * Saves project data to Firebase and returns share code + URL
 */
export const shareProject = async (project: Project): Promise<ShareResult> => {
  try {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase is not configured. Please set up environment variables.',
      };
    }

    const database = getRealtimeDatabase();
    if (!database) {
      return {
        success: false,
        error: 'Failed to connect to Firebase Realtime Database.',
      };
    }

    const shareCode = generateShareCode();
    const sharedData: SharedData<Project> = {
      data: { ...project, isShared: true },
      shareCode,
      type: 'project',
      createdAt: new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };

    const path = getSharePath('project', shareCode);
    await set(ref(database, path), sharedData);

    return {
      success: true,
      shareCode,
      shareUrl: buildShareUrl(shareCode, 'project'),
    };
  } catch (error) {
    console.error('Error sharing project:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Share a task
 * Saves task data to Firebase and returns share code + URL
 */
export const shareTask = async (task: Task): Promise<ShareResult> => {
  try {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase is not configured. Please set up environment variables.',
      };
    }

    const database = getRealtimeDatabase();
    if (!database) {
      return {
        success: false,
        error: 'Failed to connect to Firebase Realtime Database.',
      };
    }

    const shareCode = generateShareCode();
    const sharedData: SharedData<Task> = {
      data: task,
      shareCode,
      type: 'task',
      createdAt: new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };

    const path = getSharePath('task', shareCode);
    await set(ref(database, path), sharedData);

    return {
      success: true,
      shareCode,
      shareUrl: buildShareUrl(shareCode, 'task'),
    };
  } catch (error) {
    console.error('Error sharing task:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Share a contact
 * Saves contact data to Firebase and returns share code + URL
 */
export const shareContact = async (contact: Contact): Promise<ShareResult> => {
  try {
    if (!isFirebaseConfigured()) {
      return {
        success: false,
        error: 'Firebase is not configured. Please set up environment variables.',
      };
    }

    const database = getRealtimeDatabase();
    if (!database) {
      return {
        success: false,
        error: 'Failed to connect to Firebase Realtime Database.',
      };
    }

    const shareCode = generateShareCode();
    const sharedData: SharedData<Contact> = {
      data: contact,
      shareCode,
      type: 'contact',
      createdAt: new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };

    const path = getSharePath('contact', shareCode);
    await set(ref(database, path), sharedData);

    return {
      success: true,
      shareCode,
      shareUrl: buildShareUrl(shareCode, 'contact'),
    };
  } catch (error) {
    console.error('Error sharing contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Get shared data by share code
 * Returns the shared data or null if not found
 */
export const getSharedData = async <T>(
  shareCode: string,
  type: ShareType
): Promise<SharedData<T> | null> => {
  try {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase is not configured');
      return null;
    }

    const database = getRealtimeDatabase();
    if (!database) {
      console.warn('Failed to connect to Firebase Realtime Database');
      return null;
    }

    const path = getSharePath(type, shareCode);
    const snapshot = await get(ref(database, path));

    if (snapshot.exists()) {
      return snapshot.val() as SharedData<T>;
    }

    return null;
  } catch (error) {
    console.error('Error getting shared data:', error);
    return null;
  }
};

/**
 * Update shared data (for real-time collaboration)
 * Updates the lastSync timestamp and data
 */
export const updateSharedData = async <T>(
  shareCode: string,
  type: ShareType,
  data: T
): Promise<boolean> => {
  try {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase is not configured');
      return false;
    }

    const database = getRealtimeDatabase();
    if (!database) {
      console.warn('Failed to connect to Firebase Realtime Database');
      return false;
    }

    const path = getSharePath(type, shareCode);
    await update(ref(database, path), {
      data,
      lastSync: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error updating shared data:', error);
    return false;
  }
};

/**
 * Listen for real-time updates on shared data
 * Returns an unsubscribe function to stop listening
 */
export const subscribeToSharedData = <T>(
  shareCode: string,
  type: ShareType,
  callback: SyncCallback<T>
): Unsubscribe | null => {
  try {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase is not configured');
      return null;
    }

    const database = getRealtimeDatabase();
    if (!database) {
      console.warn('Failed to connect to Firebase Realtime Database');
      return null;
    }

    const path = getSharePath(type, shareCode);
    const dataRef = ref(database, path);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const sharedData = snapshot.val() as SharedData<T>;
        callback(sharedData.data);
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to shared data:', error);
    return null;
  }
};

/**
 * Revoke share (delete from Firebase)
 * Removes the shared data from Firebase
 */
export const revokeShare = async (
  shareCode: string,
  type: ShareType
): Promise<boolean> => {
  try {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase is not configured');
      return false;
    }

    const database = getRealtimeDatabase();
    if (!database) {
      console.warn('Failed to connect to Firebase Realtime Database');
      return false;
    }

    const path = getSharePath(type, shareCode);
    await remove(ref(database, path));

    return true;
  } catch (error) {
    console.error('Error revoking share:', error);
    return false;
  }
};

/**
 * Check if Firebase sharing is available
 */
export const isSharingAvailable = (): boolean => {
  return isFirebaseConfigured() && getRealtimeDatabase() !== null;
};
