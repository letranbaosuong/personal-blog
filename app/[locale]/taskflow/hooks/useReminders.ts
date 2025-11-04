/**
 * useReminders Hook - Monitor and trigger task reminders
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Task } from '../types';
import { notifications } from '../lib/notifications';

export interface ReminderNotification {
  taskId: string;
  title: string;
  message: string;
}

interface UseRemindersOptions {
  onReminder?: (notification: ReminderNotification) => void;
}

export function useReminders(tasks: Task[], options?: UseRemindersOptions) {
  const notifiedReminders = useRef<Set<string>>(new Set());
  const isInitialMount = useRef(true);

  // Check and trigger reminders
  const checkReminders = useCallback(() => {
    const now = new Date();

    tasks.forEach((task) => {
      // Skip if no reminder or already completed
      if (!task.reminder || task.status === 'completed') {
        return;
      }

      const reminderTime = new Date(task.reminder);
      const reminderKey = `${task.id}-${task.reminder}`;

      // Check if reminder time has passed and not yet notified
      if (
        reminderTime <= now &&
        !notifiedReminders.current.has(reminderKey)
      ) {
        // Format message
        const dueDateText = task.dueDate
          ? ` (Due: ${new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })})`
          : '';

        const message = `${task.title}${dueDateText}`;

        // Show browser notification
        notifications.show({
          title: '⏰ Task Reminder',
          body: message,
          tag: task.id,
          data: { taskId: task.id },
        });

        // Trigger callback for in-app notification
        if (options?.onReminder) {
          options.onReminder({
            taskId: task.id,
            title: '⏰ Task Reminder',
            message,
          });
        }

        // Mark as notified
        notifiedReminders.current.add(reminderKey);

        // Clean up old reminders after 1 hour
        setTimeout(() => {
          notifiedReminders.current.delete(reminderKey);
        }, 60 * 60 * 1000);
      }
    });
  }, [tasks, options]);

  // Request notification permission on mount
  useEffect(() => {
    if (notifications.isSupported()) {
      notifications.requestPermission();
    }
  }, []);

  // Check reminders every minute
  useEffect(() => {
    // Skip immediate check on initial mount or re-renders
    // Only check via interval to avoid duplicate notifications on language change
    if (isInitialMount.current) {
      isInitialMount.current = false;

      // Check after a short delay on first mount
      const initialTimeout = setTimeout(() => {
        checkReminders();
      }, 1000);

      // Set up interval to check every minute
      const interval = setInterval(() => {
        checkReminders();
      }, 60 * 1000); // Check every 60 seconds

      return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
      };
    }

    // For subsequent renders (like language change), only set up interval
    // Don't check immediately to avoid duplicate notifications
    const interval = setInterval(() => {
      checkReminders();
    }, 60 * 1000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [checkReminders]);

  return {
    notificationPermission: notifications.getPermission(),
    requestPermission: notifications.requestPermission,
  };
}
