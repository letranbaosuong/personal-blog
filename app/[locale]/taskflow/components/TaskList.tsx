/**
 * TaskList Component - Display list of tasks
 */

'use client';

import { Task, Project } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onTaskClick?: (task: Task) => void;
  emptyMessage?: string;
  projects?: Project[]; // List of projects to display project names
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onToggleImportant,
  onTaskClick,
  emptyMessage = 'No tasks yet. Create one to get started!',
  projects = [],
}: TaskListProps) {
  // Helper to get project name by ID
  const getProjectName = (projectId?: string): string | undefined => {
    if (!projectId) return undefined;
    const project = projects.find((p) => p.id === projectId);
    return project?.name;
  };
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-6xl">📝</div>
        <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onToggleImportant={onToggleImportant}
          onClick={() => onTaskClick?.(task)}
          projectName={getProjectName(task.projectId)}
        />
      ))}
    </div>
  );
}
