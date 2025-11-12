/**
 * TreeMindmap Component - Simple, reliable tree-based mindmap
 * Uses CSS flexbox for automatic layout - no complex calculations
 * Horizontal tree with nodes expanding to the right
 */

'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2, Edit2, ChevronDown, ChevronRight, Check, X } from 'lucide-react';
import type { Mindmap, MindmapNode as MindmapNodeType } from '../types';
import {
  addNode,
  updateNode,
  deleteNode,
  getNodeChildren,
} from '../lib/mindmapService';

interface TreeMindmapProps {
  mindmap: Mindmap;
  onMindmapChange: (mindmap: Mindmap) => void;
  isReadOnly?: boolean;
}

// Node colors by level
const levelColors = [
  { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600', light: 'bg-blue-50 dark:bg-blue-900/20' },
  { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600', light: 'bg-purple-50 dark:bg-purple-900/20' },
  { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600', light: 'bg-green-50 dark:bg-green-900/20' },
  { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600', light: 'bg-orange-50 dark:bg-orange-900/20' },
  { bg: 'bg-pink-500', text: 'text-white', border: 'border-pink-600', light: 'bg-pink-50 dark:bg-pink-900/20' },
];

interface TreeNodeProps {
  node: MindmapNodeType;
  level: number;
  mindmap: Mindmap;
  onUpdate: (nodeId: string, updates: Partial<MindmapNodeType>) => void;
  onDelete: (nodeId: string) => void;
  onAddChild: (parentId: string) => void;
  isReadOnly?: boolean;
}

function TreeNode({ node, level, mindmap, onUpdate, onDelete, onAddChild, isReadOnly }: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const [isCollapsed, setIsCollapsed] = useState(node.isCollapsed || false);

  const children = getNodeChildren(mindmap, node.id);
  const hasChildren = children.length > 0;
  const color = levelColors[level % levelColors.length];
  const isRoot = level === 0;

  const handleSave = () => {
    if (editValue.trim() && editValue !== node.label) {
      onUpdate(node.id, { label: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(node.label);
    setIsEditing(false);
  };

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onUpdate(node.id, { isCollapsed: newCollapsed });
  };

  const handleDelete = () => {
    if (children.length > 0) {
      if (!confirm(`Delete this node and its ${children.length} child node(s)?`)) return;
    }
    onDelete(node.id);
  };

  return (
    <div className="flex items-start gap-2 sm:gap-4">
      {/* Node */}
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-1 sm:gap-2 group">
          {/* Collapse button */}
          {hasChildren && (
            <button
              onClick={handleToggleCollapse}
              className="p-1 sm:p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors touch-manipulation"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5 sm:w-6" />}

          {/* Node content */}
          <div className={`
            relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm border-2
            ${isRoot ? 'rounded-full px-4 py-2 sm:px-6 sm:py-3' : 'rounded-lg'}
            ${isRoot ? `${color.bg} ${color.text} ${color.border}` : `${color.light} text-slate-900 dark:text-white border-slate-300 dark:border-slate-600`}
            ${isRoot ? 'font-semibold text-sm sm:text-base' : 'text-xs sm:text-sm'}
            transition-all
          `}>
            {isEditing ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 rounded border border-blue-500 outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm min-w-[120px] sm:min-w-[150px]"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="p-1 sm:p-1.5 hover:bg-green-100 dark:hover:bg-green-900 rounded touch-manipulation"
                >
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 sm:p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded touch-manipulation"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                </button>
              </div>
            ) : (
              <>
                <span
                  onDoubleClick={() => !isReadOnly && setIsEditing(true)}
                  className="cursor-text select-none"
                >
                  {node.label}
                </span>

                {/* Actions */}
                {!isReadOnly && (
                  <div className="flex gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onAddChild(node.id)}
                      className="p-1 sm:p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900 rounded touch-manipulation"
                      title="Add child"
                    >
                      <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 sm:p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900 rounded touch-manipulation"
                      title="Edit"
                    >
                      <Edit2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
                    </button>
                    {!isRoot && (
                      <button
                        onClick={handleDelete}
                        className="p-1 sm:p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded touch-manipulation"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-600" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <div className="ml-4 sm:ml-10 flex flex-col gap-2 sm:gap-3 pl-3 sm:pl-6 border-l-2 border-slate-300 dark:border-slate-600">
            {children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                mindmap={mindmap}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddChild={onAddChild}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TreeMindmap({
  mindmap,
  onMindmapChange,
  isReadOnly = false,
}: TreeMindmapProps) {
  // Get root nodes
  const rootNodes = mindmap.nodes.filter((node) => !node.parentId);

  // Handle node update
  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<MindmapNodeType>) => {
      const updatedMindmap = updateNode(mindmap, nodeId, updates);
      onMindmapChange(updatedMindmap);
    },
    [mindmap, onMindmapChange]
  );

  // Handle node delete
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const updatedMindmap = deleteNode(mindmap, nodeId);
      onMindmapChange(updatedMindmap);
    },
    [mindmap, onMindmapChange]
  );

  // Handle add child
  const handleAddChild = useCallback(
    (parentId: string) => {
      const updatedMindmap = addNode(mindmap, 'New Node', parentId);
      onMindmapChange(updatedMindmap);
    },
    [mindmap, onMindmapChange]
  );

  return (
    <div className="h-full w-full overflow-auto bg-white dark:bg-slate-900 p-3 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
            Mind Map
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {mindmap.nodes.length} nodes
          </p>
        </div>
      </div>

      {/* Tree */}
      {rootNodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 sm:h-64">
          <p className="text-sm text-slate-500 dark:text-slate-400">No nodes yet</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {rootNodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              mindmap={mindmap}
              onUpdate={handleUpdateNode}
              onDelete={handleDeleteNode}
              onAddChild={handleAddChild}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
          <strong>Tips:</strong> <span className="hidden sm:inline">Double-click to edit • </span>
          <span className="sm:hidden">Tap buttons to edit • </span>
          Tap <ChevronDown className="inline h-3 w-3" /> to collapse
        </p>
      </div>
    </div>
  );
}
