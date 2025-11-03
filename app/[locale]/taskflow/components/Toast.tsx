/**
 * Toast Component - In-app notification toast
 */

'use client';

import { X, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  taskId?: string; // Optional taskId for opening task detail
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onTaskClick?: (taskId: string) => void;
}

export default function Toast({ toasts, onDismiss, onTaskClick }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
  onTaskClick,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  onTaskClick?: (taskId: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto dismiss
  useEffect(() => {
    const duration = toast.duration || 8000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-700 dark:text-green-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-100';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-700 dark:text-red-100';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-100';
    }
  };

  const handleToastClick = () => {
    console.log('Toast clicked, taskId:', toast.taskId);
    if (toast.taskId && onTaskClick) {
      console.log('Calling onTaskClick with taskId:', toast.taskId);
      onTaskClick(toast.taskId);
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    } else {
      console.log('No taskId or onTaskClick callback');
    }
  };

  return (
    <div
      onClick={handleToastClick}
      className={`flex min-w-[320px] max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${getTypeStyles()} ${toast.taskId ? 'cursor-pointer hover:shadow-xl' : ''}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">
        <Bell className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{toast.title}</h4>
        <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        {toast.taskId && (
          <p className="mt-1 text-xs opacity-70">Click to view task</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="flex-shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
