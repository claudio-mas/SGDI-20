import React from 'react';
import FileIcon, { FileType } from '../common/FileIcon';

export interface DocumentGridItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  size?: number;
  itemCount?: number;
  updatedAt: Date;
  thumbnail?: string;
}

export interface DocumentGridProps {
  items: DocumentGridItem[];
  selectedIds: string[];
  onSelect: (id: string, multiSelect?: boolean) => void;
  onOpen: (item: DocumentGridItem) => void;
  onContextMenu?: (item: DocumentGridItem, event: React.MouseEvent) => void;
  loading?: boolean;
  className?: string;
}

// Helper to get file type from extension
const getFileType = (fileName: string): FileType => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const typeMap: Record<string, FileType> = {
    pdf: 'pdf',
    doc: 'docx',
    docx: 'docx',
    xls: 'xlsx',
    xlsx: 'xlsx',
    ppt: 'pptx',
    pptx: 'pptx',
    jpg: 'jpg',
    jpeg: 'jpg',
    png: 'png',
    zip: 'zip',
    rar: 'zip',
  };
  return typeMap[ext || ''] || 'unknown';
};

// Helper to format file size
const formatSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// Helper to format date
const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias atrás`;
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

// File type icon colors
const fileTypeColors: Record<FileType, string> = {
  pdf: 'bg-red-100 dark:bg-red-900/30 text-red-500',
  docx: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
  xlsx: 'bg-green-100 dark:bg-green-900/30 text-green-600',
  pptx: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
  jpg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500',
  png: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500',
  zip: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
  folder: 'bg-primary/10 text-primary',
  unknown: 'bg-gray-100 dark:bg-gray-800 text-gray-500',
};

const GridItem: React.FC<{
  item: DocumentGridItem;
  isSelected: boolean;
  onSelect: (id: string, multiSelect?: boolean) => void;
  onOpen: (item: DocumentGridItem) => void;
  onContextMenu?: (item: DocumentGridItem, event: React.MouseEvent) => void;
}> = ({ item, isSelected, onSelect, onOpen, onContextMenu }) => {
  const fileType = item.type === 'folder' ? 'folder' : getFileType(item.name);
  const colorClass = fileTypeColors[fileType];

  const handleClick = (e: React.MouseEvent) => {
    onSelect(item.id, e.ctrlKey || e.metaKey);
  };

  const handleDoubleClick = () => {
    onOpen(item);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(item, e);
  };

  return (
    <div
      className={`
        group relative flex flex-col p-4 rounded-xl cursor-pointer transition-all
        ${isSelected 
          ? 'bg-primary/5 border-primary shadow-sm' 
          : 'bg-white dark:bg-[#1e232e] border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50'
        }
        border
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      data-testid={`grid-item-${item.id}`}
      role="gridcell"
      aria-selected={isSelected}
    >
      {/* Selection checkbox */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="size-5 bg-primary rounded border border-primary flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* More options button (visible on hover) */}
      {!isSelected && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onContextMenu?.(item, e);
            }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      )}

      {/* Icon or thumbnail */}
      <div className="flex justify-start items-start mb-3 mt-1">
        {item.thumbnail && item.type === 'file' ? (
          <div 
            className="w-full aspect-video rounded-lg bg-gray-100 overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${item.thumbnail})` }}
          />
        ) : item.type === 'folder' ? (
          <svg
            className="w-10 h-10 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        ) : (
          <div className={`size-10 rounded-lg flex items-center justify-center ${colorClass}`}>
            <FileIcon type={fileType} size="md" />
          </div>
        )}
      </div>

      {/* Name */}
      <h5 
        className="font-medium text-gray-900 dark:text-white truncate"
        title={item.name}
      >
        {item.name}
      </h5>

      {/* Meta info */}
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        {item.type === 'folder' 
          ? `${item.itemCount || 0} itens`
          : formatSize(item.size)
        }
        {' • '}
        {formatDate(item.updatedAt)}
      </p>
    </div>
  );
};

// Loading skeleton
const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div 
        key={i}
        className="flex flex-col p-4 bg-white dark:bg-[#1e232e] border border-gray-100 dark:border-gray-800 rounded-xl animate-pulse"
      >
        <div className="size-10 rounded-lg bg-gray-200 dark:bg-gray-700 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    ))}
  </div>
);

// Empty state
const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
    <p className="text-gray-500 dark:text-gray-400 text-sm">Esta pasta está vazia</p>
  </div>
);

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  items,
  selectedIds,
  onSelect,
  onOpen,
  onContextMenu,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  // Separate folders and files
  const folders = items.filter((item) => item.type === 'folder');
  const files = items.filter((item) => item.type === 'file');

  return (
    <div className={className} data-testid="document-grid" role="grid">
      {/* Folders section */}
      {folders.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
            Pastas
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" role="row">
            {folders.map((item) => (
              <GridItem
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                onSelect={onSelect}
                onOpen={onOpen}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files section */}
      {files.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
            Arquivos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" role="row">
            {files.map((item) => (
              <GridItem
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                onSelect={onSelect}
                onOpen={onOpen}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGrid;
