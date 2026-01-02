import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown, DropdownOption } from './Dropdown';

const defaultOptions: DropdownOption[] = [
  { value: 'editor', label: 'Edição' },
  { value: 'viewer', label: 'Leitura' },
  { value: 'remove', label: 'Remover acesso', variant: 'danger' },
];

describe('Dropdown', () => {
  it('renders with placeholder when no value is selected', () => {
    render(<Dropdown options={defaultOptions} placeholder="Selecione..." />);
    
    expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Selecione...');
  });

  it('renders with selected value', () => {
    render(<Dropdown options={defaultOptions} value="editor" />);
    
    expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent('Edição');
  });

  it('opens dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={defaultOptions} />);
    
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-option-editor')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-option-viewer')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-option-remove')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Dropdown options={defaultOptions} onChange={handleChange} />);
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    await user.click(screen.getByTestId('dropdown-option-viewer'));
    
    expect(handleChange).toHaveBeenCalledWith('viewer');
  });

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={defaultOptions} />);
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    
    await user.click(screen.getByTestId('dropdown-option-editor'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={defaultOptions} disabled />);
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('does not select disabled options', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const optionsWithDisabled: DropdownOption[] = [
      { value: 'editor', label: 'Edição' },
      { value: 'viewer', label: 'Leitura', disabled: true },
    ];
    
    render(<Dropdown options={optionsWithDisabled} onChange={handleChange} />);
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    await user.click(screen.getByTestId('dropdown-option-viewer'));
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders danger variant option with correct styling', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={defaultOptions} />);
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    
    const dangerOption = screen.getByTestId('dropdown-option-remove');
    expect(dangerOption).toHaveClass('text-red-500');
  });

  it('shows check icon for selected option', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={defaultOptions} value="editor" />);
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    
    const selectedOption = screen.getByTestId('dropdown-option-editor');
    expect(selectedOption.querySelector('.material-symbols-outlined')).toBeInTheDocument();
  });

  it('supports keyboard navigation with ArrowDown', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={defaultOptions} />);
    
    const trigger = screen.getByTestId('dropdown-trigger');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('closes dropdown on Escape key', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={defaultOptions} />);
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    
    await user.keyboard('{Escape}');
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('selects option on Enter key', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Dropdown options={defaultOptions} onChange={handleChange} />);
    
    const trigger = screen.getByTestId('dropdown-trigger');
    trigger.focus();
    
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    
    expect(handleChange).toHaveBeenCalledWith('editor');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Dropdown options={defaultOptions} size="sm" />);
    expect(screen.getByTestId('dropdown-trigger')).toHaveClass('h-8');
    
    rerender(<Dropdown options={defaultOptions} size="md" />);
    expect(screen.getByTestId('dropdown-trigger')).toHaveClass('h-10');
    
    rerender(<Dropdown options={defaultOptions} size="lg" />);
    expect(screen.getByTestId('dropdown-trigger')).toHaveClass('h-12');
  });

  it('renders with ghost variant', () => {
    render(<Dropdown options={defaultOptions} variant="ghost" />);
    
    expect(screen.getByTestId('dropdown-trigger')).toHaveClass('bg-transparent');
  });

  it('renders options with icons', async () => {
    const user = userEvent.setup();
    const optionsWithIcons: DropdownOption[] = [
      { value: 'edit', label: 'Editar', icon: <span data-testid="edit-icon">✏️</span> },
      { value: 'delete', label: 'Excluir', icon: <span data-testid="delete-icon">🗑️</span> },
    ];
    
    render(<Dropdown options={optionsWithIcons} value="edit" />);
    
    // Icon should be visible in trigger when selected
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    
    // Both icons should be visible in menu
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Dropdown options={defaultOptions} />
        <button data-testid="outside-button">Outside</button>
      </div>
    );
    
    await user.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    
    await user.click(screen.getByTestId('outside-button'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('has correct aria attributes', async () => {
    const user = userEvent.setup();
    render(<Dropdown options={defaultOptions} aria-label="Permission selector" />);
    
    const trigger = screen.getByTestId('dropdown-trigger');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-label', 'Permission selector');
    
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    
    const menu = screen.getByTestId('dropdown-menu');
    expect(menu).toHaveAttribute('role', 'listbox');
  });
});
