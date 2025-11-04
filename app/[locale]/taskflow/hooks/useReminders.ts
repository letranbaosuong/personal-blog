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

  // Store tasks and options in refs to avoid dependency issues
  const tasksRef = useRef<Task[]>(tasks);
  const optionsRef = useRef<UseRemindersOptions | undefined>(options);

  // Update refs when props change
  useEffect(() => {
    tasksRef.current = tasks;
    optionsRef.current = options;
  }, [tasks, options]);

  // Check and trigger reminders (stable function with no dependencies)
  const checkReminders = useCallback(() => {
    const now = new Date();

    tasksRef.current.forEach((task) => {
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
        if (optionsRef.current?.onReminder) {
          optionsRef.current.onReminder({
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
  }, []); // No dependencies - stable function

  // Request notification permission on mount
  useEffect(() => {
    if (notifications.isSupported()) {
      notifications.requestPermission();
    }
  }, []);

  // Set up reminder checking interval (only once on mount)
  useEffect(() => {
    // Check after short delay on mount
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
  }, [checkReminders]); // checkReminders is stable, so this only runs once

  return {
    notificationPermission: notifications.getPermission(),
    requestPermission: notifications.requestPermission,
  };
}
