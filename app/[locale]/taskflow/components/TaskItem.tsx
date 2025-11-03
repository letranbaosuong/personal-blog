/**
 * TaskItem Component - Display a single task
 */

'use client';

import { Task } from '../types';
import { CheckCircle2, Circle, Star, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onClick?: () => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onToggleImportant,
  onClick,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedSubTasks = task.subTasks.filter((st) => st.isCompleted).length;
  const totalSubTasks = task.subTasks.length;
  const hasSubTasks = totalSubTasks > 0;

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div
      className={`group rounded-lg border bg-white p-4 transition-all hover:shadow-md dark:bg-slate-800 ${
        task.status === 'completed'
          ? 'border-slate-200 opacity-60 dark:border-slate-700'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          className="mt-0.5 flex-shrink-0 text-slate-400 transition-colors hover:text-blue-600"
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 cursor-pointer" onClick={onClick}>
          {/* Title & Important */}
          <div className="flex items-start gap-2">
            {hasSubTasks && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <h3
              className={`flex-1 text-sm font-medium ${
                task.status === 'completed'
                  ? 'text-slate-500 line-through dark:text-slate-400'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleImportant(task.id);
              }}
              className="flex-shrink-0"
            >
              <Star
                className={`h-4 w-4 transition-colors ${
                  task.isImportant
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 hover:text-yellow-400 dark:text-slate-600'
                }`}
              />
            </button>
          </div>

          {/* Description */}
          {task.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
              {task.description}
            </p>
          )}

          {/* Sub-tasks progress */}
          {hasSubTasks && !isExpanded && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${(completedSubTasks / totalSubTasks) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {completedSubTasks}/{totalSubTasks}
              </span>
            </div>
          )}

          {/* Expanded sub-tasks */}
          {hasSubTasks && isExpanded && (
            <div className="mt-2 space-y-1 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              {task.subTasks.map((subTask) => (
                <div key={subTask.id} className="flex items-center gap-2">
                  <Circle className={`h-3 w-3 ${subTask.isCompleted ? 'text-blue-600 fill-blue-600' : 'text-slate-300'}`} />
                  <span
                    className={`text-xs ${
                      subTask.isCompleted
                        ? 'text-slate-500 line-through'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {subTask.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Meta info */}
          <div className="mt-2 flex items-center gap-3">
            {task.dueDate && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  isOverdue ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}
            {task.projectId && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Project
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
