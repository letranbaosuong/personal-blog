/**
 * VisualMindmap Component - Miro-style visual mindmap
 * Canvas-based with curved connections and color coding
 */

'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { Plus, ZoomIn, ZoomOut, Maximize2, Trash2, Edit2 } from 'lucide-react';
import type { Mindmap, MindmapNode as MindmapNodeType } from '../types';
import {
  addNode,
  updateNode,
  deleteNode,
  getNodeChildren,
} from '../lib/mindmapService';

interface VisualMindmapProps {
  mindmap: Mindmap;
  onMindmapChange: (mindmap: Mindmap) => void;
  isReadOnly?: boolean;
}

// Branch colors (similar to Miro)
const branchColors = [
  { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-400 dark:border-blue-600', line: '#60a5fa' },
  { bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-400 dark:border-red-600', line: '#f87171' },
  { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-400 dark:border-green-600', line: '#4ade80' },
  { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-400 dark:border-purple-600', line: '#c084fc' },
  { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-400 dark:border-orange-600', line: '#fb923c' },
];

export default function VisualMindmap({
  mindmap,
  onMindmapChange,
  isReadOnly = false,
}: VisualMindmapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Get root nodes and assign branch colors
  const rootNodes = useMemo(
    () => mindmap.nodes.filter((node) => !node.parentId),
    [mindmap.nodes]
  );

  // Get node color based on branch
  const getNodeColor = useCallback((node: MindmapNodeType): typeof branchColors[0] => {
    // Find root parent
    let current = node;
    while (current.parentId) {
      const parent = mindmap.nodes.find((n) => n.id === current.parentId);
      if (!parent) break;
      current = parent;
    }

    // Get index of root node
    const rootIndex = rootNodes.findIndex((n) => n.id === current.id);
    return branchColors[rootIndex % branchColors.length];
  }, [mindmap.nodes, rootNodes]);

  // Calculate node positions (simple radial layout)
  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    const centerX = 400;
    const centerY = 300;
    const radiusStep = 200;

    // Position center node
    if (rootNodes.length === 1) {
      positions.set(rootNodes[0].id, { x: centerX, y: centerY });

      // Position children in circle
      const children = getNodeChildren(mindmap, rootNodes[0].id);
      const angleStep = (2 * Math.PI) / Math.max(children.length, 1);

      children.forEach((child, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centerX + radiusStep * Math.cos(angle);
        const y = centerY + radiusStep * Math.sin(angle);
        positions.set(child.id, { x, y });

        // Position grandchildren
        const grandChildren = getNodeChildren(mindmap, child.id);
        const grandAngleStep = Math.PI / 6; // 30 degrees
        const grandRadius = radiusStep + 150;

        grandChildren.forEach((grandChild, gIndex) => {
          const grandAngle = angle + (gIndex - grandChildren.length / 2) * grandAngleStep;
          const gx = centerX + grandRadius * Math.cos(grandAngle);
          const gy = centerY + grandRadius * Math.sin(grandAngle);
          positions.set(grandChild.id, { x: gx, y: gy });
        });
      });
    } else {
      // Multiple root nodes
      rootNodes.forEach((root, index) => {
        const angle = (index * 2 * Math.PI) / rootNodes.length - Math.PI / 2;
        const x = centerX + 150 * Math.cos(angle);
        const y = centerY + 150 * Math.sin(angle);
        positions.set(root.id, { x, y });
      });
    }

    return positions;
  }, [mindmap, rootNodes]);

  // Generate SVG path for curved connection
  const getCurvePath = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Control point for bezier curve
      const controlOffset = distance * 0.4;
      const cx1 = from.x + dx * 0.3;
      const cy1 = from.y + controlOffset * 0.2;
      const cx2 = to.x - dx * 0.3;
      const cy2 = to.y - controlOffset * 0.2;

      return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
    },
    []
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
        setSelectedNodeId(null);
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

  // Handle start edit
  const handleStartEdit = useCallback((node: MindmapNodeType) => {
    setEditingNodeId(node.id);
    setEditValue(node.label);
  }, []);

  // Handle save edit
  const handleSaveEdit = useCallback(() => {
    if (editingNodeId && editValue.trim()) {
      handleUpdateNode(editingNodeId, { label: editValue.trim() });
    }
    setEditingNodeId(null);
    setEditValue('');
  }, [editingNodeId, editValue, handleUpdateNode]);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* SVG Layer for connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ minWidth: '100%', minHeight: '100%' }}
        >
          {mindmap.edges.map((edge) => {
            const sourcePos = nodePositions.get(edge.source);
            const targetPos = nodePositions.get(edge.target);
            if (!sourcePos || !targetPos) return null;

            const sourceNode = mindmap.nodes.find((n) => n.id === edge.source);
            const color = sourceNode ? getNodeColor(sourceNode).line : '#94a3b8';

            return (
              <path
                key={edge.id}
                d={getCurvePath(sourcePos, targetPos)}
                stroke={color}
                strokeWidth={2}
                fill="none"
                opacity={0.6}
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {mindmap.nodes.map((node) => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const color = getNodeColor(node);
          const isSelected = selectedNodeId === node.id;
          const isEditing = editingNodeId === node.id;
          const isCenter = !node.parentId && rootNodes.length === 1;

          return (
            <div
              key={node.id}
              className={`absolute group cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => setSelectedNodeId(node.id)}
            >
              <div
                className={`
                  px-4 py-2 rounded-full border-2 shadow-md
                  ${color.bg} ${color.border}
                  ${isCenter ? 'px-6 py-3 font-semibold text-base' : 'text-sm'}
                  whitespace-nowrap
                `}
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') {
                        setEditingNodeId(null);
                        setEditValue('');
                      }
                    }}
                    className="bg-transparent outline-none border-none focus:ring-0 min-w-[100px]"
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => !isReadOnly && handleStartEdit(node)}
                    className="select-none"
                  >
                    {node.label}
                  </span>
                )}
              </div>

              {/* Actions */}
              {!isReadOnly && isSelected && !isEditing && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg px-2 py-1 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddChild(node.id);
                    }}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    title="Add child"
                  >
                    <Plus className="h-3.5 w-3.5 text-blue-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(node);
                    }}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                  </button>
                  {!isCenter && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-md hover:bg-slate-50 dark:hover:bg-slate-700"
          title="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-md hover:bg-slate-50 dark:hover:bg-slate-700"
          title="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-md hover:bg-slate-50 dark:hover:bg-slate-700"
          title="Reset view"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="absolute top-4 left-4 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-md text-xs text-slate-600 dark:text-slate-400">
        <span className="font-medium">{mindmap.nodes.length}</span> nodes •{' '}
        <span className="font-medium">{mindmap.edges.length}</span> connections
      </div>

      {/* Help Text */}
      {!isReadOnly && (
        <div className="absolute bottom-4 left-4 px-3 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-md text-xs text-slate-600 dark:text-slate-400">
          Click to select • Double-click to edit • Add children from toolbar
        </div>
      )}
    </div>
  );
}
