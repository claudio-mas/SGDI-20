export interface WorkflowItem {
  id: string;
  title: string;
  status: 'analyzing' | 'in_progress' | 'almost_done' | 'waiting' | 'completed';
  currentStep: string;
  progress: number; // 0-100
}

export interface WorkflowStatusProps {
  workflows: WorkflowItem[];
  loading?: boolean;
  onViewAll?: () => void;
  onWorkflowClick?: (workflow: WorkflowItem) => void;
}

const statusConfig: Record<
  WorkflowItem['status'],
  { label: string; color: string; progressColor: string }
> = {
  analyzing: {
    label: 'Em Análise',
    color: 'text-blue-600 dark:text-blue-400',
    progressColor: 'bg-blue-600',
  },
  in_progress: {
    label: 'Em Progresso',
    color: 'text-purple-600 dark:text-purple-400',
    progressColor: 'bg-purple-600',
  },
  almost_done: {
    label: 'Quase concluído',
    color: 'text-green-600 dark:text-green-400',
    progressColor: 'bg-green-600',
  },
  waiting: {
    label: 'Aguardando',
    color: 'text-orange-600 dark:text-orange-400',
    progressColor: 'bg-orange-600',
  },
  completed: {
    label: 'Concluído',
    color: 'text-green-600 dark:text-green-400',
    progressColor: 'bg-green-600',
  },
};

export function WorkflowStatus({
  workflows,
  loading = false,
  onViewAll,
  onWorkflowClick,
}: WorkflowStatusProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">schema</span>
          Status dos Workflows Ativos
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </button>
        )}
      </div>
      <div className="bg-white dark:bg-[#1a2233] border border-[#e5e7eb] dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 grid gap-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Carregando...</span>
              </div>
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Nenhum workflow ativo
            </div>
          ) : (
            workflows.map((workflow) => {
              const config = statusConfig[workflow.status];
              return (
                <div
                  key={workflow.id}
                  onClick={() => onWorkflowClick?.(workflow)}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {workflow.title}
                      </p>
                      <span className={`text-xs font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Etapa: {workflow.currentStep}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`${config.progressColor} h-1.5 rounded-full transition-all duration-300`}
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkflowStatus;
