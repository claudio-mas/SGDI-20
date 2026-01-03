import React from 'react';
import { AuditFiltersState, AuditAction } from '../../types';

export interface AuditFiltersProps {
  filters: AuditFiltersState;
  onFiltersChange: (filters: AuditFiltersState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  users?: { id: string; name: string }[];
}

const periodOptions = [
  { value: '7days', label: 'Últimos 7 dias' },
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: '30days', label: 'Último mês' },
  { value: '90days', label: 'Últimos 3 meses' },
  { value: 'all', label: 'Todo o período' },
];

const actionOptions: { value: AuditAction | ''; label: string }[] = [
  { value: '', label: 'Todas as atividades' },
  { value: 'create', label: 'Criação' },
  { value: 'edit', label: 'Edição' },
  { value: 'view', label: 'Visualização' },
  { value: 'delete', label: 'Exclusão' },
  { value: 'share', label: 'Compartilhamento' },
  { value: 'restore', label: 'Restauração' },
];

export const AuditFilters: React.FC<AuditFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  users = [],
}) => {
  const handleChange = (field: keyof AuditFiltersState, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary text-xl">filter_list</span>
        <h3 className="text-sm font-bold text-[#111318] dark:text-white uppercase tracking-wider">
          Filtros de Busca
        </h3>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Period Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#616f89] dark:text-gray-400">
            Período
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616f89]">
              <span className="material-symbols-outlined text-xl">calendar_today</span>
            </span>
            <select
              value={filters.period}
              onChange={(e) => handleChange('period', e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-[#f0f2f4] dark:bg-gray-800 border-none rounded-lg text-sm text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
              data-testid="audit-filter-period"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616f89] pointer-events-none">
              <span className="material-symbols-outlined text-xl">expand_more</span>
            </span>
          </div>
        </div>

        {/* User Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#616f89] dark:text-gray-400">
            Usuário
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616f89]">
              <span className="material-symbols-outlined text-xl">person_search</span>
            </span>
            <input
              type="text"
              list="audit-users-list"
              value={filters.userId}
              onChange={(e) => handleChange('userId', e.target.value)}
              placeholder="Buscar usuário..."
              className="w-full pl-10 pr-3 py-2.5 bg-[#f0f2f4] dark:bg-gray-800 border-none rounded-lg text-sm text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 placeholder:text-[#616f89]"
              data-testid="audit-filter-user"
            />
            <datalist id="audit-users-list">
              {users.map((user) => (
                <option key={user.id} value={user.name} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Action Type Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#616f89] dark:text-gray-400">
            Tipo de Atividade
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616f89]">
              <span className="material-symbols-outlined text-xl">category</span>
            </span>
            <select
              value={filters.action}
              onChange={(e) => handleChange('action', e.target.value as AuditAction | '')}
              className="w-full pl-10 pr-8 py-2.5 bg-[#f0f2f4] dark:bg-gray-800 border-none rounded-lg text-sm text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
              data-testid="audit-filter-action"
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616f89] pointer-events-none">
              <span className="material-symbols-outlined text-xl">expand_more</span>
            </span>
          </div>
        </div>

        {/* Document Name Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#616f89] dark:text-gray-400">
            Nome do Documento
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616f89]">
              <span className="material-symbols-outlined text-xl">search</span>
            </span>
            <input
              type="text"
              value={filters.documentName}
              onChange={(e) => handleChange('documentName', e.target.value)}
              placeholder="Busca exata ou parcial..."
              className="w-full pl-10 pr-3 py-2.5 bg-[#f0f2f4] dark:bg-gray-800 border-none rounded-lg text-sm text-[#111318] dark:text-white focus:ring-2 focus:ring-primary/50 placeholder:text-[#616f89]"
              data-testid="audit-filter-document"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
        <button
          onClick={onClearFilters}
          className="text-sm font-medium text-[#616f89] dark:text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          data-testid="audit-clear-filters"
        >
          <span className="material-symbols-outlined text-base">close</span>
          Limpar filtros
        </button>
        <button
          onClick={onApplyFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
          data-testid="audit-apply-filters"
        >
          <span className="material-symbols-outlined text-lg">filter_alt</span>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default AuditFilters;
