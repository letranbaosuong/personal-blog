/**
 * Firestore Sync Service
 *
 * Synchronizes tasks, projects, and contacts between localStorage and Firestore.
 * - Email users: Data syncs to Firestore (cloud)
 * - Anonymous users: Data stays in localStorage only
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { getFirestoreDB } from './firebase';
import { getUserId } from './auth';
import { storage, STORAGE_KEYS } from './storage';
import { Task, Project, Contact } from '../types';

/**
 * Remove undefined fields from object (recursively)
 * Firestore doesn't accept undefined values
 */
const removeUndefinedFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: any = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    // Skip undefined values
    if (value === undefined) {
      return;
    }

    // Recursively clean nested objects
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      cleaned[key] = removeUndefinedFields(value);
    }
    // Recursively clean arrays
    else if (Array.isArray(value)) {
      cleaned[key] = value.map((item) => {
        if (item !== null && typeof item === 'object' && !Array.isArray(item) && !(item instanceof Date)) {
          return removeUndefinedFields(item);
        }
        return item;
      }).filter(item => item !== undefined);
    }
    // Keep all other values (including null, which Firestore accepts)
    else {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

/**
 * Check if user should use Firestore (email user, not anonymous)
 */
const shouldUseFirestore = async (): Promise<boolean> => {
  const userId = getUserId();
  if (!userId) return false;

  const db = getFirestoreDB();
  if (!db) return false;

  // Check if user is email-authenticated (not anonymous)
  // This will be set when user signs in with email
  const isEmailUser = localStorage.getItem('taskflow_is_email_user') === 'true';
  return isEmailUser;
};

/**
 * Sync Tasks to Firestore
 */
export const syncTasksToFirestore = async (tasks: Task[]): Promise<void> => {
  const userId = getUserId();
  if (!userId || !(await shouldUseFirestore())) {
    console.log('⏭️ Skipping Firestore sync (anonymous user or not available)');
    return;
  }

  const db = getFirestoreDB();
  if (!db) return;

  try {
    console.log(`🔄 Syncing ${tasks.length} tasks to Firestore...`);

    // Upload each task to Firestore
    for (const task of tasks) {
      const taskRef = doc(db, `users/${userId}/tasks`, task.id);

      // Remove undefined fields (Firestore doesn't accept undefined)
      const cleanedTask = removeUndefinedFields({
        ...task,
        syncedAt: new Date().toISOString(),
      });

      await setDoc(taskRef, cleanedTask);
    }

    console.log('✅ Tasks synced to Firestore');
  } catch (error) {
    console.error('❌ Failed to sync tasks to Firestore:', error);
  }
};

/**
 * Sync Projects to Firestore
 */
export const syncProjectsToFirestore = async (projects: Project[]): Promise<void> => {
  const userId = getUserId();
  if (!userId || !(await shouldUseFirestore())) {
    return;
  }

  const db = getFirestoreDB();
  if (!db) return;

  try {
    console.log(`🔄 Syncing ${projects.length} projects to Firestore...`);

    for (const project of projects) {
      const projectRef = doc(db, `users/${userId}/projects`, project.id);

      // Remove undefined fields (Firestore doesn't accept undefined)
      const cleanedProject = removeUndefinedFields({
        ...project,
        syncedAt: new Date().toISOString(),
      });

      await setDoc(projectRef, cleanedProject);
    }

    console.log('✅ Projects synced to Firestore');
  } catch (error) {
    console.error('❌ Failed to sync projects to Firestore:', error);
  }
};

/**
 * Sync Contacts to Firestore
 */
export const syncContactsToFirestore = async (contacts: Contact[]): Promise<void> => {
  const userId = getUserId();
  if (!userId || !(await shouldUseFirestore())) {
    return;
  }

  const db = getFirestoreDB();
  if (!db) return;

  try {
    console.log(`🔄 Syncing ${contacts.length} contacts to Firestore...`);

    for (const contact of contacts) {
      const contactRef = doc(db, `users/${userId}/contacts`, contact.id);

      // Remove undefined fields (Firestore doesn't accept undefined)
      const cleanedContact = removeUndefinedFields({
        ...contact,
        syncedAt: new Date().toISOString(),
      });

      await setDoc(contactRef, cleanedContact);
    }

    console.log('✅ Contacts synced to Firestore');
  } catch (error) {
    console.error('❌ Failed to sync contacts to Firestore:', error);
  }
};

/**
 * Load Tasks from Firestore
 */
export const loadTasksFromFirestore = async (): Promise<Task[]> => {
  const userId = getUserId();
  if (!userId || !(await shouldUseFirestore())) {
    return [];
  }

  const db = getFirestoreDB();
  if (!db) return [];

  try {
    console.log('📥 Loading tasks from Firestore...');

    const tasksRef = collection(db, `users/${userId}/tasks`);
    const snapshot = await getDocs(tasksRef);

    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Remove syncedAt field before returning
      const { syncedAt, ...taskData } = data;
      tasks.push(taskData as Task);
    });

    console.log(`✅ Loaded ${tasks.length} tasks from Firestore`);
    return tasks;
  } catch (error) {
    console.error('❌ Failed to load tasks from Firestore:', error);
    return [];
  }
};

/**
 * Load Projects from Firestore
 */
export const loadProjectsFromFirestore = async (): Promise<Project[]> => {
  const userId = getUserId();
  if (!userId || !(await shouldUseFirestore())) {
    return [];
  }

  const db = getFirestoreDB();
  if (!db) return [];

  try {
    console.log('📥 Loading projects from Firestore...');

    const projectsRef = collection(db, `users/${userId}/projects`);
    const snapshot = await getDocs(projectsRef);

    const projects: Project[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { syncedAt, ...projectData } = data;
      projects.push(projectData as Project);
    });

    console.log(`✅ Loaded ${projects.length} projects from Firestore`);
    return projects;
  } catch (error) {
    console.error('❌ Failed to load projects from Firestore:', error);
    return [];
  }
};

/**
 * Load Contacts from Firestore
 */
export const loadContactsFromFirestore = async (): Promise<Contact[]> => {
  const userId = getUserId();
  if (!userId || !(await shouldUseFirestore())) {
    return [];
  }

  const db = getFirestoreDB();
  if (!db) return [];

  try {
    console.log('📥 Loading contacts from Firestore...');

    const contactsRef = collection(db, `users/${userId}/contacts`);
    const snapshot = await getDocs(contactsRef);

    const contacts: Contact[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { syncedAt, ...contactData } = data;
      contacts.push(contactData as Contact);
    });

    console.log(`✅ Loaded ${contacts.length} contacts from Firestore`);
    return contacts;
  } catch (error) {
    console.error('❌ Failed to load contacts from Firestore:', error);
    return [];
  }
};

/**
 * Load tasks from Firestore by user ID (bypasses shouldUseFirestore check)
 */
const loadTasksFromFirestoreByUserId = async (userId: string): Promise<Task[]> => {
  const db = getFirestoreDB();
  if (!db) return [];

  try {
    console.log('📥 Loading tasks from Firestore for user:', userId);

    const tasksRef = collection(db, `users/${userId}/tasks`);
    const snapshot = await getDocs(tasksRef);

    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { syncedAt, ...taskData } = data;
      tasks.push(taskData as Task);
    });

    console.log(`✅ Loaded ${tasks.length} tasks from Firestore`);
    return tasks;
  } catch (error) {
    console.error('❌ Failed to load tasks from Firestore:', error);
    return [];
  }
};

/**
 * Sync tasks to Firestore by user ID (bypasses shouldUseFirestore check)
 */
const syncTasksToFirestoreByUserId = async (userId: string, tasks: Task[]): Promise<void> => {
  const db = getFirestoreDB();
  if (!db) return;

  try {
    console.log(`🔄 Syncing ${tasks.length} tasks to Firestore for user:`, userId);

    for (const task of tasks) {
      const taskRef = doc(db, `users/${userId}/tasks`, task.id);
      const cleanedTask = removeUndefinedFields({
        ...task,
        syncedAt: new Date().toISOString(),
      });
      await setDoc(taskRef, cleanedTask);
    }

    console.log('✅ Tasks synced to Firestore');
  } catch (error) {
    console.error('❌ Failed to sync tasks to Firestore:', error);
  }
};

/**
 * Sync projects to Firestore by user ID
 */
const syncProjectsToFirestoreByUserId = async (userId: string, projects: Project[]): Promise<void> => {
  const db = getFirestoreDB();
  if (!db) return;

  try {
    console.log(`🔄 Syncing ${projects.length} projects to Firestore for user:`, userId);

    for (const project of projects) {
      const projectRef = doc(db, `users/${userId}/projects`, project.id);
      const cleanedProject = removeUndefinedFields({
        ...project,
        syncedAt: new Date().toISOString(),
      });
      await setDoc(projectRef, cleanedProject);
    }

    console.log('✅ Projects synced to Firestore');
  } catch (error) {
    console.error('❌ Failed to sync projects to Firestore:', error);
  }
};

/**
 * Sync contacts to Firestore by user ID
 */
const syncContactsToFirestoreByUserId = async (userId: string, contacts: Contact[]): Promise<void> => {
  const db = getFirestoreDB();
  if (!db) return;

  try {
    console.log(`🔄 Syncing ${contacts.length} contacts to Firestore for user:`, userId);

    for (const contact of contacts) {
      const contactRef = doc(db, `users/${userId}/contacts`, contact.id);
      const cleanedContact = removeUndefinedFields({
        ...contact,
        syncedAt: new Date().toISOString(),
      });
      await setDoc(contactRef, cleanedContact);
    }

    console.log('✅ Contacts synced to Firestore');
  } catch (error) {
    console.error('❌ Failed to sync contacts to Firestore:', error);
  }
};

/**
 * Load projects from Firestore by user ID
 */
const loadProjectsFromFirestoreByUserId = async (userId: string): Promise<Project[]> => {
  const db = getFirestoreDB();
  if (!db) return [];

  try {
    console.log('📥 Loading projects from Firestore for user:', userId);

    const projectsRef = collection(db, `users/${userId}/projects`);
    const snapshot = await getDocs(projectsRef);

    const projects: Project[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { syncedAt, ...projectData } = data;
      projects.push(projectData as Project);
    });

    console.log(`✅ Loaded ${projects.length} projects from Firestore`);
    return projects;
  } catch (error) {
    console.error('❌ Failed to load projects from Firestore:', error);
    return [];
  }
};

/**
 * Load contacts from Firestore by user ID
 */
const loadContactsFromFirestoreByUserId = async (userId: string): Promise<Contact[]> => {
  const db = getFirestoreDB();
  if (!db) return [];

  try {
    console.log('📥 Loading contacts from Firestore for user:', userId);

    const contactsRef = collection(db, `users/${userId}/contacts`);
    const snapshot = await getDocs(contactsRef);

    const contacts: Contact[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { syncedAt, ...contactData } = data;
      contacts.push(contactData as Contact);
    });

    console.log(`✅ Loaded ${contacts.length} contacts from Firestore`);
    return contacts;
  } catch (error) {
    console.error('❌ Failed to load contacts from Firestore:', error);
    return [];
  }
};

/**
 * Initial sync: Upload localStorage data to Firestore by user ID
 */
const initialSyncToFirestoreByUserId = async (userId: string): Promise<void> => {
  console.log('🚀 Starting initial sync to Firestore for user:', userId);

  // Load data from localStorage
  const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
  const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
  const contacts = storage.get<Contact[]>(STORAGE_KEYS.CONTACTS) || [];

  console.log(`📦 Found in localStorage:`, {
    tasks: tasks.length,
    projects: projects.length,
    contacts: contacts.length,
  });

  // Sync to Firestore
  await syncTasksToFirestoreByUserId(userId, tasks);
  await syncProjectsToFirestoreByUserId(userId, projects);
  await syncContactsToFirestoreByUserId(userId, contacts);

  console.log('✅ Initial sync complete!');
};

/**
 * Load all data from Firestore to localStorage by user ID
 */
const loadAllFromFirestoreByUserId = async (userId: string): Promise<void> => {
  console.log('📥 Loading all data from Firestore for user:', userId);

  const [tasks, projects, contacts] = await Promise.all([
    loadTasksFromFirestoreByUserId(userId),
    loadProjectsFromFirestoreByUserId(userId),
    loadContactsFromFirestoreByUserId(userId),
  ]);

  // Save to localStorage
  if (tasks.length > 0) {
    storage.set(STORAGE_KEYS.TASKS, tasks);
  }
  if (projects.length > 0) {
    storage.set(STORAGE_KEYS.PROJECTS, projects);
  }
  if (contacts.length > 0) {
    storage.set(STORAGE_KEYS.CONTACTS, contacts);
  }

  console.log('✅ All data loaded from Firestore:', {
    tasks: tasks.length,
    projects: projects.length,
    contacts: contacts.length,
  });
};

/**
 * Initial sync: Upload localStorage data to Firestore
 * Called when user signs in with email for the first time
 */
export const initialSyncToFirestore = async (): Promise<void> => {
  console.log('🚀 Starting initial sync to Firestore...');

  // Load data from localStorage
  const tasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
  const projects = storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
  const contacts = storage.get<Contact[]>(STORAGE_KEYS.CONTACTS) || [];

  console.log(`📦 Found in localStorage:`, {
    tasks: tasks.length,
    projects: projects.length,
    contacts: contacts.length,
  });

  // Sync to Firestore
  await syncTasksToFirestore(tasks);
  await syncProjectsToFirestore(projects);
  await syncContactsToFirestore(contacts);

  console.log('✅ Initial sync complete!');
};

/**
 * Load all data from Firestore to localStorage
 * Called when user signs in on a new device
 */
export const loadAllFromFirestore = async (): Promise<void> => {
  console.log('📥 Loading all data from Firestore...');

  const [tasks, projects, contacts] = await Promise.all([
    loadTasksFromFirestore(),
    loadProjectsFromFirestore(),
    loadContactsFromFirestore(),
  ]);

  // Save to localStorage
  if (tasks.length > 0) {
    storage.set(STORAGE_KEYS.TASKS, tasks);
  }
  if (projects.length > 0) {
    storage.set(STORAGE_KEYS.PROJECTS, projects);
  }
  if (contacts.length > 0) {
    storage.set(STORAGE_KEYS.CONTACTS, contacts);
  }

  console.log('✅ All data loaded from Firestore:', {
    tasks: tasks.length,
    projects: projects.length,
    contacts: contacts.length,
  });
};

/**
 * Enable Firestore sync for email user
 * Called after successful email sign in
 * @param userId - Optional user ID to use for sync (if not provided, will use getCurrentUser)
 */
export const enableFirestoreSync = async (userId?: string): Promise<void> => {
  console.log('🔓 Enabling Firestore sync for email user...');

  // Get user ID (from parameter or getCurrentUser)
  const uid = userId || getUserId();
  if (!uid) {
    console.error('❌ No user ID available for Firestore sync');
    return;
  }

  console.log('🔑 Using user ID for sync:', uid);

  // Mark user as email user (not anonymous)
  localStorage.setItem('taskflow_is_email_user', 'true');

  // Check if this is first sign in on this device
  const hasLocalData =
    (storage.get<Task[]>(STORAGE_KEYS.TASKS) || []).length > 0 ||
    (storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || []).length > 0 ||
    (storage.get<Contact[]>(STORAGE_KEYS.CONTACTS) || []).length > 0;

  console.log('📦 Local data check:', { hasLocalData });

  // Check if Firestore has data (pass userId to bypass shouldUseFirestore check)
  const firestoreTasks = await loadTasksFromFirestoreByUserId(uid);
  const hasFirestoreData = firestoreTasks.length > 0;

  console.log('☁️  Firestore data check:', { hasFirestoreData, count: firestoreTasks.length });

  if (hasLocalData && !hasFirestoreData) {
    // First sign in: Upload local data to Firestore
    console.log('📤 First sign in: Uploading local data to Firestore...');
    await initialSyncToFirestoreByUserId(uid);
  } else if (!hasLocalData && hasFirestoreData) {
    // Signing in on new device: Download from Firestore
    console.log('📥 New device: Downloading data from Firestore...');
    await loadAllFromFirestoreByUserId(uid);
  } else if (hasLocalData && hasFirestoreData) {
    // Both have data: Merge (for now, Firestore wins)
    console.log('🔄 Merging data (Firestore priority)...');
    await loadAllFromFirestoreByUserId(uid);
  } else {
    console.log('📭 No data found on either side');
  }

  // Setup realtime sync listeners
  console.log('🔄 Setting up realtime sync...');
  setupRealtimeSync(uid);

  console.log('✅ Firestore sync enabled with realtime updates!');
};

/**
 * Disable Firestore sync (when user signs out)
 */
export const disableFirestoreSync = (): void => {
  console.log('🔒 Disabling Firestore sync...');

  // Cleanup realtime listeners
  cleanupRealtimeSync();

  // Remove email user flag
  localStorage.removeItem('taskflow_is_email_user');

  console.log('✅ Firestore sync disabled');
};

// Store unsubscribe functions globally
let realtimeSyncUnsubscribers: Unsubscribe[] = [];

/**
 * Setup real-time listeners for all data types
 * Automatically updates localStorage when Firestore changes
 * Returns cleanup function to unsubscribe all listeners
 */
export const setupRealtimeSync = (userId?: string): (() => void) | null => {
  const uid = userId || getUserId();
  const db = getFirestoreDB();

  if (!uid || !db) {
    console.warn('⚠️ Cannot setup realtime sync: missing userId or db');
    return null;
  }

  // Cleanup existing listeners first
  cleanupRealtimeSync();

  console.log('👂 Setting up real-time sync listeners for user:', uid);

  // Listen to tasks changes
  const tasksRef = collection(db, `users/${uid}/tasks`);
  const tasksUnsubscribe = onSnapshot(tasksRef, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { syncedAt, ...taskData } = data;
      tasks.push(taskData as Task);
    });

    // Update localStorage
    storage.set(STORAGE_KEYS.TASKS, tasks);
    console.log('🔄 Tasks updated from Firestore:', tasks.length);

    // Trigger custom event to update UI
    window.dispatchEvent(new CustomEvent('taskflow-data-updated', {
      detail: { type: 'tasks', data: tasks }
    }));
  });

  // Listen to projects changes
  const projectsRef = collection(db, `users/${uid}/projects`);
  const projectsUnsubscribe = onSnapshot(projectsRef, (snapshot) => {
    const projects: Project[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { syncedAt, ...projectData } = data;
      projects.push(projectData as Project);
    });

    // Update localStorage
    storage.set(STORAGE_KEYS.PROJECTS, projects);
    console.log('🔄 Projects updated from Firestore:', projects.length);

    // Trigger custom event to update UI
    window.dispatchEvent(new CustomEvent('taskflow-data-updated', {
      detail: { type: 'projects', data: projects }
    }));
  });

  // Listen to contacts changes
  const contactsRef = collection(db, `users/${uid}/contacts`);
  const contactsUnsubscribe = onSnapshot(contactsRef, (snapshot) => {
    const contacts: Contact[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const { syncedAt, ...contactData } = data;
      contacts.push(contactData as Contact);
    });

    // Update localStorage
    storage.set(STORAGE_KEYS.CONTACTS, contacts);
    console.log('🔄 Contacts updated from Firestore:', contacts.length);

    // Trigger custom event to update UI
    window.dispatchEvent(new CustomEvent('taskflow-data-updated', {
      detail: { type: 'contacts', data: contacts }
    }));
  });

  // Store unsubscribers
  realtimeSyncUnsubscribers = [tasksUnsubscribe, projectsUnsubscribe, contactsUnsubscribe];

  console.log('✅ Real-time sync listeners active');

  // Return cleanup function
  return () => {
    console.log('🛑 Cleaning up real-time sync listeners...');
    realtimeSyncUnsubscribers.forEach(unsub => unsub());
    realtimeSyncUnsubscribers = [];
  };
};

/**
 * Cleanup all realtime sync listeners
 */
export const cleanupRealtimeSync = (): void => {
  if (realtimeSyncUnsubscribers.length > 0) {
    console.log('🛑 Cleaning up existing real-time sync listeners...');
    realtimeSyncUnsubscribers.forEach(unsub => unsub());
    realtimeSyncUnsubscribers = [];
  }
};
