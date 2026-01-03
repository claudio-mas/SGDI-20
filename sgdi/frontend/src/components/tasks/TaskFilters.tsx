import React, { useState } from 'react';
import { TaskStatus } from '../../types';

export interface TaskFiltersState {
  search: string;
  status: 'all' | 'pending' | 'completed';
  statusFilter?: TaskStatus[];
  deadlineFilter?: 'all' | 'overdue' | 'today' | 'week';
}

export interface TaskFiltersProps {
  filters: TaskFiltersState;
  onFiltersChange: (filters: TaskFiltersState) => void;
  pendingCount: number;
  overdueCount: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  pendingCount,
  overdueCount,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeadlineDropdown, setShowDeadlineDropdown] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusTabChange = (status: 'all' | 'pending' | 'completed') => {
    onFiltersChange({ ...filters, status });
  };

  const handleStatusFilterChange = (statusFilter: TaskStatus[]) => {
    onFiltersChange({ ...filters, statusFilter });
    setShowStatusDropdown(false);
  };

  const handleDeadlineFilterChange = (deadlineFilter: 'all' | 'overdue' | 'today' | 'week') => {
    onFiltersChange({ ...filters, deadlineFilter });
    setShowDeadlineDropdown(false);
  };

  return (
    <div className="flex flex-col gap-4" data-testid="task-filters">
      {/* Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black tracking-[-0.033em]">
            Minhas Tarefas de Workflow
          </h1>
          <p className="text-[#616f89] dark:text-gray-400 text-base">
            Gerencie suas aprovações e revisões de documentos pendentes.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end px-4 py-2 bg-white dark:bg-surface-dark rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
            <span className="text-xs font-semibold text-[#616f89] uppercase tracking-wide">Pendentes</span>
            <span className="text-2xl font-bold text-primary">{pendingCount}</span>
          </div>
          <div className="flex flex-col items-end px-4 py-2 bg-white dark:bg-surface-dark rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
            <span className="text-xs font-semibold text-[#616f89] uppercase tracking-wide">Atrasadas</span>
            <span className="text-2xl font-bold text-red-600">{overdueCount}</span>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Tabs */}
        <div className="flex p-1 bg-[#f0f2f4] dark:bg-gray-800 rounded-lg shrink-0">
          <button
            className={`px-4 py-1.5 text-sm font-semibold rounded ${
              filters.status === 'pending'
                ? 'shadow-sm bg-white dark:bg-gray-700 text-primary dark:text-white'
                : 'text-[#616f89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-gray-200'
            }`}
            onClick={() => handleStatusTabChange('pending')}
          >
            Pendentes
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded ${
              filters.status === 'completed'
                ? 'shadow-sm bg-white dark:bg-gray-700 text-primary dark:text-white'
                : 'text-[#616f89] dark:text-gray-400 hover:text-[#111318] dark:hover:text-gray-200'
            }`}
            onClick={() => handleStatusTabChange('completed')}
          >
            Concluídas
          </button>
        </div>

        {/* Search & Chips */}
        <div className="flex flex-1 flex-col md:flex-row gap-3 w-full lg:w-auto items-center">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#616f89]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="block w-full p-2 pl-10 text-sm text-[#111318] dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-primary focus:border-primary"
              placeholder="Buscar por documento, ID ou responsável..."
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              data-testid="task-search-input"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium text-[#616f89] dark:text-gray-300 whitespace-nowrap bg-white dark:bg-surface-dark"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Status
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleStatusFilterChange([])}
                    >
                      Todos
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleStatusFilterChange(['pending'])}
                    >
                      Pendente
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleStatusFilterChange(['in_progress'])}
                    >
                      Em Progresso
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleStatusFilterChange(['approved'])}
                    >
                      Aprovado
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleStatusFilterChange(['rejected'])}
                    >
                      Rejeitado
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Deadline Filter Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium text-[#616f89] dark:text-gray-300 whitespace-nowrap bg-white dark:bg-surface-dark"
                onClick={() => setShowDeadlineDropdown(!showDeadlineDropdown)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Prazo
              </button>
              {showDeadlineDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-2">
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleDeadlineFilterChange('all')}
                    >
                      Todos
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
                      onClick={() => handleDeadlineFilterChange('overdue')}
                    >
                      Atrasadas
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleDeadlineFilterChange('today')}
                    >
                      Vence Hoje
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleDeadlineFilterChange('week')}
                    >
                      Esta Semana
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
