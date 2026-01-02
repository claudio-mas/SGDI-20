import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Email" placeholder="Enter email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with left icon', () => {
      render(
        <Input
          icon={<span data-testid="custom-icon">icon</span>}
          iconPosition="left"
        />
      );
      expect(screen.getByTestId('input-icon-left')).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      render(
        <Input
          icon={<span data-testid="custom-icon">icon</span>}
          iconPosition="right"
        />
      );
      expect(screen.getByTestId('input-icon-right')).toBeInTheDocument();
    });
  });

  describe('input types', () => {
    it('renders text input by default', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');
    });

    it('renders email input', () => {
      render(<Input type="email" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    });

    it('renders password input', () => {
      render(<Input type="password" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
    });

    it('renders search input', () => {
      render(<Input type="search" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'search');
    });
  });

  describe('password toggle', () => {
    it('shows password toggle button when showPasswordToggle is true', () => {
      render(<Input type="password" showPasswordToggle />);
      expect(screen.getByTestId('password-toggle')).toBeInTheDocument();
    });

    it('does not show password toggle when showPasswordToggle is false', () => {
      render(<Input type="password" showPasswordToggle={false} />);
      expect(screen.queryByTestId('password-toggle')).not.toBeInTheDocument();
    });

    it('toggles password visibility when toggle button is clicked', () => {
      render(<Input type="password" showPasswordToggle data-testid="input" />);
      const input = screen.getByTestId('input');
      const toggleButton = screen.getByTestId('password-toggle');

      expect(input).toHaveAttribute('type', 'password');

      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');

      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('shows correct icon based on password visibility', () => {
      render(<Input type="password" showPasswordToggle />);
      const toggleButton = screen.getByTestId('password-toggle');

      expect(toggleButton).toHaveTextContent('visibility');

      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveTextContent('visibility_off');
    });
  });

  describe('onChange handler', () => {
    it('calls onChange with input value', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} data-testid="input" />);

      fireEvent.change(screen.getByTestId('input'), { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalledWith('test');
    });
  });

  describe('disabled state', () => {
    it('disables input when disabled prop is true', () => {
      render(<Input disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('disables password toggle when input is disabled', () => {
      render(<Input type="password" showPasswordToggle disabled />);
      expect(screen.getByTestId('password-toggle')).toBeDisabled();
    });
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      render(<Input size="sm" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('h-9');
    });

    it('applies medium size styles by default', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('h-12');
    });

    it('applies large size styles', () => {
      render(<Input size="lg" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('h-14');
    });
  });

  describe('error state', () => {
    it('applies error border styles when error is present', () => {
      render(<Input error="Error message" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('border-red-500');
    });

    it('sets aria-invalid when error is present', () => {
      render(<Input error="Error message" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('search type styling', () => {
    it('applies search-specific styles for search type', () => {
      render(<Input type="search" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('border-0');
      expect(input).toHaveClass('bg-[#f0f2f4]');
    });
  });
});
