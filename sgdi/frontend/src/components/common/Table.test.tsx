import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table, TableColumn } from './Table';

interface TestItem {
  id: string;
  name: string;
  email: string;
  age: number;
}

const mockData: TestItem[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com', age: 30 },
  { id: '2', name: 'Bob', email: 'bob@test.com', age: 25 },
  { id: '3', name: 'Charlie', email: 'charlie@test.com', age: 35 },
];

const columns: TableColumn<TestItem>[] = [
  { key: 'name', header: 'Nome', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'age', header: 'Idade', sortable: true },
];

describe('Table', () => {
  it('renders table with data', () => {
    render(<Table columns={columns} data={mockData} />);
    
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Idade')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Table columns={columns} data={[]} loading={true} />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<Table columns={columns} data={[]} />);
    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
  });

  it('handles row click', () => {
    const onRowClick = vi.fn();
    render(<Table columns={columns} data={mockData} onRowClick={onRowClick} />);
    
    fireEvent.click(screen.getByTestId('table-row-1'));
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  describe('Sorting', () => {
    it('sorts ascending on first click', () => {
      render(<Table columns={columns} data={mockData} />);
      
      fireEvent.click(screen.getByTestId('column-header-name'));
      
      const rows = screen.getAllByTestId(/^table-row-/);
      expect(rows[0]).toHaveAttribute('data-testid', 'table-row-1'); // Alice
      expect(rows[1]).toHaveAttribute('data-testid', 'table-row-2'); // Bob
      expect(rows[2]).toHaveAttribute('data-testid', 'table-row-3'); // Charlie
    });

    it('sorts descending on second click', () => {
      render(<Table columns={columns} data={mockData} />);
      
      const header = screen.getByTestId('column-header-name');
      fireEvent.click(header);
      fireEvent.click(header);
      
      const rows = screen.getAllByTestId(/^table-row-/);
      expect(rows[0]).toHaveAttribute('data-testid', 'table-row-3'); // Charlie
      expect(rows[1]).toHaveAttribute('data-testid', 'table-row-2'); // Bob
      expect(rows[2]).toHaveAttribute('data-testid', 'table-row-1'); // Alice
    });

    it('resets sort on third click', () => {
      render(<Table columns={columns} data={mockData} />);
      
      const header = screen.getByTestId('column-header-name');
      fireEvent.click(header);
      fireEvent.click(header);
      fireEvent.click(header);
      
      const rows = screen.getAllByTestId(/^table-row-/);
      expect(rows[0]).toHaveAttribute('data-testid', 'table-row-1');
      expect(rows[1]).toHaveAttribute('data-testid', 'table-row-2');
      expect(rows[2]).toHaveAttribute('data-testid', 'table-row-3');
    });

    it('does not sort non-sortable columns', () => {
      render(<Table columns={columns} data={mockData} />);
      
      fireEvent.click(screen.getByTestId('column-header-email'));
      
      // Order should remain unchanged
      const rows = screen.getAllByTestId(/^table-row-/);
      expect(rows[0]).toHaveAttribute('data-testid', 'table-row-1');
    });
  });

  describe('Selection', () => {
    it('renders checkboxes when selectable', () => {
      render(
        <Table
          columns={columns}
          data={mockData}
          selectable={true}
          selectedIds={[]}
          onSelectionChange={() => {}}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(4); // 1 header + 3 rows
    });

    it('selects individual row', () => {
      const onSelectionChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={mockData}
          selectable={true}
          selectedIds={[]}
          onSelectionChange={onSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // First row checkbox
      
      expect(onSelectionChange).toHaveBeenCalledWith(['1']);
    });

    it('deselects individual row', () => {
      const onSelectionChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={mockData}
          selectable={true}
          selectedIds={['1', '2']}
          onSelectionChange={onSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]); // First row checkbox
      
      expect(onSelectionChange).toHaveBeenCalledWith(['2']);
    });

    it('selects all rows', () => {
      const onSelectionChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={mockData}
          selectable={true}
          selectedIds={[]}
          onSelectionChange={onSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Header checkbox
      
      expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
    });

    it('deselects all rows', () => {
      const onSelectionChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={mockData}
          selectable={true}
          selectedIds={['1', '2', '3']}
          onSelectionChange={onSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Header checkbox
      
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Pagination', () => {
    it('renders pagination when provided', () => {
      const onPageChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={mockData}
          pagination={{
            page: 1,
            pageSize: 10,
            total: 50,
            onPageChange,
          }}
        />
      );
      
      expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
      // Pagination shows range based on pageSize and total, not actual data length
      expect(screen.getByText(/Mostrando 1 a 10 de 50 itens/)).toBeInTheDocument();
    });

    it('navigates to next page', () => {
      const onPageChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={mockData}
          pagination={{
            page: 1,
            pageSize: 10,
            total: 50,
            onPageChange,
          }}
        />
      );
      
      fireEvent.click(screen.getByText('Próximo'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('navigates to previous page', () => {
      const onPageChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={mockData}
          pagination={{
            page: 2,
            pageSize: 10,
            total: 50,
            onPageChange,
          }}
        />
      );
      
      fireEvent.click(screen.getByText('Anterior'));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('disables previous button on first page', () => {
      render(
        <Table
          columns={columns}
          data={mockData}
          pagination={{
            page: 1,
            pageSize: 10,
            total: 50,
            onPageChange: () => {},
          }}
        />
      );
      
      expect(screen.getByText('Anterior')).toBeDisabled();
    });

    it('disables next button on last page', () => {
      render(
        <Table
          columns={columns}
          data={mockData}
          pagination={{
            page: 5,
            pageSize: 10,
            total: 50,
            onPageChange: () => {},
          }}
        />
      );
      
      expect(screen.getByText('Próximo')).toBeDisabled();
    });
  });

  describe('Custom render', () => {
    it('uses custom render function for column', () => {
      const customColumns: TableColumn<TestItem>[] = [
        { key: 'name', header: 'Nome', render: (item) => <strong>{item.name}</strong> },
        { key: 'age', header: 'Idade', render: (item) => `${item.age} anos` },
      ];
      
      render(<Table columns={customColumns} data={mockData} />);
      
      expect(screen.getByText('30 anos')).toBeInTheDocument();
      expect(screen.getByText('Alice').tagName).toBe('STRONG');
    });
  });
});
