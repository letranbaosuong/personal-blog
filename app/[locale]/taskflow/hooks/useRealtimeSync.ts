/**
 * useRealtimeSync Hook
 *
 * Listen for realtime Firestore updates and trigger UI re-render
 * Components using this hook will automatically update when data changes in Firestore
 */

'use client';

import { useEffect, useState } from 'react';

interface DataUpdateEvent {
  type: 'tasks' | 'projects' | 'contacts';
  data: any[];
}

/**
 * Hook to listen for realtime data updates from Firestore
 * Forces component re-render when data changes
 */
export function useRealtimeSync() {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    const handleDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<DataUpdateEvent>;
      console.log('🔔 Realtime update received:', customEvent.detail.type);

      // Force re-render by updating state
      setLastUpdate(Date.now());
    };

    // Listen for custom event
    window.addEventListener('taskflow-data-updated', handleDataUpdate);

    console.log('👂 useRealtimeSync: Listening for realtime updates...');

    return () => {
      window.removeEventListener('taskflow-data-updated', handleDataUpdate);
      console.log('🛑 useRealtimeSync: Stopped listening');
    };
  }, []);

  return {
    lastUpdate,
  };
}
