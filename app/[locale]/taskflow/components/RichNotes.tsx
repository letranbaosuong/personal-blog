/**
 * RichNotes Component - Rich text formatting for notes
 * Supports checkboxes, tree structure, and mentions
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';
import MentionText from './MentionText';
import { Task, Project, Contact } from '../types';

/**
 * Helper function to toggle checkbox state in text
 */
export function toggleCheckboxInText(text: string, lineIndex: number): string {
  const lines = text.split('\n');

  if (lineIndex < 0 || lineIndex >= lines.length) {
    return text;
  }

  const line = lines[lineIndex];

  // Toggle - [ ] to - [x] or vice versa
  if (line.match(/^(\s*)-\s*\[\s\]/)) {
    lines[lineIndex] = line.replace(/^(\s*)-\s*\[\s\]/, '$1- [x]');
  } else if (line.match(/^(\s*)-\s*\[x\]/i)) {
    lines[lineIndex] = line.replace(/^(\s*)-\s*\[x\]/i, '$1- [ ]');
  }

  return lines.join('\n');
}

interface RichNotesProps {
  text: string;
  tasks?: Task[];
  projects?: Project[];
  contacts?: Contact[];
  onTaskClick?: (task: Task) => void;
  onProjectClick?: (project: Project) => void;
  onContactClick?: (contact: Contact) => void;
  onCheckboxToggle?: (lineIndex: number) => void;
  readOnly?: boolean;
}

interface ParsedLine {
  type: 'checkbox' | 'tree' | 'text';
  indent: number;
  checked?: boolean;
  content: string;
  lineIndex: number;
}

export default function RichNotes({
  text,
  tasks = [],
  projects = [],
  contacts = [],
  onTaskClick,
  onProjectClick,
  onContactClick,
  onCheckboxToggle,
  readOnly = true,
}: RichNotesProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());

  // Parse text into structured lines
  const parseText = (input: string): ParsedLine[] => {
    if (!input) return [];

    const lines = input.split('\n');
    return lines.map((line, index) => {
      // Count indentation (spaces or tabs)
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
      const trimmedLine = line.trim();

      // Checkbox syntax: - [ ] or - [x]
      const checkboxMatch = trimmedLine.match(/^-\s*\[([ x])\]\s*(.+)$/i);
      if (checkboxMatch) {
        return {
          type: 'checkbox',
          indent,
          checked: checkboxMatch[1].toLowerCase() === 'x',
          content: checkboxMatch[2],
          lineIndex: index,
        };
      }

      // Tree header syntax: ▼ or ▶ at start
      const treeMatch = trimmedLine.match(/^[▼▶]\s*(.+)$/);
      if (treeMatch) {
        return {
          type: 'tree',
          indent,
          content: treeMatch[1],
          lineIndex: index,
        };
      }

      // Regular text
      return {
        type: 'text',
        indent,
        content: trimmedLine,
        lineIndex: index,
      };
    });
  };

  const parsedLines = parseText(text);

  const toggleSection = (lineIndex: number) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(lineIndex)) {
      newCollapsed.delete(lineIndex);
    } else {
      newCollapsed.add(lineIndex);
    }
    setCollapsedSections(newCollapsed);
  };

  const handleCheckboxToggle = (lineIndex: number) => {
    if (!readOnly && onCheckboxToggle) {
      onCheckboxToggle(lineIndex);
    }
  };

  // Check if line should be hidden (collapsed)
  const isLineHidden = (currentIndex: number, currentIndent: number): boolean => {
    // Look backwards for parent tree section
    for (let i = currentIndex - 1; i >= 0; i--) {
      const line = parsedLines[i];
      if (line.indent < currentIndent) {
        // Found parent
        if (line.type === 'tree' && collapsedSections.has(line.lineIndex)) {
          return true;
        }
        break;
      }
    }
    return false;
  };

  return (
    <div className="space-y-1">
      {parsedLines.map((line, index) => {
        const isHidden = isLineHidden(index, line.indent);
        if (isHidden) return null;

        const paddingLeft = line.indent * 20; // 20px per indent level

        // Render checkbox line
        if (line.type === 'checkbox') {
          return (
            <div
              key={index}
              className="flex items-start gap-2 py-1"
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              <button
                onClick={() => handleCheckboxToggle(line.lineIndex)}
                className={`flex-shrink-0 mt-0.5 transition-colors ${
                  readOnly ? 'cursor-default' : 'cursor-pointer hover:text-blue-600'
                }`}
                disabled={readOnly}
              >
                {line.checked ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                )}
              </button>
              <div
                className={`flex-1 text-sm ${
                  line.checked
                    ? 'text-slate-500 line-through dark:text-slate-400'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                <MentionText
                  text={line.content}
                  tasks={tasks}
                  projects={projects}
                  contacts={contacts}
                  onTaskClick={onTaskClick}
                  onProjectClick={onProjectClick}
                  onContactClick={onContactClick}
                />
              </div>
            </div>
          );
        }

        // Render tree section header
        if (line.type === 'tree') {
          const isCollapsed = collapsedSections.has(line.lineIndex);
          return (
            <div
              key={index}
              className="flex items-start gap-2 py-1"
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              <button
                onClick={() => toggleSection(line.lineIndex)}
                className="flex-shrink-0 mt-0.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              <div className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                <MentionText
                  text={line.content}
                  tasks={tasks}
                  projects={projects}
                  contacts={contacts}
                  onTaskClick={onTaskClick}
                  onProjectClick={onProjectClick}
                  onContactClick={onContactClick}
                />
              </div>
            </div>
          );
        }

        // Render regular text (skip empty lines)
        if (!line.content) return null;

        return (
          <div
            key={index}
            className="py-1 text-sm text-slate-900 dark:text-slate-100"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <MentionText
              text={line.content}
              tasks={tasks}
              projects={projects}
              contacts={contacts}
              onTaskClick={onTaskClick}
              onProjectClick={onProjectClick}
              onContactClick={onContactClick}
            />
          </div>
        );
      })}
    </div>
  );
}
