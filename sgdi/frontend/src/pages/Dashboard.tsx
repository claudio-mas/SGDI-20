import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: documentos } = useQuery({
    queryKey: ['documentos-recentes'],
    queryFn: () => api.get('/documentos?porPagina=5').then(r => r.data),
  });

  const { data: tarefas } = useQuery({
    queryKey: ['tarefas-pendentes'],
    queryFn: () => api.get('/tarefas/pendentes').then(r => r.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Bom dia, {user?.nome?.split(' ')[0]}! 👋
      </h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon="description" label="Total de Documentos" value={documentos?.paginacao?.total || 0} color="blue" />
        <StatCard icon="share" label="Compartilhados" value={0} color="green" />
        <StatCard icon="pending_actions" label="Aprovações Pendentes" value={tarefas?.length || 0} color="orange" />
        <StatCard icon="cloud" label="Armazenamento" value="2.4 GB" color="purple" />
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction icon="upload_file" label="Upload" />
        <QuickAction icon="create_new_folder" label="Nova Pasta" />
        <QuickAction icon="document_scanner" label="Digitalizar" />
        <QuickAction icon="group_add" label="Gerenciar Equipe" />
      </div>

      {/* Documentos recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Documentos Recentes</h2>
        <div className="space-y-3">
          {documentos?.documentos?.map((doc: any) => (
            <div key={doc.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
              <div className="flex-1">
                <p className="font-medium dark:text-white">{doc.nome}</p>
                <p className="text-sm text-gray-500">{new Date(doc.dataModificacao).toLocaleDateString('pt-BR')}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                doc.status === 'aprovado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center mb-4`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-2xl font-bold dark:text-white">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition-shadow">
      <span className="material-symbols-outlined text-primary-500 text-3xl">{icon}</span>
      <span className="text-sm font-medium dark:text-white">{label}</span>
    </button>
  );
}
