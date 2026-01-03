/**
 * Property-Based Test for Table Sorting
 * 
 * Feature: integracao-templates, Property 14: Table Sorting
 * Validates: Requirements 15.3
 * 
 * Property: For any sortable column in Table_Component, clicking the column header
 * SHALL sort the data by that column, and clicking again SHALL reverse the sort order.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Table, TableColumn } from '../../components/common/Table';

interface TestItem {
  id: string;
  name: string;
  value: number;
  date: string;
}

// Helper to check if array is sorted ascending
function isSortedAsc<T>(arr: T[], getValue: (item: T) => unknown): boolean {
  for (let i = 1; i < arr.length; i++) {
    const prev = getValue(arr[i - 1]);
    const curr = getValue(arr[i]);
    if (prev !== null && curr !== null && prev > curr) {
      return false;
    }
  }
  return true;
}

// Helper to check if array is sorted descending
function isSortedDesc<T>(arr: T[], getValue: (item: T) => unknown): boolean {
  for (let i = 1; i < arr.length; i++) {
    const prev = getValue(arr[i - 1]);
    const curr = getValue(arr[i]);
    if (prev !== null && curr !== null && prev < curr) {
      return false;
    }
  }
  return true;
}

// Helper to extract displayed order from rendered table
function getDisplayedOrder(): string[] {
  const rows = screen.getAllByTestId(/^table-row-/);
  return rows.map(row => {
    const testId = row.getAttribute('data-testid');
    return testId ? testId.replace('table-row-', '') : '';
  });
}

// Arbitrary for generating test data items
const testItemArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  value: fc.integer({ min: -1000, max: 1000 }),
  date: fc.tuple(
    fc.integer({ min: 2020, max: 2025 }),
    fc.integer({ min: 1, max: 12 }),
    fc.integer({ min: 1, max: 28 })
  ).map(([year, month, day]) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`),
});

// Arbitrary for generating arrays of test items (2-10 items for reasonable test size)
const testDataArb = fc.array(testItemArb, { minLength: 2, maxLength: 10 })
  .map(items => items.map((item, idx) => ({ ...item, id: `item-${idx}` })));

describe('Table Sorting Property Tests', () => {
  const columns: TableColumn<TestItem>[] = [
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'value', header: 'Valor', sortable: true },
    { key: 'date', header: 'Data', sortable: true },
  ];

  it('Property 14: Clicking sortable column header sorts data ascending', () => {
    fc.assert(
      fc.property(testDataArb, (data) => {
        const { unmount } = render(<Table columns={columns} data={data} />);
        
        // Click on 'name' column header
        fireEvent.click(screen.getByTestId('column-header-name'));
        
        // Get displayed order
        const displayedIds = getDisplayedOrder();
        
        // Map displayed IDs back to items and check if sorted by name ascending
        const displayedItems = displayedIds.map(id => data.find(item => item.id === id)!);
        const sorted = isSortedAsc(displayedItems, item => item.name);
        
        unmount();
        return sorted;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 14: Clicking sortable column header twice sorts data descending', () => {
    fc.assert(
      fc.property(testDataArb, (data) => {
        const { unmount } = render(<Table columns={columns} data={data} />);
        
        const header = screen.getByTestId('column-header-name');
        
        // Click twice to sort descending
        fireEvent.click(header);
        fireEvent.click(header);
        
        // Get displayed order
        const displayedIds = getDisplayedOrder();
        
        // Map displayed IDs back to items and check if sorted by name descending
        const displayedItems = displayedIds.map(id => data.find(item => item.id === id)!);
        const sorted = isSortedDesc(displayedItems, item => item.name);
        
        unmount();
        return sorted;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 14: Clicking sortable column header three times resets to original order', () => {
    fc.assert(
      fc.property(testDataArb, (data) => {
        const { unmount } = render(<Table columns={columns} data={data} />);
        
        // Store original order
        const originalOrder = getDisplayedOrder();
        
        const header = screen.getByTestId('column-header-name');
        
        // Click three times to reset
        fireEvent.click(header);
        fireEvent.click(header);
        fireEvent.click(header);
        
        // Get displayed order after reset
        const resetOrder = getDisplayedOrder();
        
        // Should be back to original order
        const isReset = originalOrder.every((id, idx) => id === resetOrder[idx]);
        
        unmount();
        return isReset;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 14: Numeric column sorting works correctly', () => {
    fc.assert(
      fc.property(testDataArb, (data) => {
        const { unmount } = render(<Table columns={columns} data={data} />);
        
        // Click on 'value' column header for ascending sort
        fireEvent.click(screen.getByTestId('column-header-value'));
        
        const displayedIds = getDisplayedOrder();
        const displayedItems = displayedIds.map(id => data.find(item => item.id === id)!);
        const sortedAsc = isSortedAsc(displayedItems, item => item.value);
        
        // Click again for descending sort
        fireEvent.click(screen.getByTestId('column-header-value'));
        
        const displayedIdsDesc = getDisplayedOrder();
        const displayedItemsDesc = displayedIdsDesc.map(id => data.find(item => item.id === id)!);
        const sortedDesc = isSortedDesc(displayedItemsDesc, item => item.value);
        
        unmount();
        return sortedAsc && sortedDesc;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 14: Switching between sortable columns resets sort direction', () => {
    fc.assert(
      fc.property(testDataArb, (data) => {
        const { unmount } = render(<Table columns={columns} data={data} />);
        
        // Sort by name ascending
        fireEvent.click(screen.getByTestId('column-header-name'));
        
        // Now click on value column - should sort ascending (not descending)
        fireEvent.click(screen.getByTestId('column-header-value'));
        
        const displayedIds = getDisplayedOrder();
        const displayedItems = displayedIds.map(id => data.find(item => item.id === id)!);
        const sortedAsc = isSortedAsc(displayedItems, item => item.value);
        
        unmount();
        return sortedAsc;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 14: Sort icon reflects current sort state', () => {
    fc.assert(
      fc.property(testDataArb, (data) => {
        const { unmount } = render(<Table columns={columns} data={data} />);
        
        const header = screen.getByTestId('column-header-name');
        
        // Initially no sort - should show neutral icon
        let sortIcon = header.querySelector('[data-testid="sort-none"]');
        const hasNeutralIcon = sortIcon !== null;
        
        // Click once - should show ascending icon
        fireEvent.click(header);
        const ascIcon = header.querySelector('[data-testid="sort-asc"]');
        const hasAscIcon = ascIcon !== null;
        
        // Click twice - should show descending icon
        fireEvent.click(header);
        const descIcon = header.querySelector('[data-testid="sort-desc"]');
        const hasDescIcon = descIcon !== null;
        
        // Click three times - should show neutral icon again
        fireEvent.click(header);
        sortIcon = header.querySelector('[data-testid="sort-none"]');
        const hasNeutralIconAgain = sortIcon !== null;
        
        unmount();
        return hasNeutralIcon && hasAscIcon && hasDescIcon && hasNeutralIconAgain;
      }),
      { numRuns: 100 }
    );
  });
});
