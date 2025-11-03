/**
 * useTasks Hook - React hook for task management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilters } from '../types';
import { taskService } from '../lib/taskService';

export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
    (id: string, updates: Partial<Task>) => {
      const updated = taskService.updateTask(id, updates);
      if (updated) loadTasks();
      return updated;
    },
    [loadTasks]
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
    (id: string) => {
      const updated = taskService.toggleComplete(id);
      if (updated) loadTasks();
      return updated;
    },
    [loadTasks]
  );

  // Toggle important
  const toggleImportant = useCallback(
    (id: string) => {
      const updated = taskService.toggleImportant(id);
      if (updated) loadTasks();
      return updated;
    },
    [loadTasks]
  );

  // Toggle my day
  const toggleMyDay = useCallback(
    (id: string) => {
      const updated = taskService.toggleMyDay(id);
      if (updated) loadTasks();
      return updated;
    },
    [loadTasks]
  );

  // Add sub-task
  const addSubTask = useCallback(
    (taskId: string, title: string) => {
      const updated = taskService.addSubTask(taskId, title);
      if (updated) loadTasks();
      return updated;
    },
    [loadTasks]
  );

  // Toggle sub-task
  const toggleSubTask = useCallback(
    (taskId: string, subTaskId: string) => {
      const updated = taskService.toggleSubTask(taskId, subTaskId);
      if (updated) loadTasks();
      return updated;
    },
    [loadTasks]
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
    refresh: loadTasks,
  };
}
