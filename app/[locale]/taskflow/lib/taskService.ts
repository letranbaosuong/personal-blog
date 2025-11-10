/**
 * Task Service - Business logic for task management
 */

import { Task, SubTask, TaskFilters } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { syncTasksToFirestore } from './firestore-sync';

export const taskService = {
  // Get all tasks
  getTasks: (): Task[] => {
    return storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
  },

  // Get task by ID
  getTaskById: (id: string): Task | null => {
    const tasks = taskService.getTasks();
    return tasks.find((task) => task.id === id) || null;
  },

  // Get filtered tasks
  getFilteredTasks: (filters: TaskFilters): Task[] => {
    let tasks = taskService.getTasks();

    if (filters.status) {
      tasks = tasks.filter((task) => task.status === filters.status);
    }

    if (filters.isImportant !== undefined) {
      tasks = tasks.filter((task) => task.isImportant === filters.isImportant);
    }

    if (filters.isMyDay !== undefined) {
      tasks = tasks.filter((task) => task.isMyDay === filters.isMyDay);
    }

    if (filters.projectId) {
      tasks = tasks.filter((task) => task.projectId === filters.projectId);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Sort: Important tasks first, then by due date, then by creation date
    return tasks.sort((a, b) => {
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  // Create new task
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const tasks = taskService.getTasks();
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    storage.set(STORAGE_KEYS.TASKS, tasks);

    // Sync to Firestore (for email users)
    syncTasksToFirestore(tasks).catch((error) =>
      console.error('Failed to sync task to Firestore:', error)
    );

    return newTask;
  },

  // Update task
  updateTask: (id: string, updates: Partial<Task>): Task | null => {
    const tasks = taskService.getTasks();
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    const updatedTask = {
      ...tasks[index],
      ...updates,
      id: tasks[index].id, // Preserve ID
      createdAt: tasks[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    storage.set(STORAGE_KEYS.TASKS, tasks);

    // Sync to Firestore (for email users)
    syncTasksToFirestore(tasks).catch((error) =>
      console.error('Failed to sync task update to Firestore:', error)
    );

    return updatedTask;
  },

  // Delete task
  deleteTask: (id: string): boolean => {
    const tasks = taskService.getTasks();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    if (filteredTasks.length === tasks.length) return false;
    storage.set(STORAGE_KEYS.TASKS, filteredTasks);

    // Sync to Firestore (for email users)
    syncTasksToFirestore(filteredTasks).catch((error) =>
      console.error('Failed to sync task deletion to Firestore:', error)
    );

    return true;
  },

  // Toggle task completion
  toggleComplete: (id: string): Task | null => {
    const task = taskService.getTaskById(id);
    if (!task) return null;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    return taskService.updateTask(id, { status: newStatus });
  },

  // Toggle important
  toggleImportant: (id: string): Task | null => {
    const task = taskService.getTaskById(id);
    if (!task) return null;
    return taskService.updateTask(id, { isImportant: !task.isImportant });
  },

  // Toggle my day
  toggleMyDay: (id: string): Task | null => {
    const task = taskService.getTaskById(id);
    if (!task) return null;
    return taskService.updateTask(id, { isMyDay: !task.isMyDay });
  },

  // Add sub-task
  addSubTask: (taskId: string, title: string): Task | null => {
    const task = taskService.getTaskById(taskId);
    if (!task) return null;

    const newSubTask: SubTask = {
      id: `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      isCompleted: false,
    };

    const updatedSubTasks = [...task.subTasks, newSubTask];
    return taskService.updateTask(taskId, { subTasks: updatedSubTasks });
  },

  // Toggle sub-task
  toggleSubTask: (taskId: string, subTaskId: string): Task | null => {
    const task = taskService.getTaskById(taskId);
    if (!task) return null;

    const updatedSubTasks = task.subTasks.map((st) =>
      st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st
    );

    // Auto-complete main task if all sub-tasks are done
    const allCompleted = updatedSubTasks.every((st) => st.isCompleted);
    const updates: Partial<Task> = { subTasks: updatedSubTasks };
    if (allCompleted && updatedSubTasks.length > 0) {
      updates.status = 'completed';
    }

    return taskService.updateTask(taskId, updates);
  },

  // Delete sub-task
  deleteSubTask: (taskId: string, subTaskId: string): Task | null => {
    const task = taskService.getTaskById(taskId);
    if (!task) return null;

    const updatedSubTasks = task.subTasks.filter((st) => st.id !== subTaskId);
    return taskService.updateTask(taskId, { subTasks: updatedSubTasks });
  },

  // Initialize with sample data
  initializeSampleData: (): void => {
    const existingTasks = taskService.getTasks();
    if (existingTasks.length > 0) return; // Already has data

    const sampleTasks: Task[] = [
      {
        id: 'task_1',
        title: 'Welcome to TaskFlow!',
        description: 'Get started by creating your first task or project.',
        dueDate: new Date().toISOString(),
        isImportant: true,
        isMyDay: true,
        status: 'pending',
        subTasks: [
          { id: 'st_1', title: 'Explore the interface', isCompleted: false },
          { id: 'st_2', title: 'Create a new task', isCompleted: false },
          { id: 'st_3', title: 'Mark tasks as important', isCompleted: false },
        ],
        attachments: [],
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Hamaco Project tasks
      {
        id: 'task_hamaco_1',
        title: 'Review Q4 business performance',
        description: 'Analyze sales data and prepare quarterly report',
        projectId: 'project_hamaco',
        isImportant: false,
        isMyDay: false,
        status: 'in-progress',
        subTasks: [
          { id: 'st_h1', title: 'Collect sales data', isCompleted: true },
          { id: 'st_h2', title: 'Create presentation', isCompleted: false },
        ],
        attachments: [],
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_hamaco_2',
        title: 'Update client database',
        description: 'Sync customer information with CRM system',
        projectId: 'project_hamaco',
        isImportant: true,
        isMyDay: false,
        status: 'pending',
        subTasks: [],
        attachments: [],
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Herbalife project tasks
      {
        id: 'task_herbalife_1',
        title: 'Plan nutrition workshop',
        description: 'Organize monthly wellness event for members',
        projectId: 'project_herbalife',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isImportant: true,
        isMyDay: true,
        status: 'pending',
        subTasks: [
          { id: 'st_hb1', title: 'Book venue', isCompleted: false },
          { id: 'st_hb2', title: 'Prepare materials', isCompleted: false },
          { id: 'st_hb3', title: 'Send invitations', isCompleted: false },
        ],
        attachments: [],
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'task_herbalife_2',
        title: 'Order product inventory',
        description: 'Restock popular nutrition supplements',
        projectId: 'project_herbalife',
        isImportant: false,
        isMyDay: false,
        status: 'completed',
        subTasks: [],
        attachments: [],
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    storage.set(STORAGE_KEYS.TASKS, sampleTasks);
  },
};
