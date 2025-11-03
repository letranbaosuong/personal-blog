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
        data: options.data,
      });

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);

      // Handle click - dispatch custom event with taskId
      notification.onclick = () => {
        console.log('Browser notification clicked!');
        window.focus();
        notification.close();

        // Dispatch custom event to open task detail
        if (options.data?.taskId) {
          console.log('Dispatching taskflow:openTask event with taskId:', options.data.taskId);
          const event = new CustomEvent('taskflow:openTask', {
            detail: { taskId: options.data.taskId },
          });
          window.dispatchEvent(event);
          console.log('Event dispatched successfully');
        } else {
          console.warn('No taskId in notification data');
        }
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
