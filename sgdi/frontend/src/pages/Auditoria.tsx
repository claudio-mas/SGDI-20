import { useState, useMemo } from 'react';
import { AuditLog, AuditFiltersState } from '../types';
import { AuditFilters, AuditTable } from '../components/audit';
import { Button } from '../components/common/Button';
import { exportAuditLogsToCSV } from '../utils/csvExport';

// Mock data for demonstration
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date('2023-10-23T14:30:00'),
    userId: 'user-001',
    userName: 'Ana Silva',
    userEmail: 'ana.s@empresa.com',
    userAvatar: '',
    action: 'edit',
    documentId: 'doc-001',
    documentName: 'Contrato_Vendas_Q3.pdf',
    ipAddress: '192.168.0.1',
    details: {
      browser: 'Chrome 118.0',
      os: 'Windows 11',
      location: 'São Paulo, BR',
    },
  },
  {
    id: '2',
    timestamp: new Date('2023-10-23T14:15:00'),
    userId: 'user-002',
    userName: 'Carlos Souza',
    userEmail: 'carlos.z@empresa.com',
    action: 'delete',
    documentId: 'doc-002',
    documentName: 'Rascunho_Antigo.docx',
    documentDeleted: true,
    ipAddress: '192.168.0.45',
    details: {
      browser: 'Firefox 119.0',
      os: 'macOS Sonoma',
      location: 'Rio de Janeiro, BR',
    },
  },
  {
    id: '3',
    timestamp: new Date('2023-10-23T10:00:00'),
    userId: 'user-003',
    userName: 'Maria Oliveira',
    userEmail: 'maria.o@empresa.com',
    action: 'share',
    documentId: 'doc-003',
    documentName: 'Proposta_2024.pdf',
    ipAddress: '10.0.0.12',
    details: {
      browser: 'Safari 17.0',
      os: 'macOS Sonoma',
      location: 'Belo Horizonte, BR',
      sharedWith: ['joao.p@empresa.com', 'pedro.m@empresa.com'],
      permissionLevel: 'Visualização',
    },
  },
  {
    id: '4',
    timestamp: new Date('2023-10-22T09:12:00'),
    userId: 'user-004',
    userName: 'João Pereira',
    userEmail: 'joao.p@empresa.com',
    action: 'view',
    documentId: 'doc-004',
    documentName: 'Relatorio_Q1.xlsx',
    ipAddress: '192.168.0.8',
    details: {
      browser: 'Edge 118.0',
      os: 'Windows 10',
      location: 'Curitiba, BR',
    },
  },
  {
    id: '5',
    timestamp: new Date('2023-10-21T18:45:00'),
    userId: 'system',
    userName: 'Sistema',
    userEmail: 'Automático',
    action: 'create',
    documentId: 'doc-005',
    documentName: 'Log_Backup_Auto.txt',
    ipAddress: 'localhost',
    details: {
      browser: 'N/A',
      os: 'Linux Server',
      location: 'Servidor Local',
    },
  },
  {
    id: '6',
    timestamp: new Date('2023-10-21T16:30:00'),
    userId: 'user-005',
    userName: 'Pedro Martins',
    userEmail: 'pedro.m@empresa.com',
    action: 'restore',
    documentId: 'doc-006',
    documentName: 'Planilha_Orcamento.xlsx',
    ipAddress: '192.168.0.22',
    details: {
      browser: 'Chrome 118.0',
      os: 'Windows 11',
      location: 'São Paulo, BR',
    },
  },
];

const mockUsers = [
  { id: 'user-001', name: 'Ana Silva' },
  { id: 'user-002', name: 'Carlos Souza' },
  { id: 'user-003', name: 'Maria Oliveira' },
  { id: 'user-004', name: 'João Pereira' },
  { id: 'user-005', name: 'Pedro Martins' },
  { id: 'system', name: 'Sistema (Automático)' },
];

const defaultFilters: AuditFiltersState = {
  period: '7days',
  userId: '',
  action: '',
  documentName: '',
};

export default function Auditoria() {
  const [filters, setFilters] = useState<AuditFiltersState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<AuditFiltersState>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;
  const totalLogs = 128; // Mock total

  // Filter logs based on applied filters
  const filteredLogs = useMemo(() => {
    let result = [...mockAuditLogs];

    // Filter by user
    if (appliedFilters.userId) {
      const searchTerm = appliedFilters.userId.toLowerCase();
      result = result.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchTerm) ||
          log.userEmail.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by action
    if (appliedFilters.action) {
      result = result.filter((log) => log.action === appliedFilters.action);
    }

    // Filter by document name
    if (appliedFilters.documentName) {
      const searchTerm = appliedFilters.documentName.toLowerCase();
      result = result.filter((log) =>
        log.documentName.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by period (simplified for demo)
    if (appliedFilters.period) {
      const now = new Date();
      const periodDays: Record<string, number> = {
        today: 1,
        yesterday: 2,
        '7days': 7,
        '30days': 30,
        '90days': 90,
        all: 9999,
      };
      const days = periodDays[appliedFilters.period] || 7;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      result = result.filter((log) => new Date(log.timestamp) >= cutoff);
    }

    return result;
  }, [appliedFilters]);

  const handleApplyFilters = () => {
    setLoading(true);
    setAppliedFilters(filters);
    setCurrentPage(1);
    // Simulate API call
    setTimeout(() => setLoading(false), 500);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    exportAuditLogsToCSV(filteredLogs);
  };

  const handleViewDetails = (log: AuditLog) => {
    console.log('View details for log:', log.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex flex-col gap-6 shrink-0">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 text-sm">
          <a
            className="text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors"
            href="#"
          >
            Início
          </a>
          <span className="text-[#616f89] dark:text-gray-500">/</span>
          <a
            className="text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors"
            href="#"
          >
            Administração
          </a>
          <span className="text-[#616f89] dark:text-gray-500">/</span>
          <span className="text-[#111318] dark:text-white font-medium">
            Relatórios de Auditoria
          </span>
        </nav>

        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-tight">
              Relatórios de Auditoria
            </h1>
            <p className="text-[#616f89] dark:text-gray-400 text-base font-normal max-w-2xl">
              Monitore a integridade do sistema visualizando logs detalhados de todas as
              interações com documentos.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={<span className="material-symbols-outlined text-xl">settings</span>}
            >
              Configurar Alertas
            </Button>
            <Button
              variant="primary"
              onClick={handleExportCSV}
              icon={<span className="material-symbols-outlined text-xl">download</span>}
              data-testid="export-csv-button"
            >
              Exportar CSV
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-background-dark">
        <div className="mx-auto max-w-[1200px] flex flex-col gap-6">
          {/* Filters */}
          <AuditFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            users={mockUsers}
          />

          {/* Table */}
          <AuditTable
            logs={filteredLogs}
            loading={loading}
            onViewDetails={handleViewDetails}
            pagination={{
              page: currentPage,
              pageSize,
              total: totalLogs,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      </div>
    </div>
  );
}
