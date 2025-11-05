/**
 * TaskDetail Component - Display and edit task details
 * Shows in right sidebar when a task is selected
 */

'use client';

import { Task, Project, Contact } from '../types';
import { X, Star, Calendar, Trash2, Plus, Sun, Edit2, Check, ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import SubTaskItem from './SubTaskItem';
import MentionTextarea from './MentionTextarea';
import MentionText from './MentionText';
import RichNotes, { toggleCheckboxInText } from './RichNotes';
import FormatHelpTooltip from './FormatHelpTooltip';
import { ShareButton } from './ShareButton';
import { ShareDialog } from './ShareDialog';
import { ShareIndicator } from './ShareIndicator';

interface TaskDetailProps {
  task: Task;
  tasks?: Task[];
  projects?: Project[];
  contacts?: Contact[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onToggleMyDay: (id: string) => void;
  onAddSubTask: (taskId: string, title: string) => void;
  onToggleSubTask: (taskId: string, subTaskId: string) => void;
  onDeleteSubTask: (taskId: string, subTaskId: string) => void;
  onTaskClick?: (task: Task) => void;
  onProjectClick?: (projectId: string) => void;
  onContactClick?: (contact: Contact) => void;
  onBack?: () => void;
}

export default function TaskDetail({
  task,
  tasks = [],
  projects = [],
  contacts = [],
  onClose,
  onUpdate,
  onDelete,
  onToggleImportant,
  onToggleMyDay,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onTaskClick,
  onProjectClick,
  onContactClick,
  onBack,
}: TaskDetailProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const notesEditorRef = useRef<HTMLDivElement>(null);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdate(task.id, { title: editedTitle.trim() });
    } else {
      setEditedTitle(task.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddSubTask = () => {
    if (newSubTaskTitle.trim()) {
      onAddSubTask(task.id, newSubTaskTitle.trim());
      setNewSubTaskTitle('');
    }
  };

  // Handle click outside to save notes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditingNotes &&
        notesEditorRef.current &&
        !notesEditorRef.current.contains(event.target as Node)
      ) {
        setIsEditingNotes(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditingNotes]);

  const completedSubTasks = task.subTasks.filter((st) => st.isCompleted).length;
  const totalSubTasks = task.subTasks.length;

  return (
    <div className="flex h-full flex-col border-l border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Task Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Title */}
        <div className="mb-6">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              className="w-full rounded-lg border border-blue-500 bg-white px-3 py-2 text-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-600 dark:bg-slate-700 dark:text-slate-100"
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              className="cursor-text rounded-lg px-3 py-2 text-lg font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {task.title}
            </h2>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => onToggleImportant(task.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              task.isImportant
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <Star className={`h-4 w-4 ${task.isImportant ? 'fill-yellow-400' : ''}`} />
            Important
          </button>
          <button
            onClick={() => onToggleMyDay(task.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              task.isMyDay
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <Sun className="h-4 w-4" />
            My Day
          </button>
          <ShareButton
            onClick={() => setIsShareDialogOpen(true)}
            variant="outline"
            size="md"
            label="Share"
          />
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Due Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-400" />
            <input
              type="datetime-local"
              value={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''}
              onChange={(e) =>
                onUpdate(task.id, {
                  dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                })
              }
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <span>Notes</span>
              <FormatHelpTooltip />
              {isEditingNotes && (
                <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                  (Type @ to mention tasks, projects, or contacts)
                </span>
              )}
            </label>
            {!isEditingNotes && task.description && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                title="Edit notes"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {isEditingNotes ? (
            <div ref={notesEditorRef}>
              <MentionTextarea
                value={task.description || ''}
                onChange={(value) => onUpdate(task.id, { description: value })}
                placeholder="Add notes... (Type @ to mention)"
                rows={4}
                tasks={tasks}
                projects={projects}
                contacts={contacts}
                onTaskClick={onTaskClick}
                onProjectClick={(project) => onProjectClick?.(project.id)}
                onContactClick={onContactClick}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingNotes(false)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Check className="h-4 w-4" />
                  OK
                </button>
              </div>
            </div>
          ) : task.description ? (
            <div className="rounded-lg border border-transparent p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">
              <RichNotes
                text={task.description}
                tasks={tasks}
                projects={projects}
                contacts={contacts}
                onTaskClick={onTaskClick}
                onProjectClick={(project) => onProjectClick?.(project.id)}
                onContactClick={onContactClick}
                onCheckboxToggle={(lineIndex) => {
                  const newDescription = toggleCheckboxInText(task.description || '', lineIndex);
                  onUpdate(task.id, { description: newDescription });
                }}
                readOnly={false}
              />
            </div>
          ) : (
            <div
              onClick={() => setIsEditingNotes(true)}
              className="cursor-text rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500"
            >
              Add notes... (Type @ to mention)
            </div>
          )}
        </div>

        {/* Sub-tasks */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Sub-tasks
            </label>
            {totalSubTasks > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {completedSubTasks}/{totalSubTasks} completed
              </span>
            )}
          </div>

          {/* Progress bar */}
          {totalSubTasks > 0 && (
            <div className="mb-3 h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${(completedSubTasks / totalSubTasks) * 100}%` }}
              />
            </div>
          )}

          {/* Sub-task list */}
          <div className="space-y-1 mb-3">
            {task.subTasks.map((subTask) => (
              <SubTaskItem
                key={subTask.id}
                subTask={subTask}
                onToggle={() => onToggleSubTask(task.id, subTask.id)}
                onDelete={() => onDeleteSubTask(task.id, subTask.id)}
              />
            ))}
          </div>

          {/* Add sub-task */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubTaskTitle}
              onChange={(e) => setNewSubTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
              placeholder="Add a step..."
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
            <button
              onClick={handleAddSubTask}
              className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select
            value={task.status}
            onChange={(e) =>
              onUpdate(task.id, { status: e.target.value as Task['status'] })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Created date */}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Created {new Date(task.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Footer - Delete button */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this task?')) {
              onDelete(task.id);
              onClose();
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <Trash2 className="h-4 w-4" />
          Delete Task
        </button>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        data={task}
        type="task"
        title="Share Task"
      />
    </div>
  );
}
