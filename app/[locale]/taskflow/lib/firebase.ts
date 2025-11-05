/**
 * Firebase Configuration for TaskFlow Sharing
 *
 * This file initializes Firebase Realtime Database for sharing functionality.
 * Users can share projects, tasks, and contacts without authentication.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase app (singleton pattern)
let app: FirebaseApp;
let database: Database | null = null;

/**
 * Get Firebase app instance
 * Initializes app if not already initialized
 */
export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering guard
  }

  try {
    // Check if Firebase is already initialized
    if (!app && getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else if (!app) {
      app = getApps()[0];
    }
    return app;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
};

/**
 * Get Realtime Database instance
 * Returns null if Firebase is not configured
 */
export const getRealtimeDatabase = (): Database | null => {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering guard
  }

  try {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) {
      console.warn('Firebase app not initialized. Check your environment variables.');
      return null;
    }

    if (!database) {
      database = getDatabase(firebaseApp);
    }
    return database;
  } catch (error) {
    console.error('Firebase Database initialization error:', error);
    return null;
  }
};

/**
 * Check if Firebase is configured
 * Useful for conditional rendering of share features
 */
export const isFirebaseConfigured = (): boolean => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  );
};
