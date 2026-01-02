import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders with default props', () => {
    render(<ProgressBar value={50} />);
    
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders correct fill width based on value', () => {
    render(<ProgressBar value={75} />);
    
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '75%' });
  });

  it('clamps value to 0 when negative', () => {
    render(<ProgressBar value={-10} />);
    
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '0%' });
  });

  it('clamps value to max when exceeding', () => {
    render(<ProgressBar value={150} max={100} />);
    
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '100%' });
  });

  it('calculates percentage correctly with custom max', () => {
    render(<ProgressBar value={25} max={50} showLabel />);
    
    const label = screen.getByTestId('progress-label');
    expect(label).toHaveTextContent('50%');
  });

  it('shows label when showLabel is true', () => {
    render(<ProgressBar value={45} showLabel />);
    
    const label = screen.getByTestId('progress-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('45%');
  });

  it('does not show label when showLabel is false', () => {
    render(<ProgressBar value={45} showLabel={false} />);
    
    expect(screen.queryByTestId('progress-label')).not.toBeInTheDocument();
  });

  it('displays custom label text', () => {
    render(<ProgressBar value={50} showLabel label="Loading..." />);
    
    const label = screen.getByTestId('progress-label');
    expect(label).toHaveTextContent('Loading...');
  });

  it('applies size variants correctly', () => {
    const { rerender } = render(<ProgressBar value={50} size="sm" />);
    expect(screen.getByTestId('progress-bar')).toHaveClass('h-1.5');

    rerender(<ProgressBar value={50} size="md" />);
    expect(screen.getByTestId('progress-bar')).toHaveClass('h-2.5');

    rerender(<ProgressBar value={50} size="lg" />);
    expect(screen.getByTestId('progress-bar')).toHaveClass('h-4');
  });

  it('applies variant colors correctly', () => {
    const { rerender } = render(<ProgressBar value={50} variant="primary" />);
    expect(screen.getByTestId('progress-fill')).toHaveClass('bg-primary');

    rerender(<ProgressBar value={50} variant="success" />);
    expect(screen.getByTestId('progress-fill')).toHaveClass('bg-green-500');

    rerender(<ProgressBar value={50} variant="warning" />);
    expect(screen.getByTestId('progress-fill')).toHaveClass('bg-amber-500');

    rerender(<ProgressBar value={50} variant="error" />);
    expect(screen.getByTestId('progress-fill')).toHaveClass('bg-red-500');
  });

  it('applies animated class when animated is true', () => {
    render(<ProgressBar value={50} animated />);
    
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveClass('animate-pulse');
  });

  it('applies custom className', () => {
    render(<ProgressBar value={50} className="custom-class" />);
    
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveClass('custom-class');
  });

  it('renders with labelPosition top', () => {
    render(<ProgressBar value={50} showLabel labelPosition="top" />);
    
    const label = screen.getByTestId('progress-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('50%');
  });

  it('renders with labelPosition inside for lg size', () => {
    render(<ProgressBar value={50} showLabel labelPosition="inside" size="lg" />);
    
    const label = screen.getByTestId('progress-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-white');
  });
});
