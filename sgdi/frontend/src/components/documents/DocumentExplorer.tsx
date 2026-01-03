import React, { useState, useCallback, useMemo } from 'react';
import FolderTree, { FolderNode } from './FolderTree';
import DocumentGrid, { DocumentGridItem } from './DocumentGrid';
import DocumentList from './DocumentList';
import Breadcrumb from '../common/Breadcrumb';
import Button from '../common/Button';
import Input from '../common/Input';

export type ViewMode = 'grid' | 'list';

export interface DocumentExplorerProps {
  folders: FolderNode[];
  items: DocumentGridItem[];
  currentFolderId?: string;
  currentPath: { id: string; name: string }[];
  viewMode: ViewMode;
  loading?: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect: (documentId: string) => void;
  onNavigate: (folderId: string) => void;
  onUpload?: () => void;
  onAddTag?: (ids: string[]) => void;
  onRename?: (id: string) => void;
  onMove?: (ids: string[]) => void;
  onDelete?: (ids: string[]) => void;
  className?: string;
}

export const DocumentExplorer: React.FC<DocumentExplorerProps> = ({
  folders,
  items,
  currentFolderId,
  currentPath,
  viewMode,
  loading = false,
  onViewModeChange,
  onFolderSelect,
  onDocumentSelect,
  onNavigate,
  onUpload,
  onAddTag,
  onRename,
  onMove,
  onDelete,
  className = '',
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => 
      item.name.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  // Count folders and files
  const folderCount = filteredItems.filter((item) => item.type === 'folder').length;
  const fileCount = filteredItems.filter((item) => item.type === 'file').length;

  // Handle item selection
  const handleSelect = useCallback((id: string, multiSelect?: boolean) => {
    setSelectedIds((prev) => {
      if (multiSelect) {
        return prev.includes(id) 
          ? prev.filter((i) => i !== id)
          : [...prev, id];
      }
      return prev.includes(id) && prev.length === 1 ? [] : [id];
    });
  }, []);

  // Handle selection change from list view
  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  // Handle item open (double-click)
  const handleOpen = useCallback((item: DocumentGridItem) => {
    if (item.type === 'folder') {
      onNavigate(item.id);
      setSelectedIds([]);
    } else {
      onDocumentSelect(item.id);
    }
  }, [onNavigate, onDocumentSelect]);

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = useCallback((index: number) => {
    if (index < currentPath.length - 1) {
      onNavigate(currentPath[index].id);
      setSelectedIds([]);
    }
  }, [currentPath, onNavigate]);

  // Batch actions enabled state
  const hasSelection = selectedIds.length > 0;

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return (
    <div className={`flex h-full ${className}`} data-testid="document-explorer">
      {/* Sidebar with folder tree */}
      <aside className="w-64 bg-white dark:bg-[#111318] border-r border-gray-200 dark:border-gray-800 flex-shrink-0 hidden md:flex flex-col overflow-hidden">
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Navigation section */}
          <div className="mb-6">
            <p className="text-gray-500 dark:text-gray-500 text-xs font-bold uppercase tracking-wider px-3 mb-2">
              Navegação
            </p>
            <nav className="flex flex-col gap-1">
              <a 
                href="#" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
                onClick={(e) => { e.preventDefault(); onNavigate('root'); }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                <span className="text-sm font-medium">Meus Arquivos</span>
              </a>
            </nav>
          </div>

          {/* Folder tree */}
          <div className="mb-6">
            <p className="text-gray-500 dark:text-gray-500 text-xs font-bold uppercase tracking-wider px-3 mb-2">
              Pastas
            </p>
            <FolderTree
              folders={folders}
              selectedFolderId={currentFolderId}
              onSelect={onFolderSelect}
            />
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#111318]">
        {/* Header with breadcrumb and title */}
        <div className="px-6 pt-6 pb-2">
          <Breadcrumb
            items={currentPath.map((p, index) => ({
              id: p.id,
              label: p.name,
              onClick: () => handleBreadcrumbClick(index),
            }))}
          />
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-gray-900 dark:text-white tracking-tight text-2xl font-bold">
              {currentPath.length > 0 ? currentPath[currentPath.length - 1].name : 'Documentos'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{folderCount} pastas</span>
              <span className="size-1 bg-gray-300 rounded-full" />
              <span>{fileCount} arquivos</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200 dark:border-gray-800">
          {/* Left side: Search and batch actions */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Search */}
            <div className="w-64">
              <Input
                type="search"
                placeholder="Buscar arquivos..."
                value={searchQuery}
                onChange={setSearchQuery}
                icon="search"
              />
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Batch actions */}
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasSelection}
              onClick={() => onAddTag?.(selectedIds)}
              data-testid="btn-add-tag"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="hidden sm:inline">Adicionar Tag</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={selectedIds.length !== 1}
              onClick={() => selectedIds[0] && onRename?.(selectedIds[0])}
              data-testid="btn-rename"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden sm:inline">Renomear</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={!hasSelection}
              onClick={() => onMove?.(selectedIds)}
              data-testid="btn-move"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="hidden sm:inline">Mover</span>
            </Button>

            <Button
              variant="danger"
              size="sm"
              disabled={!hasSelection}
              onClick={() => onDelete?.(selectedIds)}
              data-testid="btn-delete"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Excluir</span>
            </Button>

            {hasSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
              >
                Limpar ({selectedIds.length})
              </Button>
            )}
          </div>

          {/* Right side: View toggle and upload */}
          <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <div 
              className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
              role="group"
              aria-label="Modo de visualização"
            >
              <button
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => onViewModeChange('grid')}
                aria-pressed={viewMode === 'grid'}
                data-testid="btn-view-grid"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => onViewModeChange('list')}
                aria-pressed={viewMode === 'list'}
                data-testid="btn-view-list"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Upload button */}
            <Button
              variant="primary"
              onClick={onUpload}
              data-testid="btn-upload"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload
            </Button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-background-dark">
          {viewMode === 'grid' ? (
            <DocumentGrid
              items={filteredItems}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onOpen={handleOpen}
              loading={loading}
            />
          ) : (
            <DocumentList
              items={filteredItems}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectionChange={handleSelectionChange}
              onOpen={handleOpen}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentExplorer;
