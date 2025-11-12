/**
 * Mindmap Service
 * Utilities for managing mindmap nodes and layout
 */

import type { Mindmap, MindmapNode, MindmapEdge, MindmapLayoutType } from '../types';

/**
 * Create an empty mindmap with default root node
 */
export function createEmptyMindmap(rootLabel: string = 'Main Topic'): Mindmap {
  const rootNode: MindmapNode = {
    id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    label: rootLabel,
    position: { x: 400, y: 300 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    nodes: [rootNode],
    edges: [],
    layoutType: 'tree',
    centerNode: rootNode.id,
  };
}

/**
 * Add a new node to mindmap
 */
export function addNode(
  mindmap: Mindmap,
  label: string,
  parentId?: string,
  position?: { x: number; y: number }
): Mindmap {
  const newNode: MindmapNode = {
    id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    label,
    parentId,
    position: position || calculateNewNodePosition(mindmap, parentId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newEdge: MindmapEdge | null = parentId
    ? {
        id: `edge_${newNode.id}`,
        source: parentId,
        target: newNode.id,
      }
    : null;

  return {
    ...mindmap,
    nodes: [...mindmap.nodes, newNode],
    edges: newEdge ? [...mindmap.edges, newEdge] : mindmap.edges,
  };
}

/**
 * Update a node's properties
 */
export function updateNode(
  mindmap: Mindmap,
  nodeId: string,
  updates: Partial<Omit<MindmapNode, 'id' | 'createdAt'>>
): Mindmap {
  return {
    ...mindmap,
    nodes: mindmap.nodes.map((node) =>
      node.id === nodeId
        ? { ...node, ...updates, updatedAt: new Date().toISOString() }
        : node
    ),
  };
}

/**
 * Delete a node and all its descendants
 */
export function deleteNode(mindmap: Mindmap, nodeId: string): Mindmap {
  // Find all descendant nodes
  const descendantIds = findDescendants(mindmap, nodeId);
  const nodesToDelete = new Set([nodeId, ...descendantIds]);

  return {
    ...mindmap,
    nodes: mindmap.nodes.filter((node) => !nodesToDelete.has(node.id)),
    edges: mindmap.edges.filter(
      (edge) => !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
    ),
  };
}

/**
 * Find all descendants of a node
 */
function findDescendants(mindmap: Mindmap, nodeId: string): string[] {
  const descendants: string[] = [];
  const children = mindmap.nodes.filter((node) => node.parentId === nodeId);

  for (const child of children) {
    descendants.push(child.id);
    descendants.push(...findDescendants(mindmap, child.id));
  }

  return descendants;
}

/**
 * Calculate position for a new child node
 */
function calculateNewNodePosition(
  mindmap: Mindmap,
  parentId?: string
): { x: number; y: number } {
  if (!parentId) {
    // No parent, place randomly near center
    return {
      x: 400 + Math.random() * 200 - 100,
      y: 300 + Math.random() * 200 - 100,
    };
  }

  const parent = mindmap.nodes.find((n) => n.id === parentId);
  if (!parent) {
    return { x: 400, y: 300 };
  }

  // Count existing children
  const siblings = mindmap.nodes.filter((n) => n.parentId === parentId);
  const childIndex = siblings.length;

  // Calculate position based on tree layout
  const horizontalSpacing = 200;
  const verticalSpacing = 150;

  return {
    x: parent.position.x + (childIndex - siblings.length / 2) * horizontalSpacing,
    y: parent.position.y + verticalSpacing,
  };
}

/**
 * Apply auto-layout to mindmap
 */
export function applyAutoLayout(
  mindmap: Mindmap,
  layoutType?: MindmapLayoutType
): Mindmap {
  const type = layoutType || mindmap.layoutType;

  switch (type) {
    case 'tree':
      return applyTreeLayout(mindmap);
    case 'radial':
      return applyRadialLayout(mindmap);
    case 'free':
      return mindmap; // Keep positions as-is
    default:
      return mindmap;
  }
}

/**
 * Apply tree layout (hierarchical top-down)
 */
function applyTreeLayout(mindmap: Mindmap): Mindmap {
  const horizontalSpacing = 220;
  const verticalSpacing = 150;
  const centerX = 600;
  const startY = 50;

  // Find root nodes (nodes without parents)
  const rootNodes = mindmap.nodes.filter((n) => !n.parentId);
  if (rootNodes.length === 0) return mindmap;

  const newNodes = [...mindmap.nodes];

  // Build tree structure
  const levels: string[][] = [];
  const visited = new Set<string>();

  function buildLevels(nodeId: string, level: number) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    if (!levels[level]) levels[level] = [];
    levels[level].push(nodeId);

    const children = mindmap.nodes.filter((n) => n.parentId === nodeId);
    children.forEach((child) => buildLevels(child.id, level + 1));
  }

  rootNodes.forEach((root) => buildLevels(root.id, 0));

  // Position nodes level by level
  levels.forEach((levelNodes, levelIndex) => {
    const levelWidth = (levelNodes.length - 1) * horizontalSpacing;
    const startX = centerX - levelWidth / 2;

    levelNodes.forEach((nodeId, index) => {
      const node = newNodes.find((n) => n.id === nodeId);
      if (node) {
        node.position = {
          x: startX + index * horizontalSpacing,
          y: startY + levelIndex * verticalSpacing,
        };
      }
    });
  });

  return {
    ...mindmap,
    nodes: newNodes,
    layoutType: 'tree',
  };
}

/**
 * Apply radial layout (circular around center)
 */
function applyRadialLayout(mindmap: Mindmap): Mindmap {
  if (mindmap.nodes.length === 0) return mindmap;

  const centerX = 600;
  const centerY = 400;
  const radius = 200;

  const centerNode = mindmap.nodes.find(
    (n) => n.id === mindmap.centerNode || !n.parentId
  );
  if (!centerNode) return mindmap;

  const newNodes = [...mindmap.nodes];

  // Position center node
  const centerNodeIndex = newNodes.findIndex((n) => n.id === centerNode.id);
  if (centerNodeIndex >= 0) {
    newNodes[centerNodeIndex].position = { x: centerX, y: centerY };
  }

  // Position first-level children in circle
  const firstLevelChildren = mindmap.nodes.filter((n) => n.parentId === centerNode.id);
  const angleStep = (2 * Math.PI) / Math.max(firstLevelChildren.length, 1);

  firstLevelChildren.forEach((child, index) => {
    const angle = index * angleStep;
    const nodeIndex = newNodes.findIndex((n) => n.id === child.id);
    if (nodeIndex >= 0) {
      newNodes[nodeIndex].position = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    }

    // Position children of this child in smaller circle
    const grandChildren = mindmap.nodes.filter((n) => n.parentId === child.id);
    const grandRadius = 120;
    const grandAngleStep = (2 * Math.PI) / Math.max(grandChildren.length, 1);

    grandChildren.forEach((grandChild, grandIndex) => {
      const grandAngle = angle + grandIndex * grandAngleStep;
      const grandNodeIndex = newNodes.findIndex((n) => n.id === grandChild.id);
      if (grandNodeIndex >= 0) {
        newNodes[grandNodeIndex].position = {
          x: centerX + (radius + grandRadius) * Math.cos(grandAngle),
          y: centerY + (radius + grandRadius) * Math.sin(grandAngle),
        };
      }
    });
  });

  return {
    ...mindmap,
    nodes: newNodes,
    layoutType: 'radial',
  };
}

/**
 * Toggle node collapse state
 */
export function toggleNodeCollapse(mindmap: Mindmap, nodeId: string): Mindmap {
  const node = mindmap.nodes.find((n) => n.id === nodeId);
  if (!node) return mindmap;

  return updateNode(mindmap, nodeId, { isCollapsed: !node.isCollapsed });
}

/**
 * Get children of a node
 */
export function getNodeChildren(mindmap: Mindmap, nodeId: string): MindmapNode[] {
  return mindmap.nodes.filter((n) => n.parentId === nodeId);
}

/**
 * Get node by ID
 */
export function getNodeById(mindmap: Mindmap, nodeId: string): MindmapNode | undefined {
  return mindmap.nodes.find((n) => n.id === nodeId);
}

/**
 * Change layout type and apply it
 */
export function changeLayoutType(
  mindmap: Mindmap,
  layoutType: MindmapLayoutType
): Mindmap {
  return applyAutoLayout({ ...mindmap, layoutType }, layoutType);
}
