/**
 * useRealtimeSync Hook
 *
 * Listen for realtime Firestore updates and trigger UI re-render
 * Components using this hook will automatically update when data changes in Firestore
 *
 * Auto-initializes realtime sync for email users on mount
 */

'use client';

import { useEffect, useState } from 'react';
import { setupRealtimeSync, cleanupRealtimeSync } from '../lib/firestore-sync';
import { getUserId } from '../lib/auth';

interface DataUpdateEvent {
  type: 'tasks' | 'projects' | 'contacts';
  data: any[];
}

/**
 * Hook to listen for realtime data updates from Firestore
 * Forces component re-render when data changes
 * Automatically sets up Firestore listeners for email users
 */
export function useRealtimeSync() {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Setup Firestore realtime listeners for email users
  useEffect(() => {
    const userId = getUserId();
    const isEmailUser = localStorage.getItem('taskflow_is_email_user') === 'true';

    if (!userId || !isEmailUser) {
      console.log('👤 Anonymous user - skipping Firestore realtime sync');
      return;
    }

    console.log('🔄 Setting up realtime Firestore listeners for email user:', userId);
    const cleanup = setupRealtimeSync(userId);

    // Cleanup listeners when component unmounts or dependencies change
    return () => {
      console.log('🧹 Cleaning up realtime sync listeners...');
      if (cleanup) {
        cleanup();
      } else {
        // Fallback cleanup if setupRealtimeSync didn't return cleanup function
        cleanupRealtimeSync();
      }
    };
  }, []); // Empty deps: only run once on mount

  // Listen for custom events (triggered by Firestore listeners)
  useEffect(() => {
    const handleDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<DataUpdateEvent>;
      console.log('🔔 Realtime update received:', customEvent.detail.type);

      // Force re-render by updating state
      setLastUpdate(Date.now());
    };

    // Listen for custom event
    window.addEventListener('taskflow-data-updated', handleDataUpdate);

    console.log('👂 useRealtimeSync: Listening for data update events...');

    return () => {
      window.removeEventListener('taskflow-data-updated', handleDataUpdate);
      console.log('🛑 useRealtimeSync: Stopped listening for events');
    };
  }, []);

  return {
    lastUpdate,
  };
}
