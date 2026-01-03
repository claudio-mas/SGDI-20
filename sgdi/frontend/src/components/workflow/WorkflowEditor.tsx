import React, { useState, useCallback } from 'react';
import { WorkflowNode, WorkflowConnection, WorkflowNodeType, WorkflowValidationError, Workflow } from '../../types';
import WorkflowCanvas from './WorkflowCanvas';
import NodeToolbar from './NodeToolbar';
import NodeProperties from './NodeProperties';
import Button from '../common/Button';

interface WorkflowEditorProps {
  workflow?: Workflow;
  onSave?: (workflow: Workflow) => void;
  onCancel?: () => void;
}

// Validation function for workflow structure
export const validateWorkflow = (nodes: WorkflowNode[], connections: WorkflowConnection[]): WorkflowValidationError[] => {
  const errors: WorkflowValidationError[] = [];

  // Check for exactly one start node
  const startNodes = nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push({ type: 'error', message: 'O workflow deve ter um nó de início' });
  } else if (startNodes.length > 1) {
    errors.push({ type: 'error', message: 'O workflow deve ter apenas um nó de início' });
  }

  // Check for at least one end node
  const endNodes = nodes.filter(n => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push({ type: 'error', message: 'O workflow deve ter pelo menos um nó de fim' });
  }

  // Check that all nodes except End have at least one outgoing connection
  nodes.forEach(node => {
    if (node.type !== 'end') {
      const outgoing = connections.filter(c => c.from === node.id);
      if (outgoing.length === 0) {
        errors.push({
          type: 'error',
          message: `O nó "${node.name}" não tem conexão de saída`,
          nodeId: node.id,
        });
      }
    }
  });

  // Check that all nodes except Start have at least one incoming connection
  nodes.forEach(node => {
    if (node.type !== 'start') {
      const incoming = connections.filter(c => c.to === node.id);
      if (incoming.length === 0) {
        errors.push({
          type: 'error',
          message: `O nó "${node.name}" não tem conexão de entrada`,
          nodeId: node.id,
        });
      }
    }
  });

  // Check for condition nodes having both yes and no paths
  nodes.filter(n => n.type === 'condition').forEach(node => {
    const outgoing = connections.filter(c => c.from === node.id);
    const hasYes = outgoing.some(c => c.condition === 'yes');
    const hasNo = outgoing.some(c => c.condition === 'no');
    if (!hasYes || !hasNo) {
      errors.push({
        type: 'warning',
        message: `O nó de condição "${node.name}" deve ter caminhos para "Sim" e "Não"`,
        nodeId: node.id,
      });
    }
  });

  return errors;
};

const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  workflow,
  onSave,
  onCancel,
}) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflow?.nodes || [
    {
      id: 'start_1',
      type: 'start',
      name: 'Início',
      position: { x: 130, y: 60 },
      config: {},
    },
  ]);
  const [connections, setConnections] = useState<WorkflowConnection[]>(workflow?.connections || []);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [workflowName, setWorkflowName] = useState(workflow?.name || 'Novo Workflow');
  const [validationErrors, setValidationErrors] = useState<WorkflowValidationError[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleNodeMove = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, position } : node
    ));
  }, []);

  const handleNodeDrop = useCallback((type: WorkflowNodeType, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: generateId(),
      type,
      name: getDefaultNodeName(type),
      position,
      config: getDefaultConfig(type),
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNodeId(null);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const handleValidate = () => {
    const errors = validateWorkflow(nodes, connections);
    setValidationErrors(errors);
    setShowValidation(true);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (!handleValidate()) {
      return;
    }

    const workflowData: Workflow = {
      id: workflow?.id || generateId(),
      name: workflowName,
      description: workflow?.description,
      status: 'draft',
      nodes,
      connections,
      createdBy: workflow?.createdBy || 'current_user',
      createdAt: workflow?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave?.(workflowData);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:px-8 sm:py-6 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Modo Editor</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
              Rascunho
            </span>
          </div>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-2xl sm:text-3xl font-bold text-[#111318] dark:text-white tracking-tight bg-transparent border-none p-0 focus:ring-0 focus:outline-none"
          />
          <p className="text-[#616f89] dark:text-slate-400 text-sm mt-1">
            Desenho detalhado de fluxos de aprovação e publicação.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onCancel}>
            <span className="material-symbols-outlined text-[18px]">close</span>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleValidate}>
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Validar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <span className="material-symbols-outlined text-[18px]">save</span>
            Salvar
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {showValidation && validationErrors.length > 0 && (
        <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-red-600">error</span>
            <span className="font-semibold text-red-800 dark:text-red-200">Erros de Validação</span>
          </div>
          <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex flex-1 min-h-[600px] border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#1e293b] shadow-sm overflow-hidden relative m-6">
        {/* Node Toolbar */}
        <NodeToolbar />

        {/* Canvas */}
        <div className="flex-1 relative">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 z-10">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-l-lg border-r border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-[20px]">remove</span>
            </button>
            <span className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-r-lg border-l border-slate-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>

          <WorkflowCanvas
            nodes={nodes}
            connections={connections}
            selectedNodeId={selectedNodeId || undefined}
            zoom={zoom}
            onNodeSelect={handleNodeSelect}
            onNodeMove={handleNodeMove}
            onNodeDrop={handleNodeDrop}
          />
        </div>

        {/* Properties Panel */}
        <NodeProperties
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onUpdate={handleNodeUpdate}
          onDelete={handleNodeDelete}
        />
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-6 pb-4">
        <span>
          {nodes.length} nós • {connections.length} conexões
        </span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className={`block size-2 rounded-full ${validationErrors.length === 0 ? 'bg-green-500' : 'bg-amber-500'}`}></span>
            {validationErrors.length === 0 ? 'Validado' : 'Pendente validação'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getDefaultNodeName(type: WorkflowNodeType): string {
  const names: Record<WorkflowNodeType, string> = {
    start: 'Início',
    review: 'Nova Revisão',
    approval: 'Nova Aprovação',
    condition: 'Nova Condição',
    publication: 'Publicação',
    email: 'Notificação',
    end: 'Fim',
  };
  return names[type];
}

function getDefaultConfig(type: WorkflowNodeType): WorkflowNode['config'] {
  switch (type) {
    case 'approval':
    case 'review':
      return {
        approvers: [],
        approvalRule: 'any',
        slaHours: 48,
        slaUnit: 'hours',
        notifyOnAssign: true,
        notifyOnDelay: true,
      };
    case 'condition':
      return {
        conditionField: '',
        conditionOperator: 'greater_than',
        conditionValue: '',
      };
    case 'email':
      return {
        emailTemplate: '',
        emailRecipients: [],
      };
    default:
      return {};
  }
}

export default WorkflowEditor;
