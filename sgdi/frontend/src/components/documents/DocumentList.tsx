import React from 'react';
import Table, { TableColumn } from '../common/Table';
import FileIcon, { FileType } from '../common/FileIcon';
import Badge from '../common/Badge';
import { DocumentGridItem } from './DocumentGrid';

export interface DocumentListProps {
  items: DocumentGridItem[];
  selectedIds: string[];
  onSelect: (id: string, multiSelect?: boolean) => void;
  onSelectionChange: (ids: string[]) => void;
  onOpen: (item: DocumentGridItem) => void;
  loading?: boolean;
  className?: string;
}

// Helper to get file type from extension
const getFileType = (fileName: string, isFolder: boolean): FileType => {
  if (isFolder) return 'folder';
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
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// Helper to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper to get file extension badge
const getExtensionBadge = (fileName: string, isFolder: boolean): React.ReactNode => {
  if (isFolder) return <Badge variant="info" size="sm">Pasta</Badge>;
  const ext = fileName.split('.').pop()?.toUpperCase();
  if (!ext) return null;
  
  const variantMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    PDF: 'error',
    DOC: 'info',
    DOCX: 'info',
    XLS: 'success',
    XLSX: 'success',
    PPT: 'warning',
    PPTX: 'warning',
    JPG: 'default',
    JPEG: 'default',
    PNG: 'default',
    ZIP: 'default',
  };
  
  return <Badge variant={variantMap[ext] || 'default'} size="sm">{ext}</Badge>;
};

// Table row item type (extends DocumentGridItem with id for Table)
interface TableItem extends DocumentGridItem {
  id: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  items,
  selectedIds,
  onSelectionChange,
  onOpen,
  loading = false,
  className = '',
}) => {
  const columns: TableColumn<TableItem>[] = [
    {
      key: 'name',
      header: 'Nome',
      sortable: true,
      render: (item) => {
        const fileType = getFileType(item.name, item.type === 'folder');
        return (
          <div className="flex items-center gap-3">
            <FileIcon type={fileType} size="md" />
            <span className="font-medium truncate max-w-xs" title={item.name}>
              {item.name}
            </span>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Tipo',
      sortable: true,
      width: '100px',
      render: (item) => getExtensionBadge(item.name, item.type === 'folder'),
    },
    {
      key: 'size',
      header: 'Tamanho',
      sortable: true,
      width: '120px',
      render: (item) => (
        <span className="text-gray-500 dark:text-gray-400">
          {item.type === 'folder' 
            ? `${item.itemCount || 0} itens`
            : formatSize(item.size)
          }
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Modificado',
      sortable: true,
      width: '180px',
      render: (item) => (
        <span className="text-gray-500 dark:text-gray-400">
          {formatDate(item.updatedAt)}
        </span>
      ),
    },
  ];

  const handleRowClick = (item: TableItem) => {
    onOpen(item);
  };

  // Sort items: folders first, then files
  const sortedItems: TableItem[] = [
    ...items.filter((item) => item.type === 'folder'),
    ...items.filter((item) => item.type === 'file'),
  ];

  return (
    <div className={className} data-testid="document-list">
      <Table<TableItem>
        columns={columns}
        data={sortedItems}
        loading={loading}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default DocumentList;
