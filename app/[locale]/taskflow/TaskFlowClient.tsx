/**
 * TaskFlow Client Component
 * Main client-side logic for TaskFlow
 */

'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import { useTasks } from './hooks/useTasks';
import { Task, TaskFilters } from './types';

export default function TaskFlowClient() {
  const [activeView, setActiveView] = useState('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Get filters based on active view
  const filters: TaskFilters | undefined = useMemo(() => {
    switch (activeView) {
      case 'my-day':
        return { isMyDay: true, status: 'pending' };
      case 'important':
        return { isImportant: true };
      case 'completed':
        return { status: 'completed' };
      case 'all':
      default:
        return { status: 'pending' };
    }
  }, [activeView]);

  const {
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
  } = useTasks(filters);

  // Update selected task when tasks change
  useMemo(() => {
    if (selectedTask) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      setSelectedTask(updated || null);
    }
  }, [tasks, selectedTask]);

  // Get view title
  const viewTitle = useMemo(() => {
    switch (activeView) {
      case 'my-day':
        return 'My Day';
      case 'important':
        return 'Important';
      case 'completed':
        return 'Completed';
      case 'all':
      default:
        return 'All Tasks';
    }
  }, [activeView]);

  // Quick add task
  const handleQuickAdd = () => {
    if (!newTaskTitle.trim()) return;

    createTask({
      title: newTaskTitle,
      description: '',
      isImportant: activeView === 'important',
      isMyDay: activeView === 'my-day',
      status: 'pending',
      subTasks: [],
      attachments: [],
      createdBy: 'demo_user',
    });

    setNewTaskTitle('');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="mb-4 text-6xl">⚡</div>
          <p className="text-slate-600 dark:text-slate-400">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - Navigation */}
      <div className="hidden w-64 md:block">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Main Content - Task List */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {viewTitle}
            </h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>

          {/* Quick Add */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
              placeholder="Add a task..."
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
            <button
              onClick={handleQuickAdd}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleComplete}
            onToggleImportant={toggleImportant}
            onTaskClick={(task) => setSelectedTask(task)}
            emptyMessage={`No ${viewTitle.toLowerCase()} yet. Start adding tasks!`}
          />
        </div>
      </div>

      {/* Right Sidebar - Task Detail */}
      {selectedTask && (
        <div className="hidden w-96 lg:block">
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onToggleImportant={toggleImportant}
            onToggleMyDay={toggleMyDay}
            onAddSubTask={addSubTask}
            onToggleSubTask={toggleSubTask}
            onDeleteSubTask={deleteSubTask}
          />
        </div>
      )}

      {/* Mobile: Full-screen Task Detail Overlay */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-800 lg:hidden">
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onToggleImportant={toggleImportant}
            onToggleMyDay={toggleMyDay}
            onAddSubTask={addSubTask}
            onToggleSubTask={toggleSubTask}
            onDeleteSubTask={deleteSubTask}
          />
        </div>
      )}

      {/* Mobile Sidebar Toggle - placeholder for mobile menu */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
