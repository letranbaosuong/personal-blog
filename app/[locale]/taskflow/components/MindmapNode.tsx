/**
 * MindmapNode Component - Single node in mindmap
 * Simple, user-friendly interface similar to SubTask
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Circle,
  GripVertical,
} from 'lucide-react';
import type { MindmapNode as MindmapNodeType } from '../types';

interface MindmapNodeProps {
  node: MindmapNodeType;
  level: number;
  children: MindmapNodeType[];
  isReadOnly?: boolean;
  onUpdate: (nodeId: string, updates: Partial<MindmapNodeType>) => void;
  onDelete: (nodeId: string) => void;
  onAddChild: (parentId: string) => void;
}

// Color palette for different levels
const levelColors = [
  'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
  'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
  'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700',
];

const levelTextColors = [
  'text-blue-900 dark:text-blue-100',
  'text-green-900 dark:text-green-100',
  'text-purple-900 dark:text-purple-100',
  'text-orange-900 dark:text-orange-100',
  'text-pink-900 dark:text-pink-100',
];

export default function MindmapNode({
  node,
  level,
  children,
  isReadOnly = false,
  onUpdate,
  onDelete,
  onAddChild,
}: MindmapNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const [isCollapsed, setIsCollapsed] = useState(node.isCollapsed || false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasChildren = children.length > 0;
  const colorIndex = level % levelColors.length;
  const bgColor = levelColors[colorIndex];
  const textColor = levelTextColors[colorIndex];

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== node.label) {
      onUpdate(node.id, { label: editValue.trim() });
    } else {
      setEditValue(node.label);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(node.label);
      setIsEditing(false);
    }
  };

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onUpdate(node.id, { isCollapsed: newCollapsed });
  };

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        className="group flex items-center gap-2 py-1"
        style={{ paddingLeft: `${level * 24}px` }}
      >
        {/* Collapse Toggle */}
        {hasChildren && (
          <button
            onClick={handleToggleCollapse}
            className="flex-shrink-0 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        {/* Drag Handle (visual only for now) */}
        <GripVertical className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab" />

        {/* Node Icon */}
        <Circle
          className="h-2.5 w-2.5 flex-shrink-0"
          fill="currentColor"
          style={{ color: node.color || 'currentColor' }}
        />

        {/* Node Content */}
        <div className={`flex-1 rounded-md border px-3 py-1.5 ${bgColor}`}>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={`w-full bg-transparent text-sm font-medium outline-none ${textColor}`}
              placeholder="Enter node text..."
            />
          ) : (
            <span
              onDoubleClick={() => !isReadOnly && setIsEditing(true)}
              className={`text-sm font-medium cursor-text ${textColor}`}
            >
              {node.label}
            </span>
          )}
        </div>

        {/* Actions */}
        {!isReadOnly && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onAddChild(node.id)}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
              title="Add child node"
            >
              <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </button>
            <button
              onClick={() => onDelete(node.id)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
              title="Delete node"
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        )}
      </div>

      {/* Description (if exists) */}
      {node.description && !isCollapsed && (
        <div
          className="text-xs text-slate-600 dark:text-slate-400 mt-1 ml-2"
          style={{ paddingLeft: `${level * 24 + 32}px` }}
        >
          {node.description}
        </div>
      )}

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div className="mt-1">
          {children.map((child) => (
            <MindmapNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              children={[]}
              isReadOnly={isReadOnly}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Export with different name to avoid circular dependency
const MindmapNodeComponent = MindmapNode;
