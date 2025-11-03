/**
 * TaskFlow Client Component
 * Main client-side logic for TaskFlow
 */

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import ContactList from './components/ContactList';
import ContactDetail from './components/ContactDetail';
import DatePicker from './components/DatePicker';
import ReminderPicker from './components/ReminderPicker';
import RepeatPicker from './components/RepeatPicker';
import Toast, { ToastMessage } from './components/Toast';
import { useTasks } from './hooks/useTasks';
import { useProjects } from './hooks/useProjects';
import { useContacts } from './hooks/useContacts';
import { useReminders } from './hooks/useReminders';
import { Task, Contact, TaskFilters, RepeatSettings } from './types';

export default function TaskFlowClient() {
  const [activeView, setActiveView] = useState('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Quick add task properties
  const [quickAddDueDate, setQuickAddDueDate] = useState<string | undefined>();
  const [quickAddReminder, setQuickAddReminder] = useState<string | undefined>();
  const [quickAddRepeat, setQuickAddRepeat] = useState<RepeatSettings | undefined>();

  const { projects, createProject } = useProjects();
  const {
    contacts,
    loading: contactsLoading,
    updateContact,
    deleteContact,
    toggleImportant: toggleContactImportant,
  } = useContacts();

  // Get current project if viewing a project
  const currentProject = useMemo(() => {
    if (activeView.startsWith('project:')) {
      const projectId = activeView.replace('project:', '');
      return projects.find((p) => p.id === projectId);
    }
    return null;
  }, [activeView, projects]);

  // Get filters based on active view
  const filters: TaskFilters | undefined = useMemo(() => {
    // Project view
    if (activeView.startsWith('project:')) {
      const projectId = activeView.replace('project:', '');
      return { projectId };
    }

    // Standard views
    switch (activeView) {
      case 'my-day':
        return { isMyDay: true, status: 'pending' };
      case 'important':
        return { isImportant: true };
      case 'completed':
        return { status: 'completed' };
      case 'all':
      default:
        return undefined; // No filter - show all tasks
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

  // Toast notification handlers
  const addToast = useCallback((title: string, message: string, taskId?: string) => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      title,
      message,
      type: 'info',
      taskId,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle task click from notifications
  const handleTaskClick = useCallback((taskId: string) => {
    console.log('Opening task:', taskId);
    const task = tasks.find((t) => t.id === taskId);
    console.log('Found task:', task);
    if (task) {
      setSelectedTask(task);
    } else {
      console.warn('Task not found:', taskId);
    }
  }, [tasks]);

  // Monitor reminders
  useReminders(tasks, {
    onReminder: (notification) => {
      addToast(notification.title, notification.message, notification.taskId);
    },
  });

  // Listen for browser notification clicks
  useEffect(() => {
    const handleOpenTask = (event: Event) => {
      console.log('taskflow:openTask event received:', event);
      const customEvent = event as CustomEvent;
      const { taskId } = customEvent.detail || {};
      console.log('Extracted taskId:', taskId);
      if (taskId) {
        handleTaskClick(taskId);
      }
    };

    window.addEventListener('taskflow:openTask', handleOpenTask as EventListener);

    return () => {
      window.removeEventListener('taskflow:openTask', handleOpenTask as EventListener);
    };
  }, [handleTaskClick]);

  // Update selected task when tasks change
  useMemo(() => {
    if (selectedTask) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      setSelectedTask(updated || null);
    }
  }, [tasks, selectedTask]);

  // Update selected contact when contacts change
  useMemo(() => {
    if (selectedContact) {
      const updated = contacts.find((c) => c.id === selectedContact.id);
      setSelectedContact(updated || null);
    }
  }, [contacts, selectedContact]);

  // Group tasks by status for 'all' view
  const groupedTasks = useMemo(() => {
    if (activeView !== 'all') return null;

    return {
      pending: tasks.filter((t) => t.status === 'pending'),
      'in-progress': tasks.filter((t) => t.status === 'in-progress'),
      completed: tasks.filter((t) => t.status === 'completed'),
    };
  }, [activeView, tasks]);

  // Get view title
  const viewTitle = useMemo(() => {
    // Project view
    if (currentProject) {
      return currentProject.name;
    }

    // Standard views
    switch (activeView) {
      case 'my-day':
        return 'My Day';
      case 'important':
        return 'Important';
      case 'completed':
        return 'Completed';
      case 'contacts':
        return 'Contacts';
      case 'all':
      default:
        return 'All Tasks';
    }
  }, [activeView, currentProject]);

  // Quick add task
  const handleQuickAdd = () => {
    if (!newTaskTitle.trim()) return;

    createTask({
      title: newTaskTitle,
      description: '',
      dueDate: quickAddDueDate,
      reminder: quickAddReminder,
      repeat: quickAddRepeat,
      isImportant: activeView === 'important',
      isMyDay: activeView === 'my-day',
      status: 'pending',
      projectId: currentProject?.id, // Assign to current project if viewing one
      subTasks: [],
      attachments: [],
      createdBy: 'demo_user',
    });

    // Clear all quick add fields
    setNewTaskTitle('');
    setQuickAddDueDate(undefined);
    setQuickAddReminder(undefined);
    setQuickAddRepeat(undefined);
  };

  // Handle new project
  const handleNewProject = () => {
    const projectName = prompt('Enter project name:');
    if (!projectName?.trim()) return;

    const newProject = createProject({
      name: projectName.trim(),
      description: '',
      color: '#3b82f6',
      icon: '📁',
      members: ['demo_user'],
      isShared: false,
      createdBy: 'demo_user',
    });

    // Switch to new project view
    setActiveView(`project:${newProject.id}`);
  };

  if (loading || contactsLoading) {
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
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          onNewProject={handleNewProject}
        />
      </div>

      {/* Main Content - Task List */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className={`flex items-center justify-between ${activeView === 'contacts' ? '' : 'mb-4'}`}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {viewTitle}
            </h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {activeView === 'contacts'
                ? `${contacts.length} ${contacts.length === 1 ? 'contact' : 'contacts'}`
                : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`
              }
            </div>
          </div>

          {/* Quick Add - Only show for task views */}
          {activeView !== 'contacts' && (
            <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
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

            {/* Quick Add Options */}
            <div className="flex items-center gap-2 px-1">
              <DatePicker
                value={quickAddDueDate}
                onChange={setQuickAddDueDate}
                placeholder="Due date"
              />
              <ReminderPicker
                value={quickAddReminder}
                onChange={setQuickAddReminder}
                placeholder="Remind me"
              />
              <RepeatPicker
                value={quickAddRepeat}
                onChange={setQuickAddRepeat}
                placeholder="Repeat"
              />
            </div>
          </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeView === 'contacts' ? (
            // Contacts View
            <ContactList
              contacts={contacts}
              onToggleImportant={toggleContactImportant}
              onContactClick={(contact) => {
                setSelectedContact(contact);
                setSelectedTask(null); // Clear selected task
              }}
              emptyMessage="No contacts yet. Add your first contact!"
            />
          ) : activeView === 'all' && groupedTasks ? (
            // Grouped view for 'All Tasks'
            <div className="space-y-6">
              {/* Pending Tasks */}
              {groupedTasks.pending.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Pending
                    </h3>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {groupedTasks.pending.length} {groupedTasks.pending.length === 1 ? 'task' : 'tasks'}
                    </div>
                  </div>
                  <TaskList
                    tasks={groupedTasks.pending}
                    onToggleComplete={toggleComplete}
                    onToggleImportant={toggleImportant}
                    onTaskClick={(task) => setSelectedTask(task)}
                    emptyMessage="No pending tasks"
                    projects={projects}
                  />
                </div>
              )}

              {/* Divider */}
              {groupedTasks.pending.length > 0 && groupedTasks['in-progress'].length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-700" />
              )}

              {/* In Progress Tasks */}
              {groupedTasks['in-progress'].length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      In Progress
                    </h3>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {groupedTasks['in-progress'].length} {groupedTasks['in-progress'].length === 1 ? 'task' : 'tasks'}
                    </div>
                  </div>
                  <TaskList
                    tasks={groupedTasks['in-progress']}
                    onToggleComplete={toggleComplete}
                    onToggleImportant={toggleImportant}
                    onTaskClick={(task) => setSelectedTask(task)}
                    emptyMessage="No in-progress tasks"
                    projects={projects}
                  />
                </div>
              )}

              {/* Divider */}
              {(groupedTasks.pending.length > 0 || groupedTasks['in-progress'].length > 0) &&
                groupedTasks.completed.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700" />
                )}

              {/* Completed Tasks */}
              {groupedTasks.completed.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Completed
                    </h3>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {groupedTasks.completed.length} {groupedTasks.completed.length === 1 ? 'task' : 'tasks'}
                    </div>
                  </div>
                  <TaskList
                    tasks={groupedTasks.completed}
                    onToggleComplete={toggleComplete}
                    onToggleImportant={toggleImportant}
                    onTaskClick={(task) => setSelectedTask(task)}
                    emptyMessage="No completed tasks"
                    projects={projects}
                  />
                </div>
              )}

              {/* Empty state - when no tasks at all */}
              {groupedTasks.pending.length === 0 &&
                groupedTasks['in-progress'].length === 0 &&
                groupedTasks.completed.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-2 text-4xl">📝</div>
                    <p className="text-slate-500 dark:text-slate-400">
                      No tasks yet. Start adding tasks!
                    </p>
                  </div>
                )}
            </div>
          ) : (
            // Normal view for other filters
            <TaskList
              tasks={tasks}
              onToggleComplete={toggleComplete}
              onToggleImportant={toggleImportant}
              onTaskClick={(task) => setSelectedTask(task)}
              emptyMessage={`No ${viewTitle.toLowerCase()} yet. Start adding tasks!`}
              projects={projects}
            />
          )}
        </div>
      </div>

      {/* Right Sidebar - Task Detail or Contact Detail */}
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
      {selectedContact && (
        <div className="hidden w-96 lg:block">
          <ContactDetail
            contact={selectedContact}
            onClose={() => setSelectedContact(null)}
            onUpdate={updateContact}
            onDelete={deleteContact}
            onToggleImportant={toggleContactImportant}
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

      {/* Mobile: Full-screen Contact Detail Overlay */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-800 lg:hidden">
          <ContactDetail
            contact={selectedContact}
            onClose={() => setSelectedContact(null)}
            onUpdate={updateContact}
            onDelete={deleteContact}
            onToggleImportant={toggleContactImportant}
          />
        </div>
      )}

      {/* Mobile Sidebar Toggle - placeholder for mobile menu */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700">
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} onTaskClick={handleTaskClick} />
    </div>
  );
}
