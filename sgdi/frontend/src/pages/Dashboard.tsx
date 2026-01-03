import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActions, QuickAction } from '../components/dashboard/QuickActions';
import { RecentDocuments, RecentDocument } from '../components/dashboard/RecentDocuments';
import { StorageWidget } from '../components/dashboard/StorageWidget';
import { WorkflowStatus, WorkflowItem } from '../components/dashboard/WorkflowStatus';
import { ActivityFeed, ActivityItem } from '../components/dashboard/ActivityFeed';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: documentos, isLoading: loadingDocs } = useQuery({
    queryKey: ['documentos-recentes'],
    queryFn: () => api.get('/documentos?porPagina=5').then((r) => r.data),
  });

  const { data: tarefas } = useQuery({
    queryKey: ['tarefas-pendentes'],
    queryFn: () => api.get('/tarefas/pendentes').then((r) => r.data),
  });

  const quickActions: QuickAction[] = [
    { icon: 'upload_file', label: 'Upload', onClick: () => {} },
    { icon: 'create_new_folder', label: 'Nova Pasta', onClick: () => {} },
    { icon: 'document_scanner', label: 'Digitalizar', onClick: () => {} },
    { icon: 'group_add', label: 'Equipe', onClick: () => {} },
    { icon: 'fact_check', label: 'Relatórios', onClick: () => {} },
  ];

  const mockWorkflows: WorkflowItem[] = [
    { id: '1', title: 'Reembolso #8823', status: 'analyzing', currentStep: 'Aprovação Gestor', progress: 45 },
    { id: '2', title: 'Contratação: Dev Senior', status: 'in_progress', currentStep: 'Entrevista', progress: 70 },
    { id: '3', title: 'Novo Fornecedor', status: 'almost_done', currentStep: 'Assinatura', progress: 90 },
  ];

  const mockActivities: ActivityItem[] = [
    { id: '1', title: 'Documento enviado', description: 'Contrato_V2.pdf', timestamp: 'Há 5 min', type: 'upload' },
    { id: '2', title: 'Documento aprovado', description: 'Relatório Q3', timestamp: 'Há 1 hora', type: 'approve' },
    { id: '3', title: 'Compartilhado', description: 'Briefing.docx', timestamp: 'Há 2 horas', type: 'share' },
  ];

  const recentDocuments: RecentDocument[] = documentos?.documentos?.map((doc: any) => ({
    id: doc.id,
    name: doc.nome,
    type: doc.tipo || 'pdf',
    folder: doc.pasta || 'Meus Arquivos',
    date: new Date(doc.dataModificacao).toLocaleDateString('pt-BR'),
    size: formatFileSize(doc.tamanho || 0),
  })) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const firstName = user?.nome?.split(' ')[0] || 'Usuário';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#111318] dark:text-white">
          {getGreeting()}, {firstName}!
        </h2>
        <p className="text-[#616f89] dark:text-gray-400 mt-1">
          Resumo dos seus workflows e tarefas pendentes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon="description" label="Total de Documentos" value={documentos?.paginacao?.total || 0} color="blue" />
        <StatCard icon="schema" label="Workflows Ativos" value={mockWorkflows.length} color="purple" />
        <StatCard icon="assignment_late" label="Tarefas Pendentes" value={tarefas?.length || 0} color="orange" />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 dark:text-white">Acesso Rápido</h3>
        <QuickActions actions={quickActions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <WorkflowStatus workflows={mockWorkflows} />
          <RecentDocuments documents={recentDocuments} loading={loadingDocs} />
        </div>
        <div className="flex flex-col gap-6">
          <ActivityFeed activities={mockActivities} />
          <StorageWidget usedGB={75} totalGB={100} />
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
