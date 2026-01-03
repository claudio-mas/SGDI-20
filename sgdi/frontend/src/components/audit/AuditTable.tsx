import React, { useState } from 'react';
import { AuditLog, AuditAction, AuditLogDetails } from '../../types';

export interface AuditTableProps {
  logs: AuditLog[];
  loading?: boolean;
  onViewDetails?: (log: AuditLog) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

// Action badge configuration - Requirement 12.5
const actionConfig: Record<AuditAction, { 
  label: string; 
  icon: string; 
  bgColor: string; 
  textColor: string;
  borderColor: string;
}> = {
  create: {
    label: 'Criação',
    icon: 'add_circle',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800/50',
  },
  edit: {
    label: 'Edição',
    icon: 'edit',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800/50',
  },
  delete: {
    label: 'Exclusão',
    icon: 'delete',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800/50',
  },
  share: {
    label: 'Compartilhamento',
    icon: 'share',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800/50',
  },
  view: {
    label: 'Visualização',
    icon: 'visibility',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-600',
  },
  restore: {
    label: 'Restauração',
    icon: 'restore',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-700 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800/50',
  },
};

// Helper to get action badge config
export const getActionBadgeConfig = (action: AuditAction) => {
  return actionConfig[action] || actionConfig.view;
};

// Format date for display
const formatDateTime = (date: Date) => {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const timeStr = d.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return { dateStr, timeStr };
};

// Action Badge Component
const ActionBadge: React.FC<{ action: AuditAction }> = ({ action }) => {
  const config = getActionBadgeConfig(action);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      data-testid={`action-badge-${action}`}
      data-action={action}
    >
      <span className="material-symbols-outlined text-sm">{config.icon}</span>
      {config.label}
    </span>
  );
};

// User Avatar Component
const UserAvatar: React.FC<{ name: string; avatar?: string; isSystem?: boolean }> = ({ 
  name, 
  avatar, 
  isSystem 
}) => {
  if (isSystem) {
    return (
      <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full size-8">
        <span className="material-symbols-outlined text-lg">dns</span>
      </div>
    );
  }

  if (avatar) {
    return (
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
        style={{ backgroundImage: `url("${avatar}")` }}
      />
    );
  }

  // Generate initials
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-[#616f89] dark:text-gray-300 rounded-full size-8 text-xs font-bold">
      {initials}
    </div>
  );
};

// Expanded Details Row Component
const ExpandedDetails: React.FC<{ details: AuditLogDetails; ipAddress: string }> = ({ 
  details, 
  ipAddress 
}) => {
  return (
    <tr className="bg-gray-50 dark:bg-gray-800/30">
      <td colSpan={6} className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[#616f89] dark:text-gray-400 font-medium">Endereço IP:</span>
            <p className="text-[#111318] dark:text-white font-mono mt-1">{ipAddress}</p>
          </div>
          {details.browser && (
            <div>
              <span className="text-[#616f89] dark:text-gray-400 font-medium">Navegador:</span>
              <p className="text-[#111318] dark:text-white mt-1">{details.browser}</p>
            </div>
          )}
          {details.os && (
            <div>
              <span className="text-[#616f89] dark:text-gray-400 font-medium">Sistema Operacional:</span>
              <p className="text-[#111318] dark:text-white mt-1">{details.os}</p>
            </div>
          )}
          {details.location && (
            <div>
              <span className="text-[#616f89] dark:text-gray-400 font-medium">Localização:</span>
              <p className="text-[#111318] dark:text-white mt-1">{details.location}</p>
            </div>
          )}
          {details.sharedWith && details.sharedWith.length > 0 && (
            <div className="col-span-2">
              <span className="text-[#616f89] dark:text-gray-400 font-medium">Compartilhado com:</span>
              <p className="text-[#111318] dark:text-white mt-1">{details.sharedWith.join(', ')}</p>
            </div>
          )}
          {details.permissionLevel && (
            <div>
              <span className="text-[#616f89] dark:text-gray-400 font-medium">Nível de Permissão:</span>
              <p className="text-[#111318] dark:text-white mt-1">{details.permissionLevel}</p>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Pagination Component
const Pagination: React.FC<{
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}> = ({ page, pageSize, total, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(page);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 gap-4">
      <p className="text-sm text-[#616f89] dark:text-gray-400">
        Exibindo{' '}
        <span className="font-medium text-[#111318] dark:text-white">
          {startItem}-{endItem}
        </span>{' '}
        de <span className="font-medium text-[#111318] dark:text-white">{total}</span> resultados
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center justify-center size-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#616f89] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        {getPageNumbers().map((pageNum, idx) =>
          typeof pageNum === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(pageNum)}
              className={`flex items-center justify-center size-8 rounded-lg text-sm font-medium ${
                pageNum === page
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#616f89] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          ) : (
            <span key={idx} className="text-[#616f89] dark:text-gray-500">
              ...
            </span>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center justify-center size-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#616f89] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  loading = false,
  onViewDetails,
  pagination,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" data-testid="audit-table">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <th className="p-4 text-xs font-semibold tracking-wide text-[#616f89] dark:text-gray-400 uppercase">
                Data & Hora
              </th>
              <th className="p-4 text-xs font-semibold tracking-wide text-[#616f89] dark:text-gray-400 uppercase">
                Usuário
              </th>
              <th className="p-4 text-xs font-semibold tracking-wide text-[#616f89] dark:text-gray-400 uppercase">
                Ação
              </th>
              <th className="p-4 text-xs font-semibold tracking-wide text-[#616f89] dark:text-gray-400 uppercase">
                Documento
              </th>
              <th className="p-4 text-xs font-semibold tracking-wide text-[#616f89] dark:text-gray-400 uppercase">
                IP Address
              </th>
              <th className="p-4 text-xs font-semibold tracking-wide text-[#616f89] dark:text-gray-400 uppercase text-right">
                Detalhes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
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
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">
                      history
                    </span>
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhum registro de auditoria encontrado
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const { dateStr, timeStr } = formatDateTime(log.timestamp);
                const isExpanded = expandedIds.has(log.id);
                const isSystem = log.userName.toLowerCase() === 'sistema';

                return (
                  <React.Fragment key={log.id}>
                    <tr
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                      data-testid={`audit-row-${log.id}`}
                    >
                      <td className="p-4 text-sm text-[#111318] dark:text-gray-300 font-medium whitespace-nowrap">
                        {dateStr}{' '}
                        <span className="text-[#616f89] dark:text-gray-500 font-normal ml-1">
                          {timeStr}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={log.userName}
                            avatar={log.userAvatar}
                            isSystem={isSystem}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#111318] dark:text-white">
                              {log.userName}
                            </span>
                            <span className="text-xs text-[#616f89] dark:text-gray-500">
                              {log.userEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <ActionBadge action={log.action} />
                      </td>
                      <td className="p-4">
                        {log.documentDeleted ? (
                          <span className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-500 line-through">
                            <span className="material-symbols-outlined text-lg">description</span>
                            {log.documentName}
                          </span>
                        ) : (
                          <a
                            href="#"
                            className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                          >
                            <span className="material-symbols-outlined text-lg">description</span>
                            {log.documentName}
                          </a>
                        )}
                      </td>
                      <td className="p-4 text-sm text-[#616f89] dark:text-gray-400 font-mono">
                        {log.ipAddress}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            toggleExpanded(log.id);
                            onViewDetails?.(log);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isExpanded
                              ? 'bg-primary/10 text-primary'
                              : 'text-[#616f89] hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-700 dark:text-gray-400'
                          }`}
                          data-testid={`audit-details-${log.id}`}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {isExpanded ? 'expand_less' : 'visibility'}
                          </span>
                        </button>
                      </td>
                    </tr>
                    {isExpanded && log.details && (
                      <ExpandedDetails details={log.details} ipAddress={log.ipAddress} />
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};

export default AuditTable;
