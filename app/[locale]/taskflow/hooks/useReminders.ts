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

// LocalStorage key for notified reminders
const NOTIFIED_REMINDERS_KEY = 'taskflow_notified_reminders';

// Helper: Load notified reminders from localStorage
const loadNotifiedReminders = (): Set<string> => {
  // Only access localStorage in browser environment
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = localStorage.getItem(NOTIFIED_REMINDERS_KEY);
    if (!stored) return new Set();

    const data = JSON.parse(stored) as { key: string; timestamp: number }[];
    const now = Date.now();

    // Filter out old entries (older than 24 hours)
    const validEntries = data.filter(entry => now - entry.timestamp < 24 * 60 * 60 * 1000);

    // Save cleaned data back
    localStorage.setItem(NOTIFIED_REMINDERS_KEY, JSON.stringify(validEntries));

    return new Set(validEntries.map(entry => entry.key));
  } catch (error) {
    console.error('Failed to load notified reminders:', error);
    return new Set();
  }
};

// Helper: Save notified reminder to localStorage
const saveNotifiedReminder = (key: string): void => {
  // Only access localStorage in browser environment
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(NOTIFIED_REMINDERS_KEY);
    const data = stored ? JSON.parse(stored) : [];

    // Add new entry with timestamp
    data.push({ key, timestamp: Date.now() });

    localStorage.setItem(NOTIFIED_REMINDERS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save notified reminder:', error);
  }
};

export function useReminders(tasks: Task[], options?: UseRemindersOptions) {
  // Initialize with persisted reminders from localStorage
  const notifiedReminders = useRef<Set<string>>(loadNotifiedReminders());

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
    const nowTime = now.getTime();

    tasksRef.current.forEach((task) => {
      // Skip if no reminder or already completed
      if (!task.reminder || task.status === 'completed') {
        return;
      }

      const reminderTime = new Date(task.reminder);
      const reminderKey = `${task.id}-${task.reminder}`;

      // Validate reminder time
      // 1. Must be a valid date
      if (isNaN(reminderTime.getTime())) {
        console.warn(`Invalid reminder time for task ${task.id}:`, task.reminder);
        return;
      }

      const reminderTimestamp = reminderTime.getTime();
      const timeDiff = nowTime - reminderTimestamp;

      // 2. Reminder time must have passed (but not too long ago)
      // Only trigger if:
      // - Reminder time <= now (has arrived)
      // - Not too old (within last 24 hours to avoid old reminders)
      // - Not yet notified
      const hasArrived = reminderTimestamp <= nowTime;
      const notTooOld = timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours
      const notYetNotified = !notifiedReminders.current.has(reminderKey);

      if (hasArrived && notTooOld && notYetNotified) {
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

        // Mark as notified in memory and localStorage
        notifiedReminders.current.add(reminderKey);
        saveNotifiedReminder(reminderKey);
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
