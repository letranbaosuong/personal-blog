/**
 * TaskFlow Client Component
 * Main client-side logic for TaskFlow
 */

'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import ContactList from './components/ContactList';
import ContactDetail from './components/ContactDetail';
import ContactForm from './components/ContactForm';
import DatePicker from './components/DatePicker';
import ReminderPicker from './components/ReminderPicker';
import RepeatPicker from './components/RepeatPicker';
import Toast, { ToastMessage } from './components/Toast';
import { ShareTestPanel } from './components/ShareTestPanel';
import { useTasks } from './hooks/useTasks';
import { useProjects } from './hooks/useProjects';
import { useContacts } from './hooks/useContacts';
import { useReminders } from './hooks/useReminders';
import { useShare } from './hooks/useShare';
import { Task, Contact, TaskFilters, RepeatSettings, Project } from './types';
import { storage, STORAGE_KEYS } from './lib/storage';
import type { ShareType } from './lib/shareService';

type NavigationHistoryItem = {
  type: 'task' | 'contact';
  id: string;
};

export default function TaskFlowClient() {
  // Get URL search params for shared items
  const searchParams = useSearchParams();
  const shareCode = searchParams.get('share');
  const shareType = searchParams.get('type') as ShareType | null;

  // Load activeView from localStorage, default to 'all' if not found
  const [activeView, setActiveView] = useState(() => {
    const saved = storage.get<string>(STORAGE_KEYS.ACTIVE_VIEW);
    return saved || 'all';
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryItem[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Track if shared data has been initially loaded (to avoid showing toast on first load)
  const sharedDataInitialLoadRef = useRef(false);

  // Save activeView to localStorage when it changes
  useEffect(() => {
    storage.set(STORAGE_KEYS.ACTIVE_VIEW, activeView);
  }, [activeView]);

  // Save selected task/contact ID to localStorage when they change
  useEffect(() => {
    if (selectedTask) {
      storage.set(STORAGE_KEYS.SELECTED_TASK_ID, selectedTask.id);
      storage.remove(STORAGE_KEYS.SELECTED_CONTACT_ID);
    } else if (selectedContact) {
      storage.set(STORAGE_KEYS.SELECTED_CONTACT_ID, selectedContact.id);
      storage.remove(STORAGE_KEYS.SELECTED_TASK_ID);
    } else {
      storage.remove(STORAGE_KEYS.SELECTED_TASK_ID);
      storage.remove(STORAGE_KEYS.SELECTED_CONTACT_ID);
    }
  }, [selectedTask, selectedContact]);

  // Quick add task properties
  const [quickAddDueDate, setQuickAddDueDate] = useState<string | undefined>();
  const [quickAddReminder, setQuickAddReminder] = useState<string | undefined>();
  const [quickAddRepeat, setQuickAddRepeat] = useState<RepeatSettings | undefined>();

  const { projects, createProject, getProjectTaskCount } = useProjects();
  const {
    contacts,
    loading: contactsLoading,
    createContact,
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

  // Memoized sync update callback to prevent infinite loop
  const handleSyncUpdate = useCallback((data: any) => {
    // Only show toast for real-time updates, not initial load
    if (sharedDataInitialLoadRef.current && data && shareType) {
      addToast(
        'Sync Update',
        `${shareType.charAt(0).toUpperCase() + shareType.slice(1)} has been updated`
      );
    }
  }, [shareType, addToast]);

  // Share hook for loading shared data
  const { loadShared, sharedData, isLoading: isLoadingShared, error: shareError } = useShare({
    autoSync: true,
    onSyncUpdate: handleSyncUpdate,
  });

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

  // Navigation handlers with history
  const navigateToTask = useCallback((task: Task) => {
    // Save current item to history if exists
    if (selectedTask) {
      setNavigationHistory((prev) => [...prev, { type: 'task', id: selectedTask.id }]);
    } else if (selectedContact) {
      setNavigationHistory((prev) => [...prev, { type: 'contact', id: selectedContact.id }]);
    }
    setSelectedTask(task);
    setSelectedContact(null);
  }, [selectedTask, selectedContact]);

  const navigateToContact = useCallback((contact: Contact) => {
    // Save current item to history if exists
    if (selectedTask) {
      setNavigationHistory((prev) => [...prev, { type: 'task', id: selectedTask.id }]);
    } else if (selectedContact) {
      setNavigationHistory((prev) => [...prev, { type: 'contact', id: selectedContact.id }]);
    }
    setSelectedContact(contact);
    setSelectedTask(null);
  }, [selectedTask, selectedContact]);

  const handleBack = useCallback(() => {
    if (navigationHistory.length === 0) return;

    const previousItem = navigationHistory[navigationHistory.length - 1];
    setNavigationHistory((prev) => prev.slice(0, -1));

    if (previousItem.type === 'task') {
      const task = tasks.find((t) => t.id === previousItem.id);
      if (task) {
        setSelectedTask(task);
        setSelectedContact(null);
      }
    } else {
      const contact = contacts.find((c) => c.id === previousItem.id);
      if (contact) {
        setSelectedContact(contact);
        setSelectedTask(null);
      }
    }
  }, [navigationHistory, tasks, contacts]);

  // Monitor reminders
  const reminderOptions = useMemo(() => ({
    onReminder: (notification: any) => {
      addToast(notification.title, notification.message, notification.taskId);
    },
  }), [addToast]);

  useReminders(tasks, reminderOptions);

  // Restore selected task/contact from localStorage after data loads
  useEffect(() => {
    // Only restore once when tasks and contacts are loaded and no selection exists
    if (!loading && !contactsLoading && !selectedTask && !selectedContact) {
      const savedTaskId = storage.get<string>(STORAGE_KEYS.SELECTED_TASK_ID);
      const savedContactId = storage.get<string>(STORAGE_KEYS.SELECTED_CONTACT_ID);

      if (savedTaskId) {
        const task = tasks.find((t) => t.id === savedTaskId);
        if (task) {
          setSelectedTask(task);
        } else {
          // Task not found, clear storage
          storage.remove(STORAGE_KEYS.SELECTED_TASK_ID);
        }
      } else if (savedContactId) {
        const contact = contacts.find((c) => c.id === savedContactId);
        if (contact) {
          setSelectedContact(contact);
        } else {
          // Contact not found, clear storage
          storage.remove(STORAGE_KEYS.SELECTED_CONTACT_ID);
        }
      }
    }
  }, [loading, contactsLoading, tasks, contacts, selectedTask, selectedContact]);

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

  // Load shared data from URL params (only once when params change)
  useEffect(() => {
    if (shareCode && shareType) {
      // Reset initial load flag
      sharedDataInitialLoadRef.current = false;
      loadShared(shareCode, shareType);
    }
    // Only depend on shareCode and shareType to avoid re-loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareCode, shareType]);

  // Display shared data when loaded (only on initial load, not on sync updates)
  useEffect(() => {
    if (sharedData && shareType && !sharedDataInitialLoadRef.current) {
      // Mark as initially loaded
      sharedDataInitialLoadRef.current = true;

      if (shareType === 'task') {
        const sharedTask = sharedData.data as Task;
        setSelectedTask(sharedTask);
        setSelectedContact(null);
        addToast(
          'Shared Task Loaded',
          `Viewing shared task: ${sharedTask.title}`
        );
      } else if (shareType === 'contact') {
        const sharedContact = sharedData.data as Contact;
        setSelectedContact(sharedContact);
        setSelectedTask(null);
        addToast(
          'Shared Contact Loaded',
          `Viewing shared contact: ${sharedContact.name}`
        );
      } else if (shareType === 'project') {
        const sharedProject = sharedData.data as Project;
        setActiveView(`project:${sharedProject.id}`);
        addToast(
          'Shared Project Loaded',
          `Viewing shared project: ${sharedProject.name}`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedData?.shareCode, shareType]);

  // Update local state when shared data syncs (without showing toast)
  useEffect(() => {
    if (sharedData && shareType && sharedDataInitialLoadRef.current) {
      // Only update local state for subsequent sync updates
      if (shareType === 'task') {
        const sharedTask = sharedData.data as Task;
        setSelectedTask(sharedTask);
      } else if (shareType === 'contact') {
        const sharedContact = sharedData.data as Contact;
        setSelectedContact(sharedContact);
      }
      // Note: Project view doesn't need updating as it's already set to project view
    }
    // Only depend on lastSync to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedData?.lastSync]);

  // Show error toast if share loading fails
  useEffect(() => {
    if (shareError) {
      addToast(
        'Error Loading Shared Item',
        shareError
      );
    }
  }, [shareError]);

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
          projects={projects}
          getProjectTaskCount={getProjectTaskCount}
        />
      </div>

      {/* Main Content - Task List */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className={`flex items-center justify-between ${activeView === 'contacts' ? '' : 'mb-4'}`}>
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {viewTitle}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {activeView === 'contacts'
                  ? `${contacts.length} ${contacts.length === 1 ? 'contact' : 'contacts'}`
                  : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`
                }
              </div>
              {activeView === 'contacts' && (
                <button
                  onClick={() => setIsContactFormOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Contact
                </button>
              )}
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
            tasks={tasks}
            projects={projects}
            contacts={contacts}
            onClose={() => {
              setSelectedTask(null);
              setNavigationHistory([]);
            }}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onToggleImportant={toggleImportant}
            onToggleMyDay={toggleMyDay}
            onAddSubTask={addSubTask}
            onToggleSubTask={toggleSubTask}
            onDeleteSubTask={deleteSubTask}
            onTaskClick={navigateToTask}
            onProjectClick={(projectId) => setActiveView(`project:${projectId}`)}
            onContactClick={navigateToContact}
            onBack={navigationHistory.length > 0 ? handleBack : undefined}
          />
        </div>
      )}
      {selectedContact && (
        <div className="hidden w-96 lg:block">
          <ContactDetail
            contact={selectedContact}
            tasks={tasks}
            projects={projects}
            contacts={contacts}
            onClose={() => {
              setSelectedContact(null);
              setNavigationHistory([]);
            }}
            onUpdate={updateContact}
            onDelete={deleteContact}
            onToggleImportant={toggleContactImportant}
            onTaskClick={navigateToTask}
            onProjectClick={(projectId) => setActiveView(`project:${projectId}`)}
            onContactClick={navigateToContact}
            onBack={navigationHistory.length > 0 ? handleBack : undefined}
          />
        </div>
      )}

      {/* Mobile: Full-screen Task Detail Overlay */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-800 lg:hidden">
          <TaskDetail
            task={selectedTask}
            tasks={tasks}
            projects={projects}
            contacts={contacts}
            onClose={() => {
              setSelectedTask(null);
              setNavigationHistory([]);
            }}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onToggleImportant={toggleImportant}
            onToggleMyDay={toggleMyDay}
            onAddSubTask={addSubTask}
            onToggleSubTask={toggleSubTask}
            onDeleteSubTask={deleteSubTask}
            onTaskClick={navigateToTask}
            onProjectClick={(projectId) => setActiveView(`project:${projectId}`)}
            onContactClick={navigateToContact}
            onBack={navigationHistory.length > 0 ? handleBack : undefined}
          />
        </div>
      )}

      {/* Mobile: Full-screen Contact Detail Overlay */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-800 lg:hidden">
          <ContactDetail
            contact={selectedContact}
            tasks={tasks}
            projects={projects}
            contacts={contacts}
            onClose={() => {
              setSelectedContact(null);
              setNavigationHistory([]);
            }}
            onUpdate={updateContact}
            onDelete={deleteContact}
            onToggleImportant={toggleContactImportant}
            onTaskClick={navigateToTask}
            onProjectClick={(projectId) => setActiveView(`project:${projectId}`)}
            onContactClick={navigateToContact}
            onBack={navigationHistory.length > 0 ? handleBack : undefined}
          />
        </div>
      )}

      {/* Mobile Sidebar Toggle - placeholder for mobile menu */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700">
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <div className="relative flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              {/* Close Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Sidebar Content */}
              <Sidebar
                activeView={activeView}
                onViewChange={(view) => {
                  setActiveView(view);
                  setIsMobileSidebarOpen(false);
                }}
                onNewProject={() => {
                  handleNewProject();
                  setIsMobileSidebarOpen(false);
                }}
                projects={projects}
                getProjectTaskCount={getProjectTaskCount}
              />
            </div>
          </div>
        </>
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} onTaskClick={handleTaskClick} />

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        onCreate={(contact) => {
          createContact(contact);
          setIsContactFormOpen(false);
        }}
      />

      {/* Firebase Test Panel (Developer Tool) */}
      <ShareTestPanel />
    </div>
  );
}
