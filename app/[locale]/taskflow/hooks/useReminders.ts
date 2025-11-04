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

    console.log(`[Reminder Check] Running at ${now.toLocaleTimeString()}, checking ${tasksRef.current.length} tasks`);

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
        console.warn(`[Reminder] Invalid time for "${task.title}":`, task.reminder);
        return;
      }

      const reminderTimestamp = reminderTime.getTime();
      const timeDiff = nowTime - reminderTimestamp;
      const timeDiffMinutes = Math.floor(timeDiff / 60000);
      const timeDiffSeconds = Math.floor(timeDiff / 1000);

      // Check conditions
      const hasArrived = reminderTimestamp <= nowTime;
      const isRecent = timeDiff >= 0 && timeDiff < 15 * 60 * 1000; // Within 15 minutes (extended window)
      const notYetNotified = !notifiedReminders.current.has(reminderKey);

      // Comprehensive logging for debugging
      console.log(`[Reminder] Task: "${task.title}"`);
      console.log(`  - Reminder time: ${reminderTime.toLocaleString()}`);
      console.log(`  - Current time: ${now.toLocaleString()}`);
      console.log(`  - Time diff: ${timeDiffSeconds}s (${timeDiffMinutes}m)`);
      console.log(`  - Has arrived: ${hasArrived}`);
      console.log(`  - Is recent (< 15m): ${isRecent}`);
      console.log(`  - Not yet notified: ${notYetNotified}`);

      if (!hasArrived) {
        console.log(`  → SKIP: Reminder not yet arrived (in ${Math.abs(timeDiffMinutes)} minutes)`);
        return;
      }

      if (!isRecent) {
        console.log(`  → SKIP: Reminder too old (${timeDiffMinutes} minutes ago)`);
        return;
      }

      if (!notYetNotified) {
        console.log(`  → SKIP: Already notified`);
        return;
      }

      // All conditions met - trigger notification
      console.log(`  ✅ TRIGGERING NOTIFICATION!`);

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
    });
  }, []); // No dependencies - stable function

  // Request notification permission on mount
  useEffect(() => {
    if (notifications.isSupported()) {
      notifications.requestPermission();
    }
  }, []);

  // Schedule precise timeouts for upcoming reminders
  useEffect(() => {
    const scheduledTimeouts: NodeJS.Timeout[] = [];
    const now = Date.now();

    console.log(`[Reminder Schedule] Setting up precise timeouts for ${tasks.length} tasks`);

    tasks.forEach((task) => {
      if (!task.reminder || task.status === 'completed') return;

      const reminderTime = new Date(task.reminder);
      if (isNaN(reminderTime.getTime())) return;

      const reminderTimestamp = reminderTime.getTime();
      const delay = reminderTimestamp - now;
      const reminderKey = `${task.id}-${task.reminder}`;

      // Skip if already notified
      if (notifiedReminders.current.has(reminderKey)) {
        console.log(`[Reminder Schedule] Skip "${task.title}" - already notified`);
        return;
      }

      // Schedule timeout for reminders in the future (within next 24 hours)
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        const delayMinutes = Math.ceil(delay / 60000);
        console.log(`[Reminder Schedule] Scheduling "${task.title}" in ${delayMinutes} minutes`);

        const timeout = setTimeout(() => {
          console.log(`[Reminder Trigger] EXACT TIME REACHED for "${task.title}"`);
          checkReminders(); // Will trigger this specific reminder
        }, delay);

        scheduledTimeouts.push(timeout);
      }
      // For reminders that just passed (within 15 minutes), trigger immediately
      else if (delay < 0 && Math.abs(delay) < 15 * 60 * 1000) {
        console.log(`[Reminder Schedule] "${task.title}" just passed, checking immediately`);
        // Will be caught by the initial check below
      }
    });

    // Initial check for any reminders that already passed
    const initialTimeout = setTimeout(() => {
      checkReminders();
    }, 1000);

    // Backup interval check every 60 seconds (safety net)
    const backupInterval = setInterval(() => {
      console.log('[Reminder] Backup interval check');
      checkReminders();
    }, 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(backupInterval);
      scheduledTimeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [tasks, checkReminders]); // Re-run when tasks change

  return {
    notificationPermission: notifications.getPermission(),
    requestPermission: notifications.requestPermission,
  };
}
