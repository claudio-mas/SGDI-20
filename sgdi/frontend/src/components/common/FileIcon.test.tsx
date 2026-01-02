import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FileIcon, FileType } from './FileIcon';

describe('FileIcon', () => {
  const fileTypes: FileType[] = ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png', 'zip', 'folder', 'unknown'];

  it('renders with default props', () => {
    render(<FileIcon type="pdf" />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-type', 'pdf');
    expect(icon).toHaveAttribute('data-size', 'md');
  });

  it.each(fileTypes)('renders %s file type correctly', (type) => {
    render(<FileIcon type={type} />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveAttribute('data-type', type);
  });

  it.each(['sm', 'md', 'lg'] as const)('renders with size %s', (size) => {
    render(<FileIcon type="pdf" size={size} />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveAttribute('data-size', size);
  });

  it('applies custom className', () => {
    render(<FileIcon type="pdf" className="custom-class" />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveClass('custom-class');
  });

  it('applies correct color class for pdf', () => {
    render(<FileIcon type="pdf" />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveClass('text-red-500');
  });

  it('applies correct color class for docx', () => {
    render(<FileIcon type="docx" />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveClass('text-blue-600');
  });

  it('applies correct color class for xlsx', () => {
    render(<FileIcon type="xlsx" />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveClass('text-green-600');
  });

  it('applies correct color class for folder', () => {
    render(<FileIcon type="folder" />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveClass('text-amber-500');
  });

  it('applies correct size class for sm', () => {
    render(<FileIcon type="pdf" size="sm" />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveClass('w-4', 'h-4');
  });

  it('applies correct size class for lg', () => {
    render(<FileIcon type="pdf" size="lg" />);
    const icon = screen.getByTestId('file-icon');
    expect(icon).toHaveClass('w-8', 'h-8');
  });
});
