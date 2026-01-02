import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant styles when no variant is specified', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'default');
    expect(badge).toHaveClass('bg-gray-100');
  });

  it('applies success variant styles', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'success');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('applies warning variant styles', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'warning');
    expect(badge).toHaveClass('bg-amber-100');
  });

  it('applies error variant styles', () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'error');
    expect(badge).toHaveClass('bg-red-100');
  });

  it('applies info variant styles', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'info');
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('applies sm size styles', () => {
    render(<Badge size="sm">Small</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-size', 'sm');
    expect(badge).toHaveClass('text-xs');
  });

  it('applies md size styles by default', () => {
    render(<Badge>Medium</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-size', 'md');
    expect(badge).toHaveClass('text-sm');
  });

  it('accepts custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('custom-class');
  });
});
