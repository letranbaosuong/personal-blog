/**
 * Local Storage Service for TaskFlow
 */

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  PROJECTS: 'taskflow_projects',
  CONTACTS: 'taskflow_contacts',
  USER: 'taskflow_user',
  ACTIVE_VIEW: 'taskflow_active_view',
  SELECTED_TASK_ID: 'taskflow_selected_task_id',
  SELECTED_CONTACT_ID: 'taskflow_selected_contact_id',
} as const;

export const storage = {
  // Generic get/set
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      if (!item || item === '' || item === 'undefined' || item === 'null') {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error, 'Key:', key, 'Value:', localStorage.getItem(key));
      // Clear corrupted data
      localStorage.removeItem(key);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

export { STORAGE_KEYS };
