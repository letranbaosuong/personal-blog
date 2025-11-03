/**
 * Notification utilities for task reminders
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
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
    if (typeof window === 'undefined') return;

    const hasPermission = await notifications.requestPermission();

    if (!hasPermission) {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        badge: options.icon || '/favicon.ico',
        requireInteraction: false,
      });

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
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
