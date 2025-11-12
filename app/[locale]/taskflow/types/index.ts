/**
 * TaskFlow - Type Definitions
 */

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type ViewMode = 'list' | 'grid' | 'tree';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RepeatSettings {
  type: RepeatType;
  interval?: number; // e.g., every 2 days
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  endDate?: string; // ISO date string
}

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
  reminder?: string; // ISO date string
  repeat?: RepeatSettings;
  isImportant: boolean;
  isMyDay: boolean;
  status: TaskStatus;
  projectId?: string;
  subTasks: SubTask[];
  attachments: Attachment[];
  assignedTo?: string[];
  mindmap?: Mindmap; // Optional mindmap for this task
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
  age?: number;
  dateOfBirth?: string; // ISO date string
  email?: string;
  phone?: string;
  occupation?: string; // Họ làm gì
  location?: string; // Nơi gặp
  meetingDate?: string; // Gặp khi nào (ISO date string)
  meetingOccasion?: string; // Gặp họ trong dịp nào
  company?: string; // Công ty
  relationship?: string; // Mối quan hệ (bạn, đồng nghiệp, khách hàng, etc.)
  socialMedia?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    zalo?: string;
  };
  avatar?: string;
  notes?: string;
  tags?: string[]; // Tags để phân loại
  isImportant?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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

// Mindmap types
export type MindmapLayoutType = 'tree' | 'radial' | 'free';

export interface MindmapNode {
  id: string;
  label: string;
  description?: string;
  color?: string;
  position: { x: number; y: number };
  parentId?: string;
  isCollapsed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MindmapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface Mindmap {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  layoutType: MindmapLayoutType;
  centerNode?: string;
}
