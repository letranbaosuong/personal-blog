'use client';

import React, { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Network,
  GitBranch,
  Maximize2,
  Plus,
  Trash2,
  Edit3,
  Layout,
} from 'lucide-react';
import type { Mindmap, MindmapLayoutType } from '../types';
import {
  addNode,
  updateNode,
  deleteNode,
  applyAutoLayout,
  changeLayoutType,
  getNodeChildren,
} from '../lib/mindmapService';

interface MindmapViewProps {
  mindmap: Mindmap;
  onMindmapChange: (mindmap: Mindmap) => void;
  isReadOnly?: boolean;
}

export default function MindmapView({
  mindmap,
  onMindmapChange,
  isReadOnly = false,
}: MindmapViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState('');

  // Convert mindmap data to React Flow format
  const flowNodes: Node[] = useMemo(
    () =>
      mindmap.nodes.map((node) => ({
        id: node.id,
        type: 'default',
        position: node.position,
        data: {
          label: (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{node.label}</span>
              {!isReadOnly && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditNode(node.id);
                    }}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    aria-label="Edit node"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode(node.id);
                    }}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    aria-label="Delete node"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: node.color || '#ffffff',
          border: `2px solid ${selectedNodeId === node.id ? '#3b82f6' : '#e2e8f0'}`,
          borderRadius: '8px',
          padding: '10px',
          minWidth: '150px',
        },
        className: 'group',
      })),
    [mindmap.nodes, selectedNodeId, isReadOnly]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      mindmap.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: edge.animated,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        type: 'smoothstep',
      })),
    [mindmap.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update flow when mindmap changes
  React.useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  // Handle node position change
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);

      // Update mindmap with new positions
      const positionChanges = changes.filter((c: any) => c.type === 'position' && c.position);
      if (positionChanges.length > 0) {
        let updatedMindmap = mindmap;
        positionChanges.forEach((change: any) => {
          if (change.position && change.dragging === false) {
            updatedMindmap = updateNode(updatedMindmap, change.id, {
              position: change.position,
            });
          }
        });
        onMindmapChange(updatedMindmap);
      }
    },
    [mindmap, onMindmapChange, onNodesChange]
  );

  // Handle node selection
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    []
  );

  // Handle add node
  const handleAddNode = useCallback(() => {
    if (!newNodeLabel.trim()) return;

    const parentId = selectedNodeId || undefined;
    const updatedMindmap = addNode(mindmap, newNodeLabel.trim(), parentId);
    onMindmapChange(updatedMindmap);

    setNewNodeLabel('');
    setIsAddingNode(false);
  }, [mindmap, newNodeLabel, selectedNodeId, onMindmapChange]);

  // Handle edit node
  const handleEditNode = useCallback(
    (nodeId: string) => {
      const node = mindmap.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const newLabel = prompt('Edit node label:', node.label);
      if (newLabel && newLabel.trim()) {
        const updatedMindmap = updateNode(mindmap, nodeId, { label: newLabel.trim() });
        onMindmapChange(updatedMindmap);
      }
    },
    [mindmap, onMindmapChange]
  );

  // Handle delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const children = getNodeChildren(mindmap, nodeId);
      const message =
        children.length > 0
          ? `Delete this node and its ${children.length} child node(s)?`
          : 'Delete this node?';

      if (confirm(message)) {
        const updatedMindmap = deleteNode(mindmap, nodeId);
        onMindmapChange(updatedMindmap);
        if (selectedNodeId === nodeId) {
          setSelectedNodeId(null);
        }
      }
    },
    [mindmap, selectedNodeId, onMindmapChange]
  );

  // Handle layout change
  const handleLayoutChange = useCallback(
    (layoutType: MindmapLayoutType) => {
      const updatedMindmap = changeLayoutType(mindmap, layoutType);
      onMindmapChange(updatedMindmap);
    },
    [mindmap, onMindmapChange]
  );

  // Handle auto-layout
  const handleAutoLayout = useCallback(() => {
    const updatedMindmap = applyAutoLayout(mindmap);
    onMindmapChange(updatedMindmap);
  }, [mindmap, onMindmapChange]);

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        className="bg-slate-50 dark:bg-slate-900"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            return selectedNodeId === node.id ? '#3b82f6' : '#e2e8f0';
          }}
          className="bg-white dark:bg-slate-800"
        />

        {/* Top Panel - Controls */}
        <Panel position="top-left" className="flex gap-2">
          {!isReadOnly && (
            <>
              <button
                onClick={() => setIsAddingNode(!isAddingNode)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-sm font-medium"
                title="Add Node"
              >
                <Plus className="h-4 w-4" />
                Add Node
              </button>

              <button
                onClick={handleAutoLayout}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-sm font-medium"
                title="Auto Layout"
              >
                <Layout className="h-4 w-4" />
                Auto Layout
              </button>
            </>
          )}

          {/* Layout Type Selector */}
          <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-1">
            <button
              onClick={() => handleLayoutChange('tree')}
              className={`p-2 rounded transition-colors ${
                mindmap.layoutType === 'tree'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Tree Layout"
            >
              <GitBranch className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleLayoutChange('radial')}
              className={`p-2 rounded transition-colors ${
                mindmap.layoutType === 'radial'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Radial Layout"
            >
              <Network className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleLayoutChange('free')}
              className={`p-2 rounded transition-colors ${
                mindmap.layoutType === 'free'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title="Free Layout"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </Panel>

        {/* Add Node Form */}
        {isAddingNode && !isReadOnly && (
          <Panel position="top-right">
            <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-4 shadow-lg">
              <h3 className="text-sm font-semibold mb-2">Add New Node</h3>
              {selectedNodeId && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  Will be added as child of selected node
                </p>
              )}
              <input
                type="text"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNode();
                  } else if (e.key === 'Escape') {
                    setIsAddingNode(false);
                    setNewNodeLabel('');
                  }
                }}
                placeholder="Node label..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm mb-2 bg-white dark:bg-slate-900"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNode}
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingNode(false);
                    setNewNodeLabel('');
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Panel>
        )}

        {/* Info Panel */}
        <Panel position="bottom-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-slate-400">
            {mindmap.nodes.length} nodes • {mindmap.edges.length} connections •{' '}
            {mindmap.layoutType} layout
            {selectedNodeId && <span className="ml-2">• Node selected</span>}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
