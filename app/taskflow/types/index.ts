/**
 * TaskFlow - Type Definitions
 */

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type ViewMode = 'list' | 'grid' | 'tree';

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'link' | 'file';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  isImportant: boolean;
  isMyDay: boolean;
  status: TaskStatus;
  projectId?: string;
  subTasks: SubTask[];
  attachments: Attachment[];
  assignedTo?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  taskIds: string[];
  members: string[];
  isShared: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  isImportant?: boolean;
  isMyDay?: boolean;
  projectId?: string;
  searchQuery?: string;
}
