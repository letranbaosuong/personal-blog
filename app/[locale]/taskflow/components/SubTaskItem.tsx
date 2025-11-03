/**
 * SubTaskItem Component - Display and manage a single sub-task
 * Reusable component for sub-task display
 */

'use client';

import { SubTask } from '../types';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';

interface SubTaskItemProps {
  subTask: SubTask;
  onToggle: () => void;
  onDelete: () => void;
  editable?: boolean;
}

export default function SubTaskItem({
  subTask,
  onToggle,
  onDelete,
  editable = true,
}: SubTaskItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="flex-shrink-0 text-slate-400 transition-colors hover:text-blue-600"
      >
        {subTask.isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </button>

      {/* Title */}
      <span
        className={`flex-1 text-sm ${
          subTask.isCompleted
            ? 'text-slate-500 line-through dark:text-slate-400'
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {subTask.title}
      </span>

      {/* Delete button */}
      {editable && (
        <button
          onClick={onDelete}
          className="flex-shrink-0 opacity-0 text-slate-400 transition-opacity hover:text-red-600 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
