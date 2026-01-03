import { useState, useMemo } from 'react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

// Types for deleted documents
interface DeletedDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'jpg' | 'png' | 'zip' | 'folder' | 'unknown';
  path: string;
  size: string;
  deletedAt: string;
  deletedBy: {
    name: string;
    avatar?: string;
  };
}

// File type icon mapping
const fileTypeConfig: Record<string, { icon: string; bgColor: string; textColor: string }> = {
  pdf: { icon: 'picture_as_pdf', bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-600 dark:text-red-400' },
  docx: { icon: 'description', bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-600 dark:text-blue-400' },
  xlsx: { icon: 'table_view', bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-600 dark:text-green-400' },
  pptx: { icon: 'slideshow', bgColor: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-600 dark:text-orange-400' },
  jpg: { icon: 'image', bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-600 dark:text-purple-400' },
  png: { icon: 'image', bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-600 dark:text-purple-400' },
  zip: { icon: 'folder_zip', bgColor: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-600 dark:text-amber-400' },
  folder: { icon: 'folder', bgColor: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-600 dark:text-amber-400' },
  unknown: { icon: 'draft', bgColor: 'bg-gray-100 dark:bg-gray-900/30', textColor: 'text-gray-600 dark:text-gray-400' },
};

// Mock data for deleted documents
const mockDeletedDocuments: DeletedDocument[] = [
  {
    id: '1',
    name: 'Relatório_Financeiro_2023.pdf',
    type: 'pdf',
    path: '/Finanças/Anuais',
    size: '2.4 MB',
    deletedAt: '22 Out 2023',
    deletedBy: { name: 'Ana Silva' },
  },
  {
    id: '2',
    name: 'Contrato_Prestação_Serviços.docx',
    type: 'docx',
    path: '/Jurídico/Contratos',
    size: '1.1 MB',
    deletedAt: '21 Out 2023',
    deletedBy: { name: 'Roberto Dias' },
  },
  {
    id: '3',
    name: 'Apresentação_Q3.pptx',
    type: 'pptx',
    path: '/Marketing/Apresentações',
    size: '5.8 MB',
    deletedAt: '20 Out 2023',
    deletedBy: { name: 'Ana Silva' },
  },
  {
    id: '4',
    name: 'Design_System_v2.fig',
    type: 'unknown',
    path: '/Design/Ativos',
    size: '12 MB',
    deletedAt: '19 Out 2023',
    deletedBy: { name: 'Carla M.' },
  },
  {
    id: '5',
    name: 'Planilha_Custos.xlsx',
    type: 'xlsx',
    path: '/Finanças/Custos',
    size: '850 KB',
    deletedAt: '15 Out 2023',
    deletedBy: { name: 'Marcos J.' },
  },
];

export default function Lixeira() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DeletedDocument[]>(mockDeletedDocuments);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'restore' | 'empty' | null;
    documentId?: string;
  }>({ isOpen: false, type: null });

  const pageSize = 10;
  const totalDocuments = 42; // Mock total

  // Filter documents based on search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.path.toLowerCase().includes(query) ||
        doc.deletedBy.name.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredDocuments.map((d) => d.id) : []);
  };

  const handleSelectDocument = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  const allSelected = filteredDocuments.length > 0 && selectedIds.length === filteredDocuments.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < filteredDocuments.length;

  // Action handlers
  const handleRestore = (documentId: string) => {
    setConfirmModal({ isOpen: true, type: 'restore', documentId });
  };

  const handlePermanentDelete = (documentId: string) => {
    setConfirmModal({ isOpen: true, type: 'delete', documentId });
  };

  const handleEmptyTrash = () => {
    setConfirmModal({ isOpen: true, type: 'empty' });
  };

  const handleBulkRestore = () => {
    // Restore selected documents
    setDocuments((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setConfirmModal({ isOpen: true, type: 'delete' });
  };

  const confirmAction = () => {
    if (confirmModal.type === 'restore' && confirmModal.documentId) {
      setDocuments((prev) => prev.filter((d) => d.id !== confirmModal.documentId));
    } else if (confirmModal.type === 'delete') {
      if (confirmModal.documentId) {
        setDocuments((prev) => prev.filter((d) => d.id !== confirmModal.documentId));
      } else {
        // Bulk delete
        setDocuments((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
        setSelectedIds([]);
      }
    } else if (confirmModal.type === 'empty') {
      setDocuments([]);
      setSelectedIds([]);
    }
    setConfirmModal({ isOpen: false, type: null });
  };

  const getFileTypeConfig = (type: string) => {
    return fileTypeConfig[type] || fileTypeConfig.unknown;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex flex-col gap-6 shrink-0">
        {/* Title & Actions */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#111318] dark:text-white text-3xl font-black tracking-tight">
              Lixeira
            </h2>
            {/* Retention Policy Notice - Requirement 8.5 */}
            <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">info</span>
              Arquivos excluídos são removidos permanentemente após 30 dias.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={handleEmptyTrash}
            icon={<span className="material-symbols-outlined text-lg">delete_forever</span>}
            className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-transparent hover:border-red-200 dark:hover:border-red-800 shadow-none"
          >
            Esvaziar Lixeira
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="relative w-full max-w-md">
            <Input
              type="search"
              placeholder="Buscar documentos excluídos..."
              value={searchQuery}
              onChange={setSearchQuery}
              icon={<span className="material-symbols-outlined">search</span>}
              iconPosition="left"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-surface-dark text-[#111318] dark:text-gray-200 text-sm font-medium whitespace-nowrap transition-colors">
              Data de Exclusão
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-surface-dark text-[#111318] dark:text-gray-200 text-sm font-medium whitespace-nowrap transition-colors">
              Tipo de Arquivo
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-surface-dark text-[#111318] dark:text-gray-200 text-sm font-medium whitespace-nowrap transition-colors">
              Excluído Por
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-background-dark">
        {/* Table Container */}
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full max-h-[calc(100vh-280px)]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 w-12 border-b border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary/25 size-4"
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    Nome do Documento
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    Data de Exclusão
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    Excluído Por
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    Tamanho
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-gray-400 text-right border-b border-gray-200 dark:border-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-surface-dark">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">
                          delete_outline
                        </span>
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchQuery ? 'Nenhum documento encontrado' : 'A lixeira está vazia'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => {
                    const typeConfig = getFileTypeConfig(doc.type);
                    const isSelected = selectedIds.includes(doc.id);

                    return (
                      <tr
                        key={doc.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-colors ${
                          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectDocument(doc.id, e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary/25 size-4"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex-shrink-0 size-10 rounded-lg ${typeConfig.bgColor} ${typeConfig.textColor} flex items-center justify-center`}
                            >
                              <span className="material-symbols-outlined">{typeConfig.icon}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#111318] dark:text-gray-100">
                                {doc.name}
                              </p>
                              <p className="text-xs text-[#616f89] dark:text-gray-500">{doc.path}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#616f89] dark:text-gray-400 tabular-nums">
                          {doc.deletedAt}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="material-symbols-outlined text-sm text-gray-500">
                                person
                              </span>
                            </div>
                            <span className="text-sm font-medium text-[#111318] dark:text-gray-300">
                              {doc.deletedBy.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#616f89] dark:text-gray-400 tabular-nums">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleRestore(doc.id)}
                              className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
                              title="Restaurar"
                            >
                              <span className="material-symbols-outlined text-xl">
                                restore_from_trash
                              </span>
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(doc.id)}
                              className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-[#616f89] hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                              title="Excluir Permanentemente"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredDocuments.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark">
              <p className="text-sm text-[#616f89] dark:text-gray-400">
                Exibindo{' '}
                <span className="font-medium text-[#111318] dark:text-white">
                  {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, totalDocuments)}
                </span>{' '}
                de{' '}
                <span className="font-medium text-[#111318] dark:text-white">{totalDocuments}</span>{' '}
                documentos excluídos
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-[#616f89] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage * pageSize >= totalDocuments}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-[#616f89] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111318] dark:bg-white text-white dark:text-[#111318] px-6 py-3 rounded-full shadow-lg flex items-center gap-6 z-50">
          <div className="flex items-center gap-3 border-r border-gray-600 dark:border-gray-300 pr-6">
            <span className="bg-primary size-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {selectedIds.length}
            </span>
            <span className="text-sm font-medium">
              {selectedIds.length === 1 ? 'Item Selecionado' : 'Itens Selecionados'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleBulkRestore}
              className="text-sm font-bold hover:text-primary transition-colors"
            >
              Restaurar
            </button>
            <button
              onClick={handleBulkDelete}
              className="text-sm font-bold text-red-400 dark:text-red-600 hover:text-red-300 dark:hover:text-red-700 transition-colors"
            >
              Excluir para sempre
            </button>
          </div>
          <button
            onClick={() => setSelectedIds([])}
            className="ml-2 hover:bg-white/10 dark:hover:bg-black/10 rounded-full p-1"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        title={
          confirmModal.type === 'restore'
            ? 'Restaurar Documento'
            : confirmModal.type === 'empty'
            ? 'Esvaziar Lixeira'
            : 'Excluir Permanentemente'
        }
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setConfirmModal({ isOpen: false, type: null })}
            >
              Cancelar
            </Button>
            <Button
              variant={confirmModal.type === 'restore' ? 'primary' : 'danger'}
              onClick={confirmAction}
            >
              {confirmModal.type === 'restore' ? 'Restaurar' : 'Excluir'}
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          {confirmModal.type === 'restore' && 'Deseja restaurar este documento para sua localização original?'}
          {confirmModal.type === 'delete' &&
            (confirmModal.documentId
              ? 'Esta ação não pode ser desfeita. O documento será excluído permanentemente.'
              : `Esta ação não pode ser desfeita. ${selectedIds.length} documento(s) serão excluídos permanentemente.`)}
          {confirmModal.type === 'empty' &&
            'Esta ação não pode ser desfeita. Todos os documentos na lixeira serão excluídos permanentemente.'}
        </p>
      </Modal>
    </div>
  );
}
