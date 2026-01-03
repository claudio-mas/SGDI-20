import React from 'react';
import { WorkflowNode, WorkflowNodeConfig } from '../../types';
import Input from '../common/Input';

interface NodePropertiesProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onDelete: (nodeId: string) => void;
}

const nodeTypeLabels: Record<string, { label: string; bgClass: string; textClass: string; icon: string }> = {
  start: { label: 'Etapa de Início', bgClass: 'bg-green-50 dark:bg-green-900/10', textClass: 'text-green-800 dark:text-green-200', icon: 'play_circle' },
  review: { label: 'Etapa de Revisão', bgClass: 'bg-yellow-50 dark:bg-yellow-900/10', textClass: 'text-yellow-800 dark:text-yellow-200', icon: 'rate_review' },
  approval: { label: 'Etapa de Aprovação', bgClass: 'bg-blue-50 dark:bg-blue-900/10', textClass: 'text-blue-800 dark:text-blue-200', icon: 'approval_delegation' },
  condition: { label: 'Ponto de Decisão', bgClass: 'bg-purple-50 dark:bg-purple-900/10', textClass: 'text-purple-800 dark:text-purple-200', icon: 'call_split' },
  publication: { label: 'Etapa de Publicação', bgClass: 'bg-green-50 dark:bg-green-900/10', textClass: 'text-green-800 dark:text-green-200', icon: 'publish' },
  email: { label: 'Notificação por Email', bgClass: 'bg-indigo-50 dark:bg-indigo-900/10', textClass: 'text-indigo-800 dark:text-indigo-200', icon: 'mail' },
  end: { label: 'Etapa Final', bgClass: 'bg-red-50 dark:bg-red-900/10', textClass: 'text-red-800 dark:text-red-200', icon: 'stop_circle' },
};

const NodeProperties: React.FC<NodePropertiesProps> = ({
  node,
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!node) {
    return (
      <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] flex flex-col z-10">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#111318] dark:text-white">Propriedades</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Selecione um nó para ver suas propriedades
          </p>
        </div>
      </div>
    );
  }

  const typeConfig = nodeTypeLabels[node.type];

  const handleNameChange = (value: string) => {
    onUpdate(node.id, { name: value });
  };

  const handleConfigChange = (key: keyof WorkflowNodeConfig, value: unknown) => {
    onUpdate(node.id, { config: { ...node.config, [key]: value } });
  };

  return (
    <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] flex flex-col z-10 shadow-xl">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-bold text-sm text-[#111318] dark:text-white">Detalhes da Etapa</h3>
        <button 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Node Type Indicator */}
        <div className={`flex items-center gap-3 p-3 ${typeConfig.bgClass} border border-slate-100 dark:border-slate-700/50 rounded-lg`}>
          <div className="size-10 rounded bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
            <span className={`material-symbols-outlined text-[20px] ${typeConfig.textClass}`}>{typeConfig.icon}</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-bold ${typeConfig.textClass}`}>{typeConfig.label}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">ID: {node.id}</span>
          </div>
        </div>

        {/* Name Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#616f89] dark:text-slate-400">Nome da Etapa</label>
          <Input
            type="text"
            value={node.name}
            onChange={handleNameChange}
            placeholder="Nome da etapa"
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#616f89] dark:text-slate-400">Descrição</label>
          <textarea
            className="w-full rounded-md border-slate-200 dark:border-slate-600 bg-[#f8fafc] dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white resize-none"
            rows={2}
            value={node.config.description || ''}
            onChange={(e) => handleConfigChange('description', e.target.value)}
            placeholder="Descrição opcional..."
          />
        </div>

        {/* Approval/Review specific fields */}
        {(node.type === 'approval' || node.type === 'review') && (
          <>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-[#616f89] dark:text-slate-400">Aprovadores</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">search</span>
                <input
                  className="w-full pl-9 py-2 rounded-md border-slate-200 dark:border-slate-600 bg-[#f8fafc] dark:bg-slate-800 text-xs focus:border-primary focus:ring-primary dark:text-white dark:placeholder-slate-500"
                  placeholder="Adicionar usuário ou grupo..."
                  type="text"
                />
              </div>
              
              <div className="flex flex-col gap-2 mt-1 p-2 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-100 dark:border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Regra de Aprovação</span>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name={`approval_rule_${node.id}`}
                    checked={node.config.approvalRule !== 'all'}
                    onChange={() => handleConfigChange('approvalRule', 'any')}
                    className="text-primary focus:ring-primary border-slate-300 bg-transparent"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                    Qualquer um (Primeiro a aprovar)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name={`approval_rule_${node.id}`}
                    checked={node.config.approvalRule === 'all'}
                    onChange={() => handleConfigChange('approvalRule', 'all')}
                    className="text-primary focus:ring-primary border-slate-300 bg-transparent"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                    Consenso (Todos selecionados)
                  </span>
                </label>
              </div>
            </div>

            {/* SLA Settings */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-[#616f89] dark:text-slate-400">Prazos e SLA</label>
              <div className="flex items-center gap-2">
                <div className="relative w-28">
                  <input
                    type="number"
                    value={node.config.slaHours || 48}
                    onChange={(e) => handleConfigChange('slaHours', parseInt(e.target.value))}
                    className="w-full text-sm rounded-md border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 pr-8 focus:border-primary focus:ring-primary dark:text-white"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">h</span>
                </div>
                <select
                  value={node.config.slaUnit || 'hours'}
                  onChange={(e) => handleConfigChange('slaUnit', e.target.value)}
                  className="flex-1 text-xs py-2 px-2 rounded-md border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary dark:text-white"
                >
                  <option value="hours">Horas úteis</option>
                  <option value="days">Dias corridos</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={node.config.notifyOnDelay || false}
                  onChange={(e) => handleConfigChange('notifyOnDelay', e.target.checked)}
                  className="rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-600 bg-transparent"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">Notificar gestor ao expirar</span>
              </div>
            </div>
          </>
        )}

        {/* Condition specific fields */}
        {node.type === 'condition' && (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-[#616f89] dark:text-slate-400">Tipo de Condição</label>
            <select
              value={node.config.conditionOperator || 'greater_than'}
              onChange={(e) => handleConfigChange('conditionOperator', e.target.value)}
              className="w-full rounded-md border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
            >
              <option value="equals">Igual a</option>
              <option value="not_equals">Diferente de</option>
              <option value="greater_than">Maior que</option>
              <option value="less_than">Menor que</option>
              <option value="contains">Contém</option>
            </select>
            
            <div className="flex flex-col gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Regras Lógicas</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 w-6">SE</span>
                <input
                  type="text"
                  value={node.config.conditionField || ''}
                  onChange={(e) => handleConfigChange('conditionField', e.target.value)}
                  placeholder="Campo"
                  className="flex-1 text-xs py-1 px-2 rounded border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 w-6">FOR</span>
                <input
                  type="text"
                  value={String(node.config.conditionValue || '')}
                  onChange={(e) => handleConfigChange('conditionValue', e.target.value)}
                  placeholder="Valor"
                  className="flex-1 text-xs py-1 px-2 rounded border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Email specific fields */}
        {node.type === 'email' && (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-[#616f89] dark:text-slate-400">Template de Email</label>
            <select
              value={node.config.emailTemplate || ''}
              onChange={(e) => handleConfigChange('emailTemplate', e.target.value)}
              className="w-full rounded-md border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
            >
              <option value="">Selecione um template</option>
              <option value="approval_request">Solicitação de Aprovação</option>
              <option value="approval_complete">Aprovação Concluída</option>
              <option value="rejection_notice">Notificação de Rejeição</option>
              <option value="reminder">Lembrete</option>
            </select>
          </div>
        )}
      </div>

      {/* Delete Button */}
      {node.type !== 'start' && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => onDelete(node.id)}
            className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Excluir Etapa
          </button>
        </div>
      )}
    </div>
  );
};

export default NodeProperties;
