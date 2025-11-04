/**
 * Notification utilities for task reminders
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any; // Additional data like taskId
}

export const notifications = {
  // Request notification permission
  requestPermission: async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  // Show browser notification
  show: async (options: NotificationOptions): Promise<void> => {
    console.log('[Notifications] show() called with:', {
      title: options.title,
      body: options.body,
      tag: options.tag,
      taskId: options.data?.taskId
    });

    if (typeof window === 'undefined') {
      console.warn('[Notifications] Window is undefined (SSR)');
      return;
    }

    console.log('[Notifications] Checking permission...');
    const hasPermission = await notifications.requestPermission();
    console.log('[Notifications] Permission granted:', hasPermission);

    if (!hasPermission) {
      console.warn('[Notifications] ❌ Permission not granted - notification will not show');
      console.warn('[Notifications] Please allow notifications in browser settings');
      return;
    }

    try {
      console.log('[Notifications] Creating browser notification...');
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        badge: options.icon || '/favicon.ico',
        requireInteraction: false,
        data: options.data,
      });

      console.log('[Notifications] ✅ Browser notification created successfully!');

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);

      // Handle click - dispatch custom event with taskId
      notification.onclick = () => {
        console.log('[Notifications] Notification clicked!');
        window.focus();
        notification.close();

        // Dispatch custom event to open task detail
        if (options.data?.taskId) {
          console.log('[Notifications] Dispatching taskflow:openTask event with taskId:', options.data.taskId);
          const event = new CustomEvent('taskflow:openTask', {
            detail: { taskId: options.data.taskId },
          });
          window.dispatchEvent(event);
          console.log('[Notifications] Event dispatched successfully');
        } else {
          console.warn('[Notifications] No taskId in notification data');
        }
      };
    } catch (error) {
      console.error('[Notifications] ❌ Error showing notification:', error);
      throw error;
    }
  },

  // Check if notifications are supported
  isSupported: (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'Notification' in window;
  },

  // Get current permission status
  getPermission: (): NotificationPermission => {
    if (typeof window === 'undefined' || !notifications.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  },
};
