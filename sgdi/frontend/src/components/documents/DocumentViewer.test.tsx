import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentViewer, DocumentInfo, Annotation } from './DocumentViewer';

const mockDocument: DocumentInfo = {
  id: 'doc-1',
  name: 'Contrato de Prestação de Serviços',
  type: 'pdf',
  size: 1024 * 1024 * 2, // 2MB
  status: 'approved',
  owner: {
    id: 'user-1',
    name: 'João Silva',
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  version: 2,
  totalPages: 5,
};

const mockAnnotations: Annotation[] = [
  {
    id: 'ann-1',
    type: 'comment',
    page: 1,
    position: { x: 50, y: 30 },
    content: 'Por favor, revise esta cláusula.',
    color: 'yellow',
    author: {
      id: 'user-2',
      name: 'Ana Silva',
    },
    createdAt: new Date('2024-01-18'),
  },
];

describe('DocumentViewer', () => {
  it('renders document title and status', () => {
    render(<DocumentViewer document={mockDocument} />);
    
    expect(screen.getByText('Contrato de Prestação de Serviços')).toBeInTheDocument();
    expect(screen.getByText('Aprovado')).toBeInTheDocument();
  });

  it('renders toolbar with zoom controls', () => {
    render(<DocumentViewer document={mockDocument} />);
    
    expect(screen.getByTestId('document-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('100%');
    expect(screen.getByTestId('zoom-in-btn')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-out-btn')).toBeInTheDocument();
  });

  it('handles zoom in correctly', () => {
    const onZoomChange = vi.fn();
    render(<DocumentViewer document={mockDocument} onZoomChange={onZoomChange} />);
    
    const zoomInBtn = screen.getByTestId('zoom-in-btn');
    fireEvent.click(zoomInBtn);
    
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('125%');
    expect(onZoomChange).toHaveBeenCalledWith(125);
  });

  it('handles zoom out correctly', () => {
    const onZoomChange = vi.fn();
    render(<DocumentViewer document={mockDocument} onZoomChange={onZoomChange} />);
    
    const zoomOutBtn = screen.getByTestId('zoom-out-btn');
    fireEvent.click(zoomOutBtn);
    
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('75%');
    expect(onZoomChange).toHaveBeenCalledWith(75);
  });

  it('respects zoom bounds', () => {
    render(<DocumentViewer document={mockDocument} initialZoom={25} minZoom={25} />);
    
    const zoomOutBtn = screen.getByTestId('zoom-out-btn');
    fireEvent.click(zoomOutBtn);
    
    // Should stay at minimum
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('25%');
  });

  it('renders page navigation controls', () => {
    render(<DocumentViewer document={mockDocument} />);
    
    expect(screen.getByTestId('prev-page-btn')).toBeInTheDocument();
    expect(screen.getByTestId('next-page-btn')).toBeInTheDocument();
    expect(screen.getByTestId('page-input')).toHaveValue('1');
  });

  it('handles page navigation', () => {
    const onPageChange = vi.fn();
    render(<DocumentViewer document={mockDocument} onPageChange={onPageChange} />);
    
    const nextPageBtn = screen.getByTestId('next-page-btn');
    fireEvent.click(nextPageBtn);
    
    expect(screen.getByTestId('page-input')).toHaveValue('2');
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders annotation tools', () => {
    render(<DocumentViewer document={mockDocument} />);
    
    expect(screen.getByTestId('tool-select')).toBeInTheDocument();
    expect(screen.getByTestId('tool-pan')).toBeInTheDocument();
    expect(screen.getByTestId('tool-highlight')).toBeInTheDocument();
    expect(screen.getByTestId('tool-comment')).toBeInTheDocument();
    expect(screen.getByTestId('tool-draw')).toBeInTheDocument();
  });

  it('renders sidebar with tabs', () => {
    render(<DocumentViewer document={mockDocument} />);
    
    expect(screen.getByTestId('document-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('tab-annotations')).toBeInTheDocument();
    expect(screen.getByTestId('tab-thumbnails')).toBeInTheDocument();
    expect(screen.getByTestId('tab-info')).toBeInTheDocument();
  });

  it('switches sidebar tabs', () => {
    render(<DocumentViewer document={mockDocument} />);
    
    const thumbnailsTab = screen.getByTestId('tab-thumbnails');
    fireEvent.click(thumbnailsTab);
    
    expect(screen.getByTestId('thumbnails-grid')).toBeInTheDocument();
  });

  it('displays document info in info tab', () => {
    render(<DocumentViewer document={mockDocument} />);
    
    const infoTab = screen.getByTestId('tab-info');
    fireEvent.click(infoTab);
    
    expect(screen.getByTestId('info-content')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('v2')).toBeInTheDocument();
  });

  it('renders annotations in sidebar', () => {
    render(<DocumentViewer document={mockDocument} annotations={mockAnnotations} />);
    
    expect(screen.getByTestId('annotation-ann-1')).toBeInTheDocument();
    expect(screen.getByText('Por favor, revise esta cláusula.')).toBeInTheDocument();
    expect(screen.getByText('Ana Silva')).toBeInTheDocument();
  });

  it('renders save status indicator', () => {
    render(<DocumentViewer document={mockDocument} onSave={vi.fn()} />);
    
    expect(screen.getByTestId('save-status')).toBeInTheDocument();
    expect(screen.getByText('Salvo')).toBeInTheDocument();
  });

  it('renders document pages', () => {
    render(<DocumentViewer document={mockDocument} />);
    
    // Should render all 5 pages
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`document-page-${i}`)).toBeInTheDocument();
    }
  });

  it('renders breadcrumb when provided', () => {
    const breadcrumbPath = [
      { id: '1', label: 'Jurídico' },
      { id: '2', label: 'Contratos' },
      { id: '3', label: 'Contrato.pdf' },
    ];
    
    render(<DocumentViewer document={mockDocument} breadcrumbPath={breadcrumbPath} />);
    
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Jurídico')).toBeInTheDocument();
    expect(screen.getByText('Contratos')).toBeInTheDocument();
  });

  it('calls onShare when share button is clicked', () => {
    const onShare = vi.fn();
    render(<DocumentViewer document={mockDocument} onShare={onShare} />);
    
    const shareBtn = screen.getByText('Compartilhar');
    fireEvent.click(shareBtn);
    
    expect(onShare).toHaveBeenCalled();
  });

  it('calls onDownload when download button is clicked', () => {
    const onDownload = vi.fn();
    render(<DocumentViewer document={mockDocument} onDownload={onDownload} />);
    
    const downloadBtn = screen.getByTestId('download-btn');
    fireEvent.click(downloadBtn);
    
    expect(onDownload).toHaveBeenCalled();
  });
});
