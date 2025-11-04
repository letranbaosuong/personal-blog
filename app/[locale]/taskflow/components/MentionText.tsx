/**
 * MentionText Component
 * Renders text with clickable @mentions for tasks, projects, and contacts
 */

'use client';

import { Task, Project, Contact } from '../types';
import { CheckSquare, Folder, User } from 'lucide-react';
import LinkPreview from './LinkPreview';

interface MentionTextProps {
  text: string;
  tasks?: Task[];
  projects?: Project[];
  contacts?: Contact[];
  onTaskClick?: (task: Task) => void;
  onProjectClick?: (project: Project) => void;
  onContactClick?: (contact: Contact) => void;
}

interface ParsedSegment {
  type: 'text' | 'mention' | 'url';
  content: string;
  item?: Task | Project | Contact;
  itemType?: 'task' | 'project' | 'contact';
}

export default function MentionText({
  text,
  tasks = [],
  projects = [],
  contacts = [],
  onTaskClick,
  onProjectClick,
  onContactClick,
}: MentionTextProps) {
  // Parse URLs from text segment
  const parseUrls = (textContent: string): ParsedSegment[] => {
    // Regex to match URLs (http, https)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const segments: ParsedSegment[] = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(textContent)) !== null) {
      // Add text before URL
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: textContent.substring(lastIndex, match.index),
        });
      }

      // Add URL
      segments.push({
        type: 'url',
        content: match[1],
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < textContent.length) {
      segments.push({
        type: 'text',
        content: textContent.substring(lastIndex),
      });
    }

    // If no URLs found, return original text as single segment
    return segments.length > 0 ? segments : [{ type: 'text', content: textContent }];
  };

  // Parse text to find mentions with @[Name] format and URLs
  const parseText = (input: string): ParsedSegment[] => {
    if (!input) return [];

    const segments: ParsedSegment[] = [];
    // Match @[Name] format - supports names with spaces and special chars
    const mentionRegex = /@\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(input)) !== null) {
      // Add text before mention (and parse URLs within it)
      if (match.index > lastIndex) {
        const textBeforeMention = input.substring(lastIndex, match.index);
        const parsedUrls = parseUrls(textBeforeMention);
        segments.push(...parsedUrls);
      }

      const mentionName = match[1];

      // Try to find matching item
      const task = tasks.find(t => t.title === mentionName);
      const project = projects.find(p => p.name === mentionName);
      const contact = contacts.find(c => c.name === mentionName);

      if (task) {
        segments.push({
          type: 'mention',
          content: mentionName,
          item: task,
          itemType: 'task',
        });
      } else if (project) {
        segments.push({
          type: 'mention',
          content: mentionName,
          item: project,
          itemType: 'project',
        });
      } else if (contact) {
        segments.push({
          type: 'mention',
          content: mentionName,
          item: contact,
          itemType: 'contact',
        });
      } else {
        // Mention not found, render as plain text with brackets
        segments.push({
          type: 'text',
          content: `@[${mentionName}]`,
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text (and parse URLs within it)
    if (lastIndex < input.length) {
      const remainingText = input.substring(lastIndex);
      const parsedUrls = parseUrls(remainingText);
      segments.push(...parsedUrls);
    }

    return segments;
  };

  const segments = parseText(text);

  // Get icon for mention type
  const getIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-3 w-3" />;
      case 'project':
        return <Folder className="h-3 w-3" />;
      case 'contact':
        return <User className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Get color for mention type
  const getColorClass = (type: string) => {
    switch (type) {
      case 'task':
        return 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300';
      case 'project':
        return 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300';
      case 'contact':
        return 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300';
      default:
        return '';
    }
  };

  // Handle mention click
  const handleMentionClick = (segment: ParsedSegment) => {
    if (!segment.item || !segment.itemType) return;

    switch (segment.itemType) {
      case 'task':
        onTaskClick?.(segment.item as Task);
        break;
      case 'project':
        onProjectClick?.(segment.item as Project);
        break;
      case 'contact':
        onContactClick?.(segment.item as Contact);
        break;
    }
  };

  return (
    <div className="whitespace-pre-wrap break-words text-sm text-slate-900 dark:text-slate-100">
      {segments.map((segment, index) => {
        // Render plain text
        if (segment.type === 'text') {
          return <span key={index}>{segment.content}</span>;
        }

        // Render URL preview
        if (segment.type === 'url') {
          return <LinkPreview key={index} url={segment.content} />;
        }

        // Render clickable mention
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleMentionClick(segment)}
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium transition-colors ${getColorClass(
              segment.itemType!
            )} bg-opacity-10 hover:bg-opacity-20 ${
              segment.itemType === 'task'
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : segment.itemType === 'project'
                ? 'bg-purple-100 dark:bg-purple-900/30'
                : 'bg-green-100 dark:bg-green-900/30'
            }`}
            title={`Click to view ${segment.itemType}: ${segment.content}`}
          >
            {getIcon(segment.itemType!)}
            {segment.content}
          </button>
        );
      })}
    </div>
  );
}
