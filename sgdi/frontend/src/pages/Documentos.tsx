import { useState, useCallback } from 'react';
import DocumentExplorer, { ViewMode } from '../components/documents/DocumentExplorer';
import { FolderNode } from '../components/documents/FolderTree';
import { DocumentGridItem } from '../components/documents/DocumentGrid';

// Mock data for demonstration
const mockFolders: FolderNode[] = [
  {
    id: 'projetos-2024',
    name: 'Projetos 2024',
    isExpanded: true,
    children: [
      { id: 'marketing', name: 'Marketing' },
      { id: 'financeiro', name: 'Financeiro' },
      { id: 'juridico', name: 'Jurídico' },
    ],
  },
  {
    id: 'rh',
    name: 'Recursos Humanos',
    children: [
      { id: 'contratos', name: 'Contratos' },
      { id: 'folha', name: 'Folha de Pagamento' },
    ],
  },
  {
    id: 'ativos',
    name: 'Ativos de Marca',
    children: [
      { id: 'logos', name: 'Logos' },
      { id: 'templates', name: 'Templates' },
    ],
  },
];


const mockItems: DocumentGridItem[] = [
  {
    id: 'folder-1',
    name: 'Relatórios Fiscais',
    type: 'folder',
    itemCount: 12,
    updatedAt: new Date('2023-10-24'),
  },
  {
    id: 'folder-2',
    name: 'Contratos 2023',
    type: 'folder',
    itemCount: 8,
    updatedAt: new Date('2023-10-15'),
  },
  {
    id: 'folder-3',
    name: 'Orçamentos',
    type: 'folder',
    itemCount: 3,
    updatedAt: new Date('2023-10-10'),
  },
  {
    id: 'file-1',
    name: 'Balanço_Anual_2023.pdf',
    type: 'file',
    fileType: 'pdf',
    size: 2.4 * 1024 * 1024,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'file-2',
    name: 'Fluxo_Caixa_Set.xlsx',
    type: 'file',
    fileType: 'xlsx',
    size: 850 * 1024,
    updatedAt: new Date('2023-10-20'),
  },
  {
    id: 'file-3',
    name: 'Comprovante_Pgto.jpg',
    type: 'file',
    fileType: 'jpg',
    size: 1.2 * 1024 * 1024,
    updatedAt: new Date('2023-10-18'),
  },
  {
    id: 'file-4',
    name: 'Proposta_Comercial.docx',
    type: 'file',
    fileType: 'docx',
    size: 450 * 1024,
    updatedAt: new Date('2023-10-12'),
  },
  {
    id: 'file-5',
    name: 'Backup_Setembro.zip',
    type: 'file',
    fileType: 'zip',
    size: 156 * 1024 * 1024,
    updatedAt: new Date('2023-10-01'),
  },
];


export default function Documentos() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>('financeiro');
  const [currentPath] = useState([
    { id: 'root', name: 'Documentos' },
    { id: 'projetos-2024', name: 'Projetos 2024' },
    { id: 'financeiro', name: 'Financeiro' },
  ]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleFolderSelect = useCallback((folderId: string) => {
    setCurrentFolderId(folderId);
    console.log('Folder selected:', folderId);
  }, []);

  const handleDocumentSelect = useCallback((documentId: string) => {
    console.log('Document selected:', documentId);
  }, []);

  const handleNavigate = useCallback((folderId: string) => {
    setCurrentFolderId(folderId);
    console.log('Navigate to:', folderId);
  }, []);

  const handleUpload = useCallback(() => {
    console.log('Upload clicked');
  }, []);

  const handleAddTag = useCallback((ids: string[]) => {
    console.log('Add tag to:', ids);
  }, []);

  const handleRename = useCallback((id: string) => {
    console.log('Rename:', id);
  }, []);

  const handleMove = useCallback((ids: string[]) => {
    console.log('Move:', ids);
  }, []);

  const handleDelete = useCallback((ids: string[]) => {
    console.log('Delete:', ids);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] -m-6">
      <DocumentExplorer
        folders={mockFolders}
        items={mockItems}
        currentFolderId={currentFolderId}
        currentPath={currentPath}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onFolderSelect={handleFolderSelect}
        onDocumentSelect={handleDocumentSelect}
        onNavigate={handleNavigate}
        onUpload={handleUpload}
        onAddTag={handleAddTag}
        onRename={handleRename}
        onMove={handleMove}
        onDelete={handleDelete}
      />
    </div>
  );
}
