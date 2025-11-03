/**
 * Sidebar Component - Navigation sidebar
 */

'use client';

import { Home, Star, Sun, CheckCircle, Folder, Plus } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'my-day', label: 'My Day', icon: Sun, color: 'text-orange-600' },
    { id: 'important', label: 'Important', icon: Star, color: 'text-yellow-600' },
    { id: 'all', label: 'All Tasks', icon: Home, color: 'text-blue-600' },
    { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
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
      <nav className="flex-1 space-y-1 p-2">
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
