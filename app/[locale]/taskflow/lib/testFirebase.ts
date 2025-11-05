/**
 * Firebase Connection Test Utility
 *
 * Use this to verify Firebase configuration is working correctly.
 * Open browser console and run: testFirebaseConnection()
 */

import { getRealtimeDatabase, isFirebaseConfigured } from './firebase';
import { ref, set, get } from 'firebase/database';

/**
 * Test Firebase connection and rules
 * Returns detailed diagnostics
 */
export const testFirebaseConnection = async (): Promise<{
  configured: boolean;
  connected: boolean;
  rulesOk: boolean;
  error?: string;
  details: string[];
}> => {
  const details: string[] = [];

  try {
    // Test 1: Check configuration
    details.push('✅ Test 1: Checking environment variables...');
    const configured = isFirebaseConfigured();
    if (!configured) {
      return {
        configured: false,
        connected: false,
        rulesOk: false,
        error: 'Firebase environment variables not set',
        details: [
          ...details,
          '❌ Missing environment variables',
          '💡 Check .env.local file',
        ],
      };
    }
    details.push('✅ Environment variables configured');

    // Test 2: Check database connection
    details.push('✅ Test 2: Connecting to Firebase Database...');
    const database = getRealtimeDatabase();
    if (!database) {
      return {
        configured: true,
        connected: false,
        rulesOk: false,
        error: 'Cannot connect to Firebase Database',
        details: [
          ...details,
          '❌ Database connection failed',
          '💡 Check NEXT_PUBLIC_FIREBASE_DATABASE_URL',
        ],
      };
    }
    details.push('✅ Database connection established');

    // Test 3: Test read/write permissions
    details.push('✅ Test 3: Testing database rules...');
    const testPath = `shared/test/${Date.now()}`;
    const testData = { test: true, timestamp: new Date().toISOString() };

    try {
      // Try to write
      await set(ref(database, testPath), testData);
      details.push('✅ Write permission OK');

      // Try to read
      const snapshot = await get(ref(database, testPath));
      if (snapshot.exists()) {
        details.push('✅ Read permission OK');

        // Clean up test data
        await set(ref(database, testPath), null);
        details.push('✅ Test data cleaned up');

        return {
          configured: true,
          connected: true,
          rulesOk: true,
          details: [
            ...details,
            '',
            '🎉 All tests passed!',
            '✅ Firebase is ready for sharing',
          ],
        };
      } else {
        return {
          configured: true,
          connected: true,
          rulesOk: false,
          error: 'Cannot read data from Firebase',
          details: [
            ...details,
            '❌ Read permission denied',
            '💡 Check Firebase Rules in console',
          ],
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('PERMISSION_DENIED')) {
        return {
          configured: true,
          connected: true,
          rulesOk: false,
          error: 'Firebase Rules not configured',
          details: [
            ...details,
            '❌ PERMISSION DENIED error',
            '💡 Update Firebase Rules to allow read/write on /shared path',
            '',
            '📝 Required rules:',
            '{',
            '  "rules": {',
            '    "shared": {',
            '      ".read": true,',
            '      ".write": true',
            '    }',
            '  }',
            '}',
            '',
            '🔗 Go to: https://console.firebase.google.com/',
            '   → Select project: personal-blog-00',
            '   → Realtime Database → Rules',
            '   → Update rules and click "Publish"',
          ],
        };
      }

      return {
        configured: true,
        connected: true,
        rulesOk: false,
        error: errorMessage,
        details: [
          ...details,
          `❌ Unknown error: ${errorMessage}`,
        ],
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      configured: true,
      connected: false,
      rulesOk: false,
      error: errorMessage,
      details: [
        ...details,
        `❌ Unexpected error: ${errorMessage}`,
      ],
    };
  }
};

/**
 * Print test results to console
 * Call this from browser console: printFirebaseTest()
 */
export const printFirebaseTest = async () => {
  console.log('🔥 Firebase Connection Test\n');
  console.log('Testing...\n');

  const result = await testFirebaseConnection();

  console.log('Results:');
  console.log('='.repeat(50));
  result.details.forEach(detail => console.log(detail));
  console.log('='.repeat(50));

  if (!result.rulesOk) {
    console.log('\n❌ Test failed!');
    console.log(`Error: ${result.error}`);
  } else {
    console.log('\n✅ All tests passed!');
  }

  return result;
};

// Make available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testFirebaseConnection = testFirebaseConnection;
  (window as any).printFirebaseTest = printFirebaseTest;
}
