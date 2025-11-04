/**
 * MentionTextarea Component
 * Textarea with @ mention support for tasks, projects, and contacts
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, Project, Contact } from '../types';
import { CheckSquare, Folder, User } from 'lucide-react';
import MentionText from './MentionText';

interface MentionItem {
  id: string;
  name: string;
  type: 'task' | 'project' | 'contact';
}

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  tasks?: Task[];
  projects?: Project[];
  contacts?: Contact[];
  className?: string;
  // Navigation callbacks for clickable mentions in preview
  onTaskClick?: (task: Task) => void;
  onProjectClick?: (project: Project) => void;
  onContactClick?: (contact: Contact) => void;
}

export default function MentionTextarea({
  value,
  onChange,
  placeholder = 'Add notes...',
  rows = 4,
  tasks = [],
  projects = [],
  contacts = [],
  className = '',
  onTaskClick,
  onProjectClick,
  onContactClick,
}: MentionTextareaProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Combine all items for mentions
  const allMentionItems: MentionItem[] = [
    ...tasks.map(t => ({ id: t.id, name: t.title, type: 'task' as const })),
    ...projects.map(p => ({ id: p.id, name: p.name, type: 'project' as const })),
    ...contacts.map(c => ({ id: c.id, name: c.name, type: 'contact' as const })),
  ];

  // Filter mentions based on search
  const filteredMentions = mentionSearch
    ? allMentionItems.filter(item =>
        item.name.toLowerCase().includes(mentionSearch.toLowerCase())
      )
    : allMentionItems;

  // Get icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'project':
        return <Folder className="h-4 w-4" />;
      case 'contact':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Get color based on type
  const getColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'text-blue-600 dark:text-blue-400';
      case 'project':
        return 'text-purple-600 dark:text-purple-400';
      case 'contact':
        return 'text-green-600 dark:text-green-400';
      default:
        return '';
    }
  };

  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    onChange(newValue);
    setCursorPosition(cursorPos);

    // Check for @ mention
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Check if there's a space after @, if yes, don't show mentions
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionSearch(textAfterAt);
        setShowMentions(true);
        setSelectedIndex(0);
        return;
      }
    }

    setShowMentions(false);
  };

  // Handle mention selection
  const insertMention = (item: MentionItem) => {
    if (!textareaRef.current) return;

    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex === -1) return;

    // Insert mention with brackets format: @[Name]
    const mentionText = `@[${item.name}]`;
    const newValue =
      value.substring(0, lastAtIndex) +
      mentionText +
      ' ' +
      textAfterCursor;

    onChange(newValue);
    setShowMentions(false);

    // Set cursor position after mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = lastAtIndex + mentionText.length + 1;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredMentions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && filteredMentions.length > 0) {
      e.preventDefault();
      insertMention(filteredMentions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowMentions(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowMentions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (showMentions && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, showMentions]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={className}
      />

      {/* Mention Dropdown */}
      {showMentions && filteredMentions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-300 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-700"
        >
          {filteredMentions.map((item, index) => (
            <button
              key={`${item.type}-${item.id}`}
              type="button"
              onClick={() => insertMention(item)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-600'
              }`}
            >
              <span className={getColor(item.type)}>{getIcon(item.type)}</span>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      {showMentions && filteredMentions.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-500 shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
          No matches found. Try typing a task, project, or contact name.
        </div>
      )}

      {/* Live Preview with clickable mentions */}
      {value && value.includes('@[') && (
        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800">
          <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Preview (click to navigate):
          </div>
          <MentionText
            text={value}
            tasks={tasks}
            projects={projects}
            contacts={contacts}
            onTaskClick={onTaskClick}
            onProjectClick={onProjectClick}
            onContactClick={onContactClick}
          />
        </div>
      )}
    </div>
  );
}
