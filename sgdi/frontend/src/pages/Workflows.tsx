import { useState } from 'react';
import { WorkflowEditor } from '../components/workflow';
import { Workflow } from '../types';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';

// Mock data for workflow list
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Aprovação de Documentos',
    description: 'Fluxo padrão de aprovação de documentos',
    status: 'active',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Revisão Técnica',
    description: 'Fluxo de revisão técnica para documentos de engenharia',
    status: 'active',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Publicação Externa',
    description: 'Fluxo para publicação de documentos externos',
    status: 'draft',
    nodes: [],
    connections: [],
    createdBy: 'admin',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
];

// Stats data
const stats = [
  { label: 'Instâncias Ativas', value: '24', trend: '+12%', trendUp: true },
  { label: 'Pendente Revisão', value: '8', trend: 'Alta Demanda', trendUp: false },
  { label: 'Tempo Médio', value: '2.5d', trend: 'Meta: 3d', trendUp: null },
  { label: 'Taxa de Rejeição', value: '5%', trend: '-1.2%', trendUp: true },
];

export default function Workflows() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | undefined>(undefined);
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);

  const handleNewWorkflow = () => {
    setEditingWorkflow(undefined);
    setIsEditing(true);
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setIsEditing(true);
  };

  const handleSaveWorkflow = (workflow: Workflow) => {
    if (editingWorkflow) {
      setWorkflows(prev => prev.map(w => w.id === workflow.id ? workflow : w));
    } else {
      setWorkflows(prev => [...prev, workflow]);
    }
    setIsEditing(false);
    setEditingWorkflow(undefined);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingWorkflow(undefined);
  };

  if (isEditing) {
    return (
      <WorkflowEditor
        workflow={editingWorkflow}
        onSave={handleSaveWorkflow}
        onCancel={handleCancelEdit}
      />
    );
  }

  const columns = [
    {
      key: 'name',
      header: 'Nome',
      render: (workflow: Workflow) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">{workflow.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{workflow.description}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (workflow: Workflow) => (
        <Badge variant={workflow.status === 'active' ? 'success' : workflow.status === 'draft' ? 'warning' : 'default'}>
          {workflow.status === 'active' ? 'Ativo' : workflow.status === 'draft' ? 'Rascunho' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Última Atualização',
      render: (workflow: Workflow) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {workflow.updatedAt.toLocaleDateString('pt-BR')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (workflow: Workflow) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => handleEditWorkflow(workflow)}>
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </Button>
          <Button variant="ghost" size="sm">
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
          </Button>
          <Button variant="ghost" size="sm">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111318] dark:text-white tracking-tight">
            Workflows
          </h1>
          <p className="text-[#616f89] dark:text-slate-400 text-sm mt-1">
            Gerencie fluxos de aprovação e publicação de documentos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <span className="material-symbols-outlined text-[18px]">history</span>
            Histórico
          </Button>
          <Button variant="primary" onClick={handleNewWorkflow}>
            <span className="material-symbols-outlined text-[18px]">add</span>
            Novo Workflow
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col"
          >
            <span className="text-xs font-semibold text-[#616f89] dark:text-slate-400 uppercase">
              {stat.label}
            </span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-2xl font-bold text-[#111318] dark:text-white">{stat.value}</span>
              <span
                className={`text-xs font-medium flex items-center px-1.5 py-0.5 rounded ${
                  stat.trendUp === true
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
                    : stat.trendUp === false
                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {stat.trendUp === true && (
                  <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
                )}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow List */}
      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-[#111318] dark:text-white">Workflows Configurados</h2>
        </div>
        <Table
          columns={columns}
          data={workflows}
          onRowClick={handleEditWorkflow}
        />
      </div>
    </div>
  );
}
