import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

describe('Breadcrumb', () => {
  const mockItems: BreadcrumbItem[] = [
    { id: 'root', label: 'Documentos', onClick: vi.fn() },
    { id: 'folder1', label: 'Projetos 2024', onClick: vi.fn() },
    { id: 'folder2', label: 'Financeiro' },
  ];

  it('renders breadcrumb with items', () => {
    render(<Breadcrumb items={mockItems} />);
    
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByText('Projetos 2024')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
  });

  it('renders nothing when items array is empty', () => {
    const { container } = render(<Breadcrumb items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders last item as current page (non-clickable)', () => {
    render(<Breadcrumb items={mockItems} />);
    
    const currentItem = screen.getByTestId('breadcrumb-current');
    expect(currentItem).toHaveTextContent('Financeiro');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('renders non-last items as clickable buttons', () => {
    render(<Breadcrumb items={mockItems} />);
    
    const firstButton = screen.getByTestId('breadcrumb-item-root');
    const secondButton = screen.getByTestId('breadcrumb-item-folder1');
    
    expect(firstButton.tagName).toBe('BUTTON');
    expect(secondButton.tagName).toBe('BUTTON');
  });

  it('calls onClick when breadcrumb item is clicked', () => {
    const onClickFirst = vi.fn();
    const onClickSecond = vi.fn();
    
    const items: BreadcrumbItem[] = [
      { id: 'root', label: 'Documentos', onClick: onClickFirst },
      { id: 'folder1', label: 'Projetos 2024', onClick: onClickSecond },
      { id: 'folder2', label: 'Financeiro' },
    ];
    
    render(<Breadcrumb items={items} />);
    
    fireEvent.click(screen.getByTestId('breadcrumb-item-root'));
    expect(onClickFirst).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByTestId('breadcrumb-item-folder1'));
    expect(onClickSecond).toHaveBeenCalledTimes(1);
  });

  it('renders default separator between items', () => {
    render(<Breadcrumb items={mockItems} />);
    
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(2);
  });

  it('renders custom separator when provided', () => {
    const customSeparator = <span data-testid="custom-sep">→</span>;
    
    render(<Breadcrumb items={mockItems} separator={customSeparator} />);
    
    const separators = screen.getAllByTestId('custom-sep');
    expect(separators).toHaveLength(2);
  });

  it('applies custom className', () => {
    render(<Breadcrumb items={mockItems} className="custom-class" />);
    
    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toHaveClass('custom-class');
  });

  it('renders single item as current page', () => {
    const singleItem: BreadcrumbItem[] = [
      { id: 'root', label: 'Documentos' },
    ];
    
    render(<Breadcrumb items={singleItem} />);
    
    const currentItem = screen.getByTestId('breadcrumb-current');
    expect(currentItem).toHaveTextContent('Documentos');
  });

  it('has proper accessibility attributes', () => {
    render(<Breadcrumb items={mockItems} />);
    
    const nav = screen.getByTestId('breadcrumb');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});
