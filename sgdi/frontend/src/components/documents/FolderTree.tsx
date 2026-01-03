import React, { useState, useCallback } from 'react';

export interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
  isExpanded?: boolean;
}

export interface FolderTreeProps {
  folders: FolderNode[];
  selectedFolderId?: string;
  onSelect: (folderId: string) => void;
  onExpand?: (folderId: string) => void;
  className?: string;
}

interface FolderItemProps {
  folder: FolderNode;
  level: number;
  selectedFolderId?: string;
  expandedIds: Set<string>;
  onSelect: (folderId: string) => void;
  onToggleExpand: (folderId: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  level,
  selectedFolderId,
  expandedIds,
  onSelect,
  onToggleExpand,
}) => {
  const hasChildren = folder.children && folder.children.length > 0;
  const isExpanded = expandedIds.has(folder.id);
  const isSelected = selectedFolderId === folder.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(folder.id);
    }
  };

  const handleSelect = () => {
    onSelect(folder.id);
  };

  return (
    <div data-testid={`folder-item-${folder.id}`}>
      <div
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer select-none
          transition-colors
          ${isSelected 
            ? 'text-primary bg-primary/5 font-medium' 
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
        `}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={handleSelect}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="p-0.5 -ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label={isExpanded ? 'Recolher pasta' : 'Expandir pasta'}
          >
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="w-5" />
        )}
        
        <svg
          className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`}
          fill={isSelected || isExpanded ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>
        
        <span className="text-sm truncate">{folder.name}</span>
      </div>

      {hasChildren && isExpanded && (
        <div 
          className="border-l border-gray-100 dark:border-gray-800 ml-5"
          role="group"
        >
          {folder.children!.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolderId,
  onSelect,
  onExpand,
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Initialize with folders that have isExpanded = true
    const initialExpanded = new Set<string>();
    const collectExpanded = (nodes: FolderNode[]) => {
      nodes.forEach((node) => {
        if (node.isExpanded) {
          initialExpanded.add(node.id);
        }
        if (node.children) {
          collectExpanded(node.children);
        }
      });
    };
    collectExpanded(folders);
    return initialExpanded;
  });

  const handleToggleExpand = useCallback((folderId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
    onExpand?.(folderId);
  }, [onExpand]);

  if (folders.length === 0) {
    return (
      <div 
        className={`text-sm text-gray-500 dark:text-gray-400 px-3 py-2 ${className}`}
        data-testid="folder-tree-empty"
      >
        Nenhuma pasta encontrada
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col gap-1 ${className}`}
      role="tree"
      aria-label="Árvore de pastas"
      data-testid="folder-tree"
    >
      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          level={0}
          selectedFolderId={selectedFolderId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </div>
  );
};

export default FolderTree;
