/**
 * Sidebar Component - Navigation sidebar
 */

'use client';

import { Home, Star, Sun, CheckCircle, Users, Plus } from 'lucide-react';
import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onNewProject?: () => void;
}

export default function Sidebar({ activeView, onViewChange, onNewProject }: SidebarProps) {
  const { projects, getProjectTaskCount } = useProjects();
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);

  const menuItems = [
    { id: 'my-day', label: 'My Day', icon: Sun, color: 'text-orange-600' },
    { id: 'important', label: 'Important', icon: Star, color: 'text-yellow-600' },
    { id: 'all', label: 'All Tasks', icon: Home, color: 'text-blue-600' },
    { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
    { id: 'contacts', label: 'Contacts', icon: Users, color: 'text-purple-600' },
  ];

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          TaskFlow
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Main menu items */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? item.color : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-slate-200 dark:border-slate-700" />

        {/* Projects Section */}
        <div className="space-y-1">
          {/* Projects Header */}
          <div className="mb-2 flex items-center justify-between px-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Projects
            </h3>
            <button
              onClick={onNewProject}
              className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              title="New project"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Project List */}
          {projects.map((project) => {
            const isActive = activeView === `project:${project.id}`;
            const taskCount = getProjectTaskCount(project.id);
            return (
              <button
                key={project.id}
                onClick={() => onViewChange(`project:${project.id}`)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-lg">{project.icon || '📁'}</span>
                  <span className="truncate">{project.name}</span>
                </div>
                {taskCount > 0 && (
                  <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    {taskCount}
                  </span>
                )}
              </button>
            );
          })}

          {/* Empty state */}
          {projects.length === 0 && (
            <p className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">
              No projects yet
            </p>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Built with Next.js & TypeScript
        </p>
      </div>
    </div>
  );
}
