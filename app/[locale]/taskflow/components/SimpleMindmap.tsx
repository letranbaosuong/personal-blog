/**
 * SimpleMindmap Component - Simple, user-friendly mindmap
 * Inspired by Notion's simplicity and SubTask's ease of use
 */

'use client';

import { useCallback, useMemo } from 'react';
import { Plus, Lightbulb, HelpCircle } from 'lucide-react';
import MindmapNode from './MindmapNode';
import type { Mindmap, MindmapNode as MindmapNodeType } from '../types';
import {
  addNode,
  updateNode,
  deleteNode,
  getNodeChildren,
} from '../lib/mindmapService';

interface SimpleMindmapProps {
  mindmap: Mindmap;
  onMindmapChange: (mindmap: Mindmap) => void;
  isReadOnly?: boolean;
}

export default function SimpleMindmap({
  mindmap,
  onMindmapChange,
  isReadOnly = false,
}: SimpleMindmapProps) {
  // Get root nodes (nodes without parents)
  const rootNodes = useMemo(
    () => mindmap.nodes.filter((node) => !node.parentId),
    [mindmap.nodes]
  );

  // Get children for a specific node
  const getChildren = useCallback(
    (nodeId: string): MindmapNodeType[] => {
      return getNodeChildren(mindmap, nodeId);
    },
    [mindmap]
  );

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
      const children = getNodeChildren(mindmap, nodeId);
      const confirmMessage =
        children.length > 0
          ? `Delete this node and its ${children.length} child node(s)?`
          : 'Delete this node?';

      if (confirm(confirmMessage)) {
        const updatedMindmap = deleteNode(mindmap, nodeId);
        onMindmapChange(updatedMindmap);
      }
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

  // Handle add root node
  const handleAddRootNode = useCallback(() => {
    const updatedMindmap = addNode(mindmap, 'New Idea');
    onMindmapChange(updatedMindmap);
  }, [mindmap, onMindmapChange]);

  // Render node tree recursively
  const renderNodeTree = useCallback(
    (node: MindmapNodeType, level: number = 0) => {
      const children = getChildren(node.id);

      return (
        <MindmapNode
          key={node.id}
          node={node}
          level={level}
          children={children}
          isReadOnly={isReadOnly}
          onUpdate={handleUpdateNode}
          onDelete={handleDeleteNode}
          onAddChild={handleAddChild}
        />
      );
    },
    [getChildren, isReadOnly, handleUpdateNode, handleDeleteNode, handleAddChild]
  );

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                Mind Map
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Organize your ideas
              </p>
            </div>
          </div>

          {!isReadOnly && (
            <button
              onClick={handleAddRootNode}
              className="flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium shadow-sm touch-manipulation"
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Add Idea
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4">
        {rootNodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-3 sm:p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 sm:mb-4">
              <Lightbulb className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400" />
            </div>
            <h4 className="text-base sm:text-lg font-medium text-slate-900 dark:text-white mb-2">
              Start Your Mind Map
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 max-w-md">
              Create your first idea to begin organizing your thoughts
            </p>
            {!isReadOnly && (
              <button
                onClick={handleAddRootNode}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Add First Idea
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {rootNodes.map((node) => renderNodeTree(node, 0))}
          </div>
        )}
      </div>

      {/* Footer - Tips */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-3 sm:px-6 py-2 sm:py-3 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
          <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
          <div className="text-[10px] sm:text-xs leading-relaxed">
            <span className="font-medium">Tips:</span>
            <span className="hidden sm:inline"> Double-click to edit • Click </span>
            <span className="sm:hidden"> Tap buttons to edit • </span>
            <Plus className="inline h-2.5 w-2.5 sm:h-3 sm:w-3" /> to add child •
            Click ▼ to collapse
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-3 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
        {mindmap.nodes.length} {mindmap.nodes.length === 1 ? 'node' : 'nodes'} •{' '}
        {mindmap.edges.length}{' '}
        {mindmap.edges.length === 1 ? 'connection' : 'connections'}
      </div>
    </div>
  );
}
