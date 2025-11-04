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
  type: 'checkbox' | 'text';
  indent: number;
  checked?: boolean;
  content: string;
  lineIndex: number;
  hasChildren?: boolean; // Auto-detected
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
    const parsedLines = lines.map((line, index) => {
      // Count indentation (spaces or tabs)
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
      const trimmedLine = line.trim();

      // Checkbox syntax: - [ ] or - [x]
      const checkboxMatch = trimmedLine.match(/^-\s*\[([ x])\]\s*(.+)$/i);
      if (checkboxMatch) {
        return {
          type: 'checkbox' as const,
          indent,
          checked: checkboxMatch[1].toLowerCase() === 'x',
          content: checkboxMatch[2],
          lineIndex: index,
          hasChildren: false,
        };
      }

      // Regular text
      return {
        type: 'text' as const,
        indent,
        content: trimmedLine,
        lineIndex: index,
        hasChildren: false,
      };
    });

    // Auto-detect parent lines (lines that have children with greater indent)
    for (let i = 0; i < parsedLines.length; i++) {
      const currentLine = parsedLines[i];

      // Skip empty lines
      if (!currentLine.content) continue;

      // Check if next non-empty line has greater indent
      for (let j = i + 1; j < parsedLines.length; j++) {
        const nextLine = parsedLines[j];

        // Skip empty lines
        if (!nextLine.content) continue;

        // If next line has greater indent, current line is a parent
        if (nextLine.indent > currentLine.indent) {
          currentLine.hasChildren = true;
          break;
        }

        // If next line has same or less indent, stop checking
        if (nextLine.indent <= currentLine.indent) {
          break;
        }
      }
    }

    return parsedLines;
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
    // Look backwards for parent section
    for (let i = currentIndex - 1; i >= 0; i--) {
      const line = parsedLines[i];
      if (line.indent < currentIndent) {
        // Found parent - check if it's collapsed
        if (line.hasChildren && collapsedSections.has(line.lineIndex)) {
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
        const isParent = line.hasChildren;
        const isCollapsed = collapsedSections.has(line.lineIndex);

        // Skip empty lines
        if (!line.content) return null;

        // Render checkbox line
        if (line.type === 'checkbox') {
          return (
            <div
              key={index}
              className="flex items-start gap-2 py-1"
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              {/* Show chevron if this checkbox has children */}
              {isParent && (
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
              )}
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
                } ${isParent ? 'font-medium' : ''}`}
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

        // Render text line (parent or regular)
        if (isParent) {
          // Parent line with children - make it collapsible
          return (
            <div
              key={index}
              className="mb-1 mt-2"
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              <button
                onClick={() => toggleSection(line.lineIndex)}
                className="flex w-full items-start gap-2 rounded-md bg-slate-100 px-2 py-1.5 transition-all hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <div className="flex-shrink-0 mt-0.5 text-slate-600 dark:text-slate-300">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
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
              </button>
            </div>
          );
        }

        // Regular text line (not a parent)
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
