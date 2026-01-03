import { useState, useMemo } from 'react';
import { WorkflowTask, WorkflowHistoryItem, TaskStatus } from '../types';
import { TaskList, TaskDetail, TaskFilters, TaskFiltersState } from '../components/tasks';

// Mock data for demonstration
const mockTasks: WorkflowTask[] = [
  {
    id: 'DOC-2023-8942',
    workflowInstanceId: 'wf-001',
    documentId: 'doc-001',
    documentName: 'Contrato de Prestação de Serviços - TI',
    documentType: 'pdf',
    documentSize: 2457600,
    documentVersion: '3.0',
    assigneeId: 'user-001',
    requesterId: 'user-002',
    requesterName: 'João Silva',
    requesterAvatar: '',
    department: 'Tecnologia da Informação',
    type: 'Aprovação Financeira',
    status: 'pending',
    priority: 'urgent',
    dueDate: new Date(),
    createdAt: new Date('2023-10-02T10:30:00'),
    metadata: {
      'Valor do Contrato': 'R$ 45.000,00',
      'Centro de Custo': 'CC-2023-TI',
    },
  },
  {
    id: 'REP-2023-1102',
    workflowInstanceId: 'wf-002',
    documentId: 'doc-002',
    documentName: 'Relatório Mensal de Vendas Q3',
    documentType: 'docx',
    documentSize: 1536000,
    documentVersion: '1.0',
    assigneeId: 'user-001',
    requesterId: 'user-003',
    requesterName: 'Maria Souza',
    department: 'Comercial',
    type: 'Revisão Técnica',
    status: 'pending',
    priority: 'normal',
    dueDate: new Date('2023-10-15'),
    createdAt: new Date('2023-10-05T14:00:00'),
  },
  {
    id: 'XLS-2023-4421',
    workflowInstanceId: 'wf-003',
    documentId: 'doc-003',
    documentName: 'Planilha de Custos Operacionais',
    documentType: 'xlsx',
    documentSize: 512000,
    documentVersion: '2.1',
    assigneeId: 'user-001',
    requesterId: 'user-004',
    requesterName: 'Carlos Lima',
    department: 'Financeiro',
    type: 'Aprovação Final',
    status: 'pending',
    priority: 'normal',
    dueDate: new Date('2023-10-18'),
    createdAt: new Date('2023-10-08T09:15:00'),
  },
  {
    id: 'IMG-2023-0092',
    workflowInstanceId: 'wf-004',
    documentId: 'doc-004',
    documentName: 'Assets Campanha Black Friday',
    documentType: 'png',
    documentSize: 8192000,
    documentVersion: '1.0',
    assigneeId: 'user-001',
    requesterId: 'user-005',
    requesterName: 'Design Team',
    department: 'Marketing',
    type: 'Aprovação de Marketing',
    status: 'pending',
    priority: 'urgent',
    dueDate: new Date(Date.now() - 86400000), // Yesterday
    createdAt: new Date('2023-10-01T11:00:00'),
  },
];

const mockHistory: WorkflowHistoryItem[] = [
  {
    id: 'hist-001',
    action: 'Solicitação Criada',
    description: 'Contrato revisado pelo jurídico, segue para aprovação financeira.',
    userId: 'user-002',
    userName: 'João Silva',
    timestamp: new Date('2023-10-02T10:30:00'),
    status: 'completed',
  },
  {
    id: 'hist-002',
    action: 'Aguardando Aprovação Financeira',
    userId: 'user-001',
    userName: 'Atribuído a você',
    timestamp: new Date('2023-10-02T10:35:00'),
    status: 'current',
  },
];

export default function Tarefas() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(mockTasks[0]?.id);
  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    status: 'pending',
    statusFilter: [],
    deadlineFilter: 'all',
  });
  const [tasks, setTasks] = useState<WorkflowTask[]>(mockTasks);

  const selectedTask = useMemo(() => {
    return tasks.find(t => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by status tab
    if (filters.status === 'pending') {
      result = result.filter(t => t.status === 'pending' || t.status === 'in_progress');
    } else if (filters.status === 'completed') {
      result = result.filter(t => t.status === 'approved' || t.status === 'rejected');
    }

    // Filter by status dropdown
    if (filters.statusFilter && filters.statusFilter.length > 0) {
      result = result.filter(t => filters.statusFilter!.includes(t.status));
    }

    // Filter by deadline
    if (filters.deadlineFilter && filters.deadlineFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      result = result.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        
        switch (filters.deadlineFilter) {
          case 'overdue':
            return dueDate < today;
          case 'today':
            return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
          case 'week':
            return dueDate >= today && dueDate <= weekEnd;
          default:
            return true;
        }
      });
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(t =>
        t.documentName.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower) ||
        t.requesterName.toLowerCase().includes(searchLower) ||
        t.type.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [tasks, filters]);

  const pendingCount = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const overdueCount = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  const handleApprove = (taskId: string, comment?: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'approved' as TaskStatus } : t
    ));
    // In a real app, this would call an API
    console.log('Approved task:', taskId, comment);
  };

  const handleReject = (taskId: string, reason: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'rejected' as TaskStatus } : t
    ));
    // In a real app, this would call an API
    console.log('Rejected task:', taskId, reason);
  };

  const handleViewDocument = (documentId: string) => {
    // In a real app, this would navigate to the document viewer
    console.log('View document:', documentId);
  };

  const handleDownloadDocument = (documentId: string) => {
    // In a real app, this would trigger a download
    console.log('Download document:', documentId);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 text-sm">
        <a className="text-[#616f89] dark:text-gray-400 font-medium hover:underline" href="#">
          Home
        </a>
        <span className="text-[#616f89] dark:text-gray-600">/</span>
        <span className="text-[#111318] dark:text-gray-200 font-medium">Minhas Tarefas</span>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        pendingCount={pendingCount}
        overdueCount={overdueCount}
      />

      {/* Master Detail Content */}
      <div className="flex flex-col lg:flex-row h-[700px] bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* LEFT: Task List */}
        <div className="w-full lg:w-7/12 xl:w-1/2 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-surface-dark">
          <TaskList
            tasks={filteredTasks}
            selectedTaskId={selectedTaskId}
            onTaskSelect={setSelectedTaskId}
          />
        </div>

        {/* RIGHT: Detail Panel */}
        <div className="hidden lg:flex flex-col w-5/12 xl:w-1/2">
          <TaskDetail
            task={selectedTask}
            history={selectedTask ? mockHistory : []}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        </div>
      </div>
    </div>
  );
}
