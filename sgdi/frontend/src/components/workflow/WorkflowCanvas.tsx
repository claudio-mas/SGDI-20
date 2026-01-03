import React, { useRef, useState, useCallback } from 'react';
import { WorkflowNode, WorkflowConnection, WorkflowNodeType } from '../../types';
import WorkflowNodeComponent from './WorkflowNode';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  selectedNodeId?: string;
  zoom: number;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeMove: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeDrop: (type: WorkflowNodeType, position: { x: number; y: number }) => void;
  onConnectionClick?: (connectionId: string) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  connections,
  selectedNodeId,
  zoom,
  onNodeSelect,
  onNodeMove,
  onNodeDrop,
  onConnectionClick,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-background')) {
      onNodeSelect(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType') as WorkflowNodeType;
    if (!nodeType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    onNodeDrop(nodeType, { x, y });
  };

  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.position.x * (zoom / 100),
      y: e.clientY - rect.top - node.position.y * (zoom / 100),
    });
    setIsDraggingNode(nodeId);
    onNodeSelect(nodeId);
  }, [nodes, zoom, onNodeSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - dragOffset.x) / (zoom / 100);
    const y = (e.clientY - rect.top - dragOffset.y) / (zoom / 100);

    onNodeMove(isDraggingNode, { x: Math.max(0, x), y: Math.max(0, y) });
  }, [isDraggingNode, dragOffset, zoom, onNodeMove]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingNode(null);
  }, []);

  // Calculate connection paths
  const getConnectionPath = (connection: WorkflowConnection) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    if (!fromNode || !toNode) return null;

    const fromX = fromNode.position.x + 100; // Center of node
    const fromY = fromNode.position.y + 40; // Bottom of node
    const toX = toNode.position.x + 100;
    const toY = toNode.position.y;

    // Calculate control points for bezier curve
    const midY = (fromY + toY) / 2;
    
    return {
      path: `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`,
      labelX: (fromX + toX) / 2,
      labelY: midY,
    };
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 bg-[#f8fafc] dark:bg-[#0f172a] bg-grid-pattern relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="canvas-background absolute inset-0"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          {connections.map(connection => {
            const pathData = getConnectionPath(connection);
            if (!pathData) return null;
            return (
              <g key={connection.id}>
                <path
                  d={pathData.path}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  className="cursor-pointer hover:stroke-primary"
                  onClick={() => onConnectionClick?.(connection.id)}
                />
                {connection.label && (
                  <g transform={`translate(${pathData.labelX}, ${pathData.labelY})`}>
                    <rect
                      x="-20"
                      y="-10"
                      width="40"
                      height="20"
                      rx="4"
                      fill="white"
                      stroke="#e2e8f0"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-medium fill-green-600"
                    >
                      {connection.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <WorkflowNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
            onClick={() => onNodeSelect(node.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowCanvas;
