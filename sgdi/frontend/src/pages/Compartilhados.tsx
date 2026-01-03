import { useState, useMemo } from 'react';
import { DocumentGridItem } from '../components/documents/DocumentGrid';
import Input from '../components/common/Input';
import Dropdown, { DropdownOption } from '../components/common/Dropdown';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

// Permission level type
type PermissionLevel = 'viewer' | 'editor' | 'owner';

// Extended document item with sharing info
interface SharedDocument extends DocumentGridItem {
  sharedBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  sharedAt: Date;
  permission: PermissionLevel;
}

// Mock data for shared documents
const mockSharedDocuments: SharedDocument[] = [
  {
    id: '1',
    name: 'Contrato de Prestação de Serviços.pdf',
    type: 'file',
    size: 2457600,
    updatedAt: new Date('2025-01-02T14:30:00'),
    sharedBy: {
      id: 'user1',
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNNoFiASzVGCjdBr4HN3RJJIHvE3zOl9TgEn2xmcxcXyr15ninQDk7DRZpJqATi1XYLnlDM_8JySEKbwi3OOPoJ9pmtaQKzYMQ-9A67EZ0HAD4xyX2Ul2qPSiZ6qmXX2GxMedOlO42sncEdNOH2tqLJsJ1Su6xlYI3-l1WmperctmgBV0jhY23VKwN97a6kcc1LJd6JR65xW4LzDwhbCO2lCAkEt--cP9PTBI8-uZ5eJpjENPDOIrzhJ38vufGzhfISqc2OPCHwrS4',
    },
    sharedAt: new Date('2025-01-02T10:00:00'),
    permission: 'editor',
  },
  {
    id: '2',
    name: 'Relatório Financeiro Q4 2024.xlsx',
    type: 'file',
    size: 1536000,
    updatedAt: new Date('2025-01-01T09:15:00'),
    sharedBy: {
      id: 'user2',
      name: 'João Santos',
      email: 'joao.santos@empresa.com',
    },
    sharedAt: new Date('2024-12-28T16:45:00'),
    permission: 'viewer',
  },
  {
    id: '3',
    name: 'Apresentação Projeto Alpha.pptx',
    type: 'file',
    size: 5242880,
    updatedAt: new Date('2024-12-30T11:20:00'),
    sharedBy: {
      id: 'user3',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@empresa.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj4aBpYznkqo5qZ2ldlgbw9wb64_h9gXuvUIIWYI9YCU84v0zeaKQ9YrCzQHhXRiqcAFvOSQQ3IMjfZ7BDtQTYWJ0eLe3ufgiQZdHX_3sEKkjEG_0j5AXWU8CHnKyDYaFx44SM8MlMFqVzGRHcFDHEhyeY_DxwElLT9TjTDMkSG4tcJcYYMfBV4mywQ2EzA0MfaqvZdcqysoQlXHkTKKhfHK6G47C_UkrMxIdkgkFsc32uqlVp59unucra10EfG_LzQlZmtAbjs4d5',
    },
    sharedAt: new Date('2024-12-20T08:30:00'),
    permission: 'editor',
  },
  {
    id: '4',
    name: 'Manual de Procedimentos.docx',
    type: 'file',
    size: 819200,
    updatedAt: new Date('2024-12-15T16:00:00'),
    sharedBy: {
      id: 'user1',
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNNoFiASzVGCjdBr4HN3RJJIHvE3zOl9TgEn2xmcxcXyr15ninQDk7DRZpJqATi1XYLnlDM_8JySEKbwi3OOPoJ9pmtaQKzYMQ-9A67EZ0HAD4xyX2Ul2qPSiZ6qmXX2GxMedOlO42sncEdNOH2tqLJsJ1Su6xlYI3-l1WmperctmgBV0jhY23VKwN97a6kcc1LJd6JR65xW4LzDwhbCO2lCAkEt--cP9PTBI8-uZ5eJpjENPDOIrzhJ38vufGzhfISqc2OPCHwrS4',
    },
    sharedAt: new Date('2024-12-10T14:20:00'),
    permission: 'viewer',
  },
  {
    id: '5',
    name: 'Projeto Marketing 2025',
    type: 'folder',
    itemCount: 12,
    updatedAt: new Date('2024-12-28T10:45:00'),
    sharedBy: {
      id: 'user4',
      name: 'Carlos Mendes',
      email: 'carlos.m@empresa.com',
    },
    sharedAt: new Date('2024-12-25T09:00:00'),
    permission: 'editor',
  },
  {
    id: '6',
    name: 'Fotos Evento Corporativo.zip',
    type: 'file',
    size: 52428800,
    updatedAt: new Date('2024-12-20T18:30:00'),
    sharedBy: {
      id: 'user2',
      name: 'João Santos',
      email: 'joao.santos@empresa.com',
    },
    sharedAt: new Date('2024-12-20T18:35:00'),
    permission: 'viewer',
  },
];

// Permission filter options
const permissionOptions: DropdownOption[] = [
  { value: 'all', label: 'Todas as permissões' },
  { value: 'viewer', label: 'Somente leitura' },
  { value: 'editor', label: 'Edição' },
];

// Get permission badge variant
const getPermissionBadge = (permission: PermissionLevel) => {
  switch (permission) {
    case 'owner':
      return { variant: 'info' as const, label: 'Proprietário' };
    case 'editor':
      return { variant: 'success' as const, label: 'Edição' };
    case 'viewer':
      return { variant: 'default' as const, label: 'Leitura' };
  }
};

// Format relative date
const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function Compartilhados() {
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionFilter, setPermissionFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter documents based on search and permission
  const filteredDocuments = useMemo(() => {
    return mockSharedDocuments.filter((doc) => {
      // Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.sharedBy.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Permission filter
      const matchesPermission =
        permissionFilter === 'all' || doc.permission === permissionFilter;

      return matchesSearch && matchesPermission;
    });
  }, [searchQuery, permissionFilter]);

  // Handle document selection
  const handleSelect = (id: string, multiSelect?: boolean) => {
    setSelectedIds((prev) => {
      if (multiSelect) {
        return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      }
      return prev.includes(id) && prev.length === 1 ? [] : [id];
    });
  };

  // Handle document open
  const handleOpen = (item: DocumentGridItem) => {
    console.log('Opening document:', item.id);
    // TODO: Navigate to document viewer or folder
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedIds([]);
  };

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="flex flex-col h-full" data-testid="compartilhados-page">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-primary">
            <span className="material-symbols-outlined text-2xl">folder_shared</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Compartilhados Comigo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Documentos e pastas que outras pessoas compartilharam com você
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200 dark:border-gray-800">
        {/* Left side: Search and filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="w-64">
            <Input
              type="search"
              placeholder="Buscar por nome ou proprietário..."
              value={searchQuery}
              onChange={setSearchQuery}
              icon={<span className="material-symbols-outlined text-[20px]">search</span>}
            />
          </div>

          {/* Permission filter */}
          <Dropdown
            options={permissionOptions}
            value={permissionFilter}
            onChange={setPermissionFilter}
            size="md"
            aria-label="Filtrar por permissão"
          />

          {/* Results count */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* Right side: Batch actions */}
        <div className="flex items-center gap-2">
          {hasSelection && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log('Download:', selectedIds)}
              >
                <span className="material-symbols-outlined text-[20px] mr-1">download</span>
                <span className="hidden sm:inline">Baixar</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log('Copy to My Files:', selectedIds)}
              >
                <span className="material-symbols-outlined text-[20px] mr-1">content_copy</span>
                <span className="hidden sm:inline">Copiar para Meus Arquivos</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Limpar ({selectedIds.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background-dark">
        {filteredDocuments.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <span className="material-symbols-outlined text-4xl text-gray-400">
                folder_off
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              {searchQuery || permissionFilter !== 'all'
                ? 'Tente ajustar os filtros de busca para encontrar o que procura.'
                : 'Quando alguém compartilhar um documento com você, ele aparecerá aqui.'}
            </p>
          </div>
        ) : (
          /* Document list with sharing info */
          <div className="p-6">
            {/* Shared documents list */}
            <div className="bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              {filteredDocuments.map((doc, index) => {
                const permissionBadge = getPermissionBadge(doc.permission);
                const isSelected = selectedIds.includes(doc.id);

                return (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                      index !== 0 ? 'border-t border-gray-200 dark:border-gray-800' : ''
                    } ${isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    onClick={() => handleSelect(doc.id)}
                    onDoubleClick={() => handleOpen(doc)}
                    data-testid={`shared-doc-${doc.id}`}
                  >
                    {/* Left: Checkbox and document info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelect(doc.id, true);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />

                      {/* File icon */}
                      <div className="flex-shrink-0">
                        {doc.type === 'folder' ? (
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">folder</span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-500">
                              description
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Document details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white truncate">
                            {doc.name}
                          </span>
                          <Badge variant={permissionBadge.variant} size="sm">
                            {permissionBadge.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span>Modificado {formatRelativeDate(doc.updatedAt)}</span>
                          {doc.type === 'folder' && doc.itemCount !== undefined && (
                            <>
                              <span className="size-1 bg-gray-300 rounded-full" />
                              <span>{doc.itemCount} itens</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Shared by info */}
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {doc.sharedBy.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Compartilhado {formatRelativeDate(doc.sharedAt)}
                        </p>
                      </div>
                      {/* Avatar */}
                      {doc.sharedBy.avatar ? (
                        <div
                          className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-surface-dark shadow-sm flex-shrink-0"
                          style={{ backgroundImage: `url("${doc.sharedBy.avatar}")` }}
                          title={doc.sharedBy.name}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-medium text-sm flex-shrink-0"
                          title={doc.sharedBy.name}
                        >
                          {getInitials(doc.sharedBy.name)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
