import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Badge } from '../common/Badge';
import { Breadcrumb, BreadcrumbItem } from '../common/Breadcrumb';
import { Button } from '../common/Button';

// Types
export type AnnotationTool = 'select' | 'pan' | 'highlight' | 'comment' | 'draw';
export type SidebarTab = 'annotations' | 'thumbnails' | 'info';
export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface Annotation {
  id: string;
  type: 'highlight' | 'comment' | 'drawing';
  page: number;
  position: { x: number; y: number; width?: number; height?: number };
  content?: string;
  color: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  replies?: AnnotationReply[];
}

export interface AnnotationReply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  owner: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  version: number;
  totalPages: number;
}

export interface DocumentViewerProps {
  document: DocumentInfo;
  documentUrl?: string;
  breadcrumbPath?: BreadcrumbItem[];
  annotations?: Annotation[];
  initialPage?: number;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  onSave?: () => Promise<void>;
  onShare?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onAnnotationAdd?: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  onAnnotationUpdate?: (id: string, updates: Partial<Annotation>) => void;
  onAnnotationDelete?: (id: string) => void;
  onPageChange?: (page: number) => void;
  onZoomChange?: (zoom: number) => void;
  autoSaveInterval?: number;
  className?: string;
}

// Constants
const MIN_ZOOM = 25;
const MAX_ZOOM = 400;
const ZOOM_STEP = 25;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getStatusBadgeVariant = (status: DocumentInfo['status']): 'success' | 'warning' | 'error' | 'info' => {
  const variants: Record<DocumentInfo['status'], 'success' | 'warning' | 'error' | 'info'> = {
    approved: 'success',
    review: 'warning',
    rejected: 'error',
    draft: 'info',
  };
  return variants[status];
};

const getStatusLabel = (status: DocumentInfo['status']): string => {
  const labels: Record<DocumentInfo['status'], string> = {
    approved: 'Aprovado',
    review: 'Em Revisão',
    rejected: 'Rejeitado',
    draft: 'Rascunho',
  };
  return labels[status];
};

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  documentUrl,
  breadcrumbPath = [],
  annotations = [],
  initialPage = 1,
  initialZoom = 100,
  minZoom = MIN_ZOOM,
  maxZoom = MAX_ZOOM,
  zoomStep = ZOOM_STEP,
  onSave,
  onShare,
  onDownload,
  onPrint,
  onAnnotationAdd,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnnotationUpdate: _onAnnotationUpdate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnnotationDelete: _onAnnotationDelete,
  onPageChange,
  onZoomChange,
  autoSaveInterval = AUTO_SAVE_INTERVAL,
  className = '',
}) => {
  // State
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(initialZoom);
  const [activeTool, setActiveTool] = useState<AnnotationTool>('select');
  const [activeTab, setActiveTab] = useState<SidebarTab>('annotations');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pageInput, setPageInput] = useState(String(initialPage));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Refs
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => {
      const newZoom = Math.min(prev + zoomStep, maxZoom);
      onZoomChange?.(newZoom);
      return newZoom;
    });
  }, [zoomStep, maxZoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - zoomStep, minZoom);
      onZoomChange?.(newZoom);
      return newZoom;
    });
  }, [zoomStep, minZoom, onZoomChange]);

  // Page navigation handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      setPageInput(String(newPage));
      onPageChange?.(newPage);
      return newPage;
    });
  }, [onPageChange]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, document.totalPages);
      setPageInput(String(newPage));
      onPageChange?.(newPage);
      return newPage;
    });
  }, [document.totalPages, onPageChange]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  }, []);

  const handlePageInputBlur = useCallback(() => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= document.totalPages) {
      setCurrentPage(pageNum);
      onPageChange?.(pageNum);
    } else {
      setPageInput(String(currentPage));
    }
  }, [pageInput, document.totalPages, currentPage, onPageChange]);

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  }, [handlePageInputBlur]);

  // Save handler
  const handleSave = useCallback(async () => {
    if (!onSave) return;
    
    setSaveStatus('saving');
    try {
      await onSave();
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
    } catch {
      setSaveStatus('error');
    }
  }, [onSave]);

  // Auto-save effect
  useEffect(() => {
    if (hasUnsavedChanges && autoSaveInterval > 0 && onSave) {
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasUnsavedChanges, autoSaveInterval, onSave, handleSave]);

  // Mark as unsaved when annotations change
  const markAsUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
  }, []);

  // Tool selection handler
  const handleToolSelect = useCallback((tool: AnnotationTool) => {
    setActiveTool(tool);
  }, []);

  // Tab selection handler
  const handleTabSelect = useCallback((tab: SidebarTab) => {
    setActiveTab(tab);
  }, []);

  // Render save status indicator
  const renderSaveStatus = () => {
    const statusConfig: Record<SaveStatus, { icon: string; text: string; className: string }> = {
      saved: { icon: 'cloud_done', text: 'Salvo', className: 'text-green-600 dark:text-green-400' },
      saving: { icon: 'sync', text: 'Salvando...', className: 'text-blue-600 dark:text-blue-400 animate-spin' },
      unsaved: { icon: 'cloud_off', text: 'Não salvo', className: 'text-amber-600 dark:text-amber-400' },
      error: { icon: 'error', text: 'Erro ao salvar', className: 'text-red-600 dark:text-red-400' },
    };

    const config = statusConfig[saveStatus];

    return (
      <span className={`text-xs flex items-center gap-1 ${config.className}`} data-testid="save-status">
        <span className={`material-symbols-outlined text-[14px] ${saveStatus === 'saving' ? 'animate-spin' : ''}`}>
          {config.icon}
        </span>
        {config.text}
      </span>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-background-light dark:bg-background-dark ${className}`} data-testid="document-viewer">
      {/* Header */}
      <header className="flex-none bg-white dark:bg-[#1a202c] border-b border-[#f0f2f4] dark:border-[#2d3748] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {/* Breadcrumb */}
            {breadcrumbPath.length > 0 && (
              <Breadcrumb items={breadcrumbPath} className="text-xs" />
            )}
            {/* Document title and status */}
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#111318] dark:text-white">{document.name}</h1>
              <Badge variant={getStatusBadgeVariant(document.status)} size="sm">
                {getStatusLabel(document.status)}
              </Badge>
              {renderSaveStatus()}
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-3">
            {onShare && (
              <Button variant="secondary" size="sm" onClick={onShare} icon={<span className="material-symbols-outlined text-[18px]">share</span>}>
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
            )}
            {onSave && (
              <Button variant="primary" size="sm" onClick={handleSave} loading={saveStatus === 'saving'} icon={<span className="material-symbols-outlined text-[18px]">save</span>}>
                <span className="hidden sm:inline">Salvar</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DocumentViewerSidebar
          activeTab={activeTab}
          onTabChange={handleTabSelect}
          annotations={annotations}
          document={document}
          currentPage={currentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onAnnotationClick={(annotation) => {
            setCurrentPage(annotation.page);
            setPageInput(String(annotation.page));
            onPageChange?.(annotation.page);
          }}
          onAddAnnotation={() => {
            setActiveTool('comment');
          }}
        />

        {/* Document canvas area */}
        <div className="flex-1 flex flex-col bg-[#f3f4f6] dark:bg-[#0f1115] relative">
          {/* Floating Toolbar */}
          <DocumentViewerToolbar
            zoom={zoom}
            currentPage={currentPage}
            totalPages={document.totalPages}
            pageInput={pageInput}
            activeTool={activeTool}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPageInputChange={handlePageInputChange}
            onPageInputBlur={handlePageInputBlur}
            onPageInputKeyDown={handlePageInputKeyDown}
            onToolSelect={handleToolSelect}
            onDownload={onDownload}
            onPrint={onPrint}
          />

          {/* Document Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 overflow-auto px-4 pb-20 flex justify-center"
            data-testid="document-canvas"
          >
            <div
              className="flex flex-col gap-6 items-center pt-2"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              {/* Render pages */}
              {Array.from({ length: document.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <DocumentPage
                  key={pageNum}
                  pageNumber={pageNum}
                  documentUrl={documentUrl}
                  annotations={annotations.filter((a) => a.page === pageNum)}
                  isCurrentPage={pageNum === currentPage}
                  activeTool={activeTool}
                  onAnnotationAdd={(annotation) => {
                    onAnnotationAdd?.(annotation);
                    markAsUnsaved();
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


// Sub-components

interface DocumentViewerToolbarProps {
  zoom: number;
  currentPage: number;
  totalPages: number;
  pageInput: string;
  activeTool: AnnotationTool;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageInputBlur: () => void;
  onPageInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onToolSelect: (tool: AnnotationTool) => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

const DocumentViewerToolbar: React.FC<DocumentViewerToolbarProps> = ({
  zoom,
  currentPage,
  totalPages,
  pageInput,
  activeTool,
  onZoomIn,
  onZoomOut,
  onPreviousPage,
  onNextPage,
  onPageInputChange,
  onPageInputBlur,
  onPageInputKeyDown,
  onToolSelect,
  onDownload,
  onPrint,
}) => {
  const toolButtonClass = (tool: AnnotationTool) =>
    `p-2 rounded transition-colors ${
      activeTool === tool
        ? 'bg-primary/10 text-primary'
        : 'text-[#4b5563] dark:text-gray-300 hover:bg-[#f3f4f6] dark:hover:bg-[#4a5568] hover:text-primary'
    }`;

  return (
    <div className="sticky top-0 z-10 flex justify-center py-4 pointer-events-none" data-testid="document-toolbar">
      <div className="pointer-events-auto flex items-center gap-1 bg-white dark:bg-[#2d3748] rounded-lg shadow-lg border border-[#e2e8f0] dark:border-[#4a5568] p-1.5">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#e2e8f0] dark:border-[#4a5568]">
          <button
            className="p-2 text-[#4b5563] dark:text-gray-300 hover:bg-[#f3f4f6] dark:hover:bg-[#4a5568] rounded hover:text-primary transition-colors"
            title="Diminuir Zoom"
            onClick={onZoomOut}
            data-testid="zoom-out-btn"
          >
            <span className="material-symbols-outlined text-[20px]">remove_circle</span>
          </button>
          <span className="text-xs font-medium w-12 text-center text-[#111318] dark:text-white" data-testid="zoom-level">
            {zoom}%
          </span>
          <button
            className="p-2 text-[#4b5563] dark:text-gray-300 hover:bg-[#f3f4f6] dark:hover:bg-[#4a5568] rounded hover:text-primary transition-colors"
            title="Aumentar Zoom"
            onClick={onZoomIn}
            data-testid="zoom-in-btn"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
          </button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1 px-2 border-r border-[#e2e8f0] dark:border-[#4a5568]">
          <button
            className="p-2 text-[#4b5563] dark:text-gray-300 hover:bg-[#f3f4f6] dark:hover:bg-[#4a5568] rounded hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Página Anterior"
            onClick={onPreviousPage}
            disabled={currentPage <= 1}
            data-testid="prev-page-btn"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
          </button>
          <div className="flex items-center gap-1 text-xs">
            <input
              type="text"
              value={pageInput}
              onChange={onPageInputChange}
              onBlur={onPageInputBlur}
              onKeyDown={onPageInputKeyDown}
              className="w-8 h-7 text-center rounded border border-[#e2e8f0] dark:border-[#4a5568] bg-transparent text-[#111318] dark:text-white focus:ring-1 focus:ring-primary focus:border-primary"
              data-testid="page-input"
            />
            <span className="text-[#94a3b8]">/ {totalPages}</span>
          </div>
          <button
            className="p-2 text-[#4b5563] dark:text-gray-300 hover:bg-[#f3f4f6] dark:hover:bg-[#4a5568] rounded hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Próxima Página"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            data-testid="next-page-btn"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
          </button>
        </div>

        {/* Selection Tools */}
        <div className="flex items-center gap-1 px-2 border-r border-[#e2e8f0] dark:border-[#4a5568]">
          <button
            className={toolButtonClass('select')}
            title="Ferramenta de Seleção"
            onClick={() => onToolSelect('select')}
            data-testid="tool-select"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_selector_tool</span>
          </button>
          <button
            className={toolButtonClass('pan')}
            title="Ferramenta de Mão"
            onClick={() => onToolSelect('pan')}
            data-testid="tool-pan"
          >
            <span className="material-symbols-outlined text-[20px]">pan_tool</span>
          </button>
        </div>

        {/* Annotation Tools */}
        <div className="flex items-center gap-1 px-2 border-r border-[#e2e8f0] dark:border-[#4a5568]">
          <button
            className={toolButtonClass('highlight')}
            title="Destacar"
            onClick={() => onToolSelect('highlight')}
            data-testid="tool-highlight"
          >
            <span className="material-symbols-outlined text-[20px]">ink_highlighter</span>
          </button>
          <button
            className={toolButtonClass('comment')}
            title="Adicionar Comentário"
            onClick={() => onToolSelect('comment')}
            data-testid="tool-comment"
          >
            <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
          </button>
          <button
            className={toolButtonClass('draw')}
            title="Desenhar"
            onClick={() => onToolSelect('draw')}
            data-testid="tool-draw"
          >
            <span className="material-symbols-outlined text-[20px]">draw</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-2">
          {onDownload && (
            <button
              className="p-2 text-[#4b5563] dark:text-gray-300 hover:bg-[#f3f4f6] dark:hover:bg-[#4a5568] rounded hover:text-primary transition-colors"
              title="Download"
              onClick={onDownload}
              data-testid="download-btn"
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
            </button>
          )}
          {onPrint && (
            <button
              className="p-2 text-[#4b5563] dark:text-gray-300 hover:bg-[#f3f4f6] dark:hover:bg-[#4a5568] rounded hover:text-primary transition-colors"
              title="Imprimir"
              onClick={onPrint}
              data-testid="print-btn"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// Sidebar Component
interface DocumentViewerSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  annotations: Annotation[];
  document: DocumentInfo;
  currentPage: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onAnnotationClick: (annotation: Annotation) => void;
  onAddAnnotation: () => void;
}

const DocumentViewerSidebar: React.FC<DocumentViewerSidebarProps> = ({
  activeTab,
  onTabChange,
  annotations,
  document,
  currentPage,
  collapsed,
  onToggleCollapse,
  onAnnotationClick,
  onAddAnnotation,
}) => {
  if (collapsed) {
    return (
      <aside className="w-12 bg-white dark:bg-[#1a202c] border-r border-[#f0f2f4] dark:border-[#2d3748] flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-[#616f89] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-[#2d3748] rounded-lg transition-colors"
          title="Expandir sidebar"
          data-testid="sidebar-expand-btn"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </aside>
    );
  }

  const tabButtonClass = (tab: SidebarTab) =>
    `flex-1 py-3 text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'text-primary border-b-2 border-primary bg-primary/5 dark:bg-primary/10'
        : 'text-[#616f89] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-[#2d3748]'
    }`;

  return (
    <aside
      className="w-72 bg-white dark:bg-[#1a202c] border-r border-[#f0f2f4] dark:border-[#2d3748] flex flex-col hidden md:flex"
      data-testid="document-sidebar"
    >
      {/* Collapse button */}
      <div className="flex justify-end p-2 border-b border-[#f0f2f4] dark:border-[#2d3748]">
        <button
          onClick={onToggleCollapse}
          className="p-1 text-[#616f89] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-[#2d3748] rounded transition-colors"
          title="Recolher sidebar"
          data-testid="sidebar-collapse-btn"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#f0f2f4] dark:border-[#2d3748]" data-testid="sidebar-tabs">
        <button
          className={tabButtonClass('annotations')}
          onClick={() => onTabChange('annotations')}
          data-testid="tab-annotations"
        >
          Anotações
        </button>
        <button
          className={tabButtonClass('thumbnails')}
          onClick={() => onTabChange('thumbnails')}
          data-testid="tab-thumbnails"
        >
          Miniaturas
        </button>
        <button
          className={tabButtonClass('info')}
          onClick={() => onTabChange('info')}
          data-testid="tab-info"
        >
          Info
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {activeTab === 'annotations' && (
          <AnnotationsTabContent
            annotations={annotations}
            onAnnotationClick={onAnnotationClick}
          />
        )}
        {activeTab === 'thumbnails' && (
          <ThumbnailsTabContent
            totalPages={document.totalPages}
            currentPage={currentPage}
            onPageClick={(page) => onAnnotationClick({ page } as Annotation)}
          />
        )}
        {activeTab === 'info' && (
          <InfoTabContent document={document} />
        )}
      </div>

      {/* Footer */}
      {activeTab === 'annotations' && (
        <div className="p-4 border-t border-[#f0f2f4] dark:border-[#2d3748]">
          <button
            onClick={onAddAnnotation}
            className="flex w-full items-center justify-center gap-2 rounded-lg h-10 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
            data-testid="add-annotation-btn"
          >
            <span className="material-symbols-outlined text-[18px]">add_comment</span>
            Adicionar Nota
          </button>
        </div>
      )}
    </aside>
  );
};

// Annotations Tab Content
interface AnnotationsTabContentProps {
  annotations: Annotation[];
  onAnnotationClick: (annotation: Annotation) => void;
}

const AnnotationsTabContent: React.FC<AnnotationsTabContentProps> = ({
  annotations,
  onAnnotationClick,
}) => {
  if (annotations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="material-symbols-outlined text-4xl text-[#cbd5e1] dark:text-gray-600 mb-2">
          comment
        </span>
        <p className="text-sm text-[#616f89] dark:text-gray-400">
          Nenhuma anotação ainda
        </p>
        <p className="text-xs text-[#94a3b8] dark:text-gray-500 mt-1">
          Use as ferramentas de anotação para adicionar comentários
        </p>
      </div>
    );
  }

  const getAnnotationColor = (color: string) => {
    const colors: Record<string, string> = {
      yellow: 'bg-yellow-400',
      red: 'bg-red-400',
      green: 'bg-green-400',
      blue: 'bg-blue-400',
    };
    return colors[color] || 'bg-gray-400';
  };

  return (
    <>
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          className="flex flex-col gap-2 p-3 rounded-lg border border-[#f0f2f4] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] hover:border-primary/30 transition-colors cursor-pointer group"
          onClick={() => onAnnotationClick(annotation)}
          data-testid={`annotation-${annotation.id}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-2 items-center">
              {annotation.author.avatar ? (
                <div
                  className="size-6 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${annotation.author.avatar}")` }}
                />
              ) : (
                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {annotation.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs font-bold text-[#111318] dark:text-white">
                {annotation.author.name}
              </span>
            </div>
            <span className="text-[10px] text-[#616f89] dark:text-gray-500">
              {formatDate(annotation.createdAt)}
            </span>
          </div>
          {annotation.content && (
            <p className="text-sm text-[#4b5563] dark:text-gray-300 leading-relaxed">
              {annotation.content}
            </p>
          )}
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-1">
              <span className={`size-2 rounded-full ${getAnnotationColor(annotation.color)}`} />
              <span className="text-xs text-[#616f89] dark:text-gray-500">
                Página {annotation.page}
              </span>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-xs text-primary font-medium hover:underline">
              Responder
            </button>
          </div>
        </div>
      ))}
    </>
  );
};


// Thumbnails Tab Content
interface ThumbnailsTabContentProps {
  totalPages: number;
  currentPage: number;
  onPageClick: (page: number) => void;
}

const ThumbnailsTabContent: React.FC<ThumbnailsTabContentProps> = ({
  totalPages,
  currentPage,
  onPageClick,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3" data-testid="thumbnails-grid">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageClick(pageNum)}
          className={`relative aspect-[1/1.414] rounded border-2 transition-all ${
            currentPage === pageNum
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-[#e2e8f0] dark:border-[#4a5568] hover:border-primary/50'
          }`}
          data-testid={`thumbnail-${pageNum}`}
        >
          <div className="absolute inset-0 bg-white dark:bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-400">{pageNum}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-0.5 text-center">
            {pageNum}
          </div>
        </button>
      ))}
    </div>
  );
};

// Info Tab Content
interface InfoTabContentProps {
  document: DocumentInfo;
}

const InfoTabContent: React.FC<InfoTabContentProps> = ({ document }) => {
  const infoItems = [
    { label: 'Nome', value: document.name },
    { label: 'Tipo', value: document.type.toUpperCase() },
    { label: 'Tamanho', value: formatFileSize(document.size) },
    { label: 'Páginas', value: String(document.totalPages) },
    { label: 'Versão', value: `v${document.version}` },
    { label: 'Proprietário', value: document.owner.name },
    { label: 'Criado em', value: formatDate(document.createdAt) },
    { label: 'Atualizado em', value: formatDate(document.updatedAt) },
  ];

  return (
    <div className="flex flex-col gap-3" data-testid="info-content">
      {infoItems.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5">
          <span className="text-xs text-[#616f89] dark:text-gray-500">{item.label}</span>
          <span className="text-sm text-[#111318] dark:text-white font-medium truncate">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Document Page Component
interface DocumentPageProps {
  pageNumber: number;
  documentUrl?: string;
  annotations: Annotation[];
  isCurrentPage: boolean;
  activeTool: AnnotationTool;
  onAnnotationAdd?: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
}

const DocumentPage: React.FC<DocumentPageProps> = ({
  pageNumber,
  documentUrl,
  annotations,
  isCurrentPage,
  activeTool,
  onAnnotationAdd,
}) => {
  const pageRef = useRef<HTMLDivElement>(null);

  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (activeTool === 'comment' && onAnnotationAdd && pageRef.current) {
        const rect = pageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        onAnnotationAdd({
          type: 'comment',
          page: pageNumber,
          position: { x, y },
          color: 'yellow',
          author: {
            id: 'current-user',
            name: 'Usuário Atual',
          },
        });
      }
    },
    [activeTool, onAnnotationAdd, pageNumber]
  );

  const getAnnotationColor = (color: string) => {
    const colors: Record<string, string> = {
      yellow: 'bg-yellow-400',
      red: 'bg-red-400',
      green: 'bg-green-400',
      blue: 'bg-blue-400',
    };
    return colors[color] || 'bg-yellow-400';
  };

  return (
    <div
      ref={pageRef}
      className={`relative w-full max-w-[800px] bg-white aspect-[1/1.414] rounded-sm overflow-hidden shadow-lg ${
        isCurrentPage ? 'ring-2 ring-primary' : ''
      } ${activeTool === 'comment' ? 'cursor-crosshair' : ''}`}
      onClick={handlePageClick}
      data-testid={`document-page-${pageNumber}`}
      data-page={pageNumber}
    >
      {/* Page content placeholder */}
      {documentUrl ? (
        <div
          className="w-full h-full bg-contain bg-top bg-no-repeat"
          style={{ backgroundImage: `url("${documentUrl}?page=${pageNumber}")` }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300">description</span>
            <p className="text-sm text-gray-400 mt-2">Página {pageNumber}</p>
          </div>
        </div>
      )}

      {/* Annotations overlay */}
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          className="absolute"
          style={{
            left: `${annotation.position.x}%`,
            top: `${annotation.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {annotation.type === 'highlight' && (
            <div
              className={`${getAnnotationColor(annotation.color)}/40 mix-blend-multiply`}
              style={{
                width: annotation.position.width ? `${annotation.position.width}%` : '100px',
                height: annotation.position.height ? `${annotation.position.height}%` : '20px',
              }}
            />
          )}
          {annotation.type === 'comment' && (
            <div
              className={`size-6 ${getAnnotationColor(annotation.color)} rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform ring-2 ring-white`}
              title={annotation.content || 'Comentário'}
            >
              {annotation.author.avatar ? (
                <div
                  className="size-6 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${annotation.author.avatar}")` }}
                />
              ) : (
                <span className="text-[10px] font-bold text-white">
                  {annotation.author.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Page number indicator */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {pageNumber}
      </div>
    </div>
  );
};

export default DocumentViewer;
