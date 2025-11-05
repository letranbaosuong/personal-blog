/**
 * useTasks Hook - React hook for task management
 * Supports collaborative editing via Firebase when in shared mode
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilters } from '../types';
import { taskService } from '../lib/taskService';
import { updateSharedData, type ShareType } from '../lib/shareService';

interface ShareMode {
  code: string;
  type: ShareType;
}

interface UseTasksOptions {
  shareMode?: ShareMode | null;
}

export function useTasks(filters?: TaskFilters, options?: UseTasksOptions) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { shareMode } = options || {};

  // Load tasks
  const loadTasks = useCallback(() => {
    setLoading(true);
    try {
      const allTasks = filters
        ? taskService.getFilteredTasks(filters)
        : taskService.getTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Sync to Firebase when in shared mode
  const syncToFirebase = useCallback(
    async (task: Task) => {
      if (shareMode && shareMode.type === 'task') {
        try {
          await updateSharedData(shareMode.code, 'task', task);
        } catch (error) {
          console.error('Error syncing task to Firebase:', error);
        }
      }
    },
    [shareMode]
  );

  // Initialize
  useEffect(() => {
    taskService.initializeSampleData();
    loadTasks();
  }, [loadTasks]);

  // Create task
  const createTask = useCallback(
    (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newTask = taskService.createTask(task);
      loadTasks();
      return newTask;
    },
    [loadTasks]
  );

  // Update task
  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      const updated = taskService.updateTask(id, updates);
      if (updated) {
        loadTasks();
        // Sync to Firebase if in shared mode
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadTasks, syncToFirebase]
  );

  // Delete task
  const deleteTask = useCallback(
    (id: string) => {
      const success = taskService.deleteTask(id);
      if (success) loadTasks();
      return success;
    },
    [loadTasks]
  );

  // Toggle complete
  const toggleComplete = useCallback(
    async (id: string) => {
      const updated = taskService.toggleComplete(id);
      if (updated) {
        loadTasks();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadTasks, syncToFirebase]
  );

  // Toggle important
  const toggleImportant = useCallback(
    async (id: string) => {
      const updated = taskService.toggleImportant(id);
      if (updated) {
        loadTasks();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadTasks, syncToFirebase]
  );

  // Toggle my day
  const toggleMyDay = useCallback(
    async (id: string) => {
      const updated = taskService.toggleMyDay(id);
      if (updated) {
        loadTasks();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadTasks, syncToFirebase]
  );

  // Add sub-task
  const addSubTask = useCallback(
    async (taskId: string, title: string) => {
      const updated = taskService.addSubTask(taskId, title);
      if (updated) {
        loadTasks();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadTasks, syncToFirebase]
  );

  // Toggle sub-task
  const toggleSubTask = useCallback(
    async (taskId: string, subTaskId: string) => {
      const updated = taskService.toggleSubTask(taskId, subTaskId);
      if (updated) {
        loadTasks();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadTasks, syncToFirebase]
  );

  // Delete sub-task
  const deleteSubTask = useCallback(
    async (taskId: string, subTaskId: string) => {
      const updated = taskService.deleteSubTask(taskId, subTaskId);
      if (updated) {
        loadTasks();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadTasks, syncToFirebase]
  );

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleImportant,
    toggleMyDay,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    refresh: loadTasks,
  };
}
