'use client';

import React, { useState, useCallback } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  Circle,
} from 'lucide-react';
import type { Mindmap, MindmapNode } from '../types';
import {
  addNode,
  updateNode,
  deleteNode,
  toggleNodeCollapse,
  getNodeChildren,
} from '../lib/mindmapService';

interface MindmapListViewProps {
  mindmap: Mindmap;
  onMindmapChange: (mindmap: Mindmap) => void;
  isReadOnly?: boolean;
}

export default function MindmapListView({
  mindmap,
  onMindmapChange,
  isReadOnly = false,
}: MindmapListViewProps) {
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  // Get root nodes (nodes without parents)
  const rootNodes = mindmap.nodes.filter((node) => !node.parentId);

  // Handle toggle collapse
  const handleToggleCollapse = useCallback(
    (nodeId: string) => {
      const updatedMindmap = toggleNodeCollapse(mindmap, nodeId);
      onMindmapChange(updatedMindmap);
    },
    [mindmap, onMindmapChange]
  );

  // Handle add child node
  const handleAddChild = useCallback(
    (parentId: string) => {
      const label = prompt('Enter node label:');
      if (label && label.trim()) {
        const updatedMindmap = addNode(mindmap, label.trim(), parentId);
        onMindmapChange(updatedMindmap);
      }
    },
    [mindmap, onMindmapChange]
  );

  // Handle edit node
  const handleStartEdit = useCallback((node: MindmapNode) => {
    setEditingNodeId(node.id);
    setEditingLabel(node.label);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingNodeId && editingLabel.trim()) {
      const updatedMindmap = updateNode(mindmap, editingNodeId, {
        label: editingLabel.trim(),
      });
      onMindmapChange(updatedMindmap);
    }
    setEditingNodeId(null);
    setEditingLabel('');
  }, [mindmap, editingNodeId, editingLabel, onMindmapChange]);

  const handleCancelEdit = useCallback(() => {
    setEditingNodeId(null);
    setEditingLabel('');
  }, []);

  // Handle delete node
  const handleDelete = useCallback(
    (nodeId: string) => {
      const children = getNodeChildren(mindmap, nodeId);
      const message =
        children.length > 0
          ? `Delete this node and its ${children.length} child node(s)?`
          : 'Delete this node?';

      if (confirm(message)) {
        const updatedMindmap = deleteNode(mindmap, nodeId);
        onMindmapChange(updatedMindmap);
      }
    },
    [mindmap, onMindmapChange]
  );

  // Render node recursively
  const renderNode = (node: MindmapNode, level: number = 0) => {
    const children = getNodeChildren(mindmap, node.id);
    const hasChildren = children.length > 0;
    const isEditing = editingNodeId === node.id;

    return (
      <div key={node.id} className="select-none">
        {/* Node Row */}
        <div
          className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 group transition-colors"
          style={{ paddingLeft: `${level * 24 + 8}px` }}
        >
          {/* Collapse Toggle */}
          <button
            onClick={() => handleToggleCollapse(node.id)}
            className="flex-shrink-0 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
            style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
          >
            {node.isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {/* Node Icon */}
          <Circle
            className="h-3 w-3 flex-shrink-0"
            fill={node.color || '#94a3b8'}
            stroke={node.color || '#94a3b8'}
          />

          {/* Node Label */}
          {isEditing ? (
            <input
              type="text"
              value={editingLabel}
              onChange={(e) => setEditingLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              onBlur={handleSaveEdit}
              className="flex-1 px-2 py-1 border border-blue-500 rounded text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm">{node.label}</span>
          )}

          {/* Actions */}
          {!isReadOnly && !isEditing && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleAddChild(node.id)}
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                title="Add child node"
              >
                <Plus className="h-3 w-3 text-blue-600" />
              </button>
              <button
                onClick={() => handleStartEdit(node)}
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                title="Edit node"
              >
                <Edit3 className="h-3 w-3 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(node.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                title="Delete node"
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && !node.isCollapsed && (
          <div className="children">
            {children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-auto p-4 bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mindmap - List View</h3>
        {!isReadOnly && (
          <button
            onClick={() => {
              const label = prompt('Enter root node label:');
              if (label && label.trim()) {
                const updatedMindmap = addNode(mindmap, label.trim());
                onMindmapChange(updatedMindmap);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Root Node
          </button>
        )}
      </div>

      {/* Node Tree */}
      {rootNodes.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p className="text-sm">No nodes yet. Click &quot;Add Root Node&quot; to start.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {rootNodes.map((node) => renderNode(node))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
        Total: {mindmap.nodes.length} nodes • {mindmap.edges.length} connections
      </div>
    </div>
  );
}
