/**
 * Property-Based Test for Breadcrumb Path Display
 * 
 * Feature: integracao-templates, Property 5: Breadcrumb Path Display
 * Validates: Requirements 3.7
 * 
 * Property: For any folder in the folder hierarchy, the Breadcrumb_Component SHALL display
 * all ancestor folders in order from root to current, and clicking any breadcrumb item
 * SHALL navigate to that folder.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent, cleanup, within } from '../../test/test-utils';
import { Breadcrumb, BreadcrumbItem } from '../../components/common/Breadcrumb';

// Cleanup after each test to ensure DOM is clean
afterEach(() => {
  cleanup();
});

// Arbitrary for generating a valid breadcrumb item with unique labels
const breadcrumbItemArb = (index: number): fc.Arbitrary<BreadcrumbItem> =>
  fc.record({
    id: fc.constant(`folder-${index}`),
    label: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,19}$/).map(s => `${s}_${index}`), // Ensure unique labels
  });

// Arbitrary for generating a path of breadcrumb items (1-8 items for reasonable hierarchy depth)
const breadcrumbPathArb = fc.integer({ min: 1, max: 8 }).chain(length =>
  fc.tuple(...Array.from({ length }, (_, i) => breadcrumbItemArb(i)))
);

describe('Breadcrumb Path Display Property Tests', () => {
  it('Property 5: All items in path are displayed in order from root to current', () => {
    fc.assert(
      fc.property(breadcrumbPathArb, (items) => {
        cleanup();
        const { container, unmount } = render(<Breadcrumb items={items} />);
        
        // Get all list items in order
        const listItems = within(container).getByTestId('breadcrumb').querySelectorAll('li');
        
        // Verify we have the correct number of items
        if (listItems.length !== items.length) {
          unmount();
          return false;
        }
        
        // Verify each item is in the correct position
        for (let i = 0; i < items.length; i++) {
          const listItem = listItems[i];
          const textContent = listItem.textContent || '';
          
          // The item's label should be in this list item
          if (!textContent.includes(items[i].label)) {
            unmount();
            return false;
          }
        }
        
        unmount();
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 5: Last item is displayed as current page (non-clickable)', () => {
    fc.assert(
      fc.property(breadcrumbPathArb, (items) => {
        cleanup();
        const { container, unmount } = render(<Breadcrumb items={items} />);
        
        const lastItem = items[items.length - 1];
        const currentElement = within(container).getByTestId('breadcrumb-current');
        
        // Last item should be displayed as current page
        const isCurrentPage = currentElement.textContent === lastItem.label;
        const hasAriaCurrent = currentElement.getAttribute('aria-current') === 'page';
        
        unmount();
        return isCurrentPage && hasAriaCurrent;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 5: Non-last items are clickable buttons', () => {
    fc.assert(
      fc.property(
        breadcrumbPathArb.filter(items => items.length >= 2),
        (items) => {
          cleanup();
          const { container, unmount } = render(<Breadcrumb items={items} />);
          
          // All items except the last should be buttons
          for (let i = 0; i < items.length - 1; i++) {
            const button = within(container).queryByTestId(`breadcrumb-item-${items[i].id}`);
            if (!button || button.tagName !== 'BUTTON') {
              unmount();
              return false;
            }
          }
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });


  it('Property 5: Clicking any breadcrumb item calls its onClick handler', () => {
    fc.assert(
      fc.property(
        breadcrumbPathArb.filter(items => items.length >= 2),
        fc.integer({ min: 0, max: 100 }),
        (baseItems, clickIndex) => {
          cleanup();
          // Create items with onClick handlers
          const clickHandlers = baseItems.map(() => vi.fn());
          const items: BreadcrumbItem[] = baseItems.map((item, i) => ({
            ...item,
            onClick: clickHandlers[i],
          }));
          
          const { container, unmount } = render(<Breadcrumb items={items} />);
          
          // Click on a non-last item (last item is not clickable)
          const targetIndex = clickIndex % (items.length - 1);
          const button = within(container).getByTestId(`breadcrumb-item-${items[targetIndex].id}`);
          fireEvent.click(button);
          
          // Verify the correct handler was called
          const correctHandlerCalled = clickHandlers[targetIndex].mock.calls.length === 1;
          
          // Verify other handlers were not called
          const otherHandlersNotCalled = clickHandlers.every((handler, i) => 
            i === targetIndex || handler.mock.calls.length === 0
          );
          
          unmount();
          return correctHandlerCalled && otherHandlersNotCalled;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: Separators are rendered between items (count = items - 1)', () => {
    fc.assert(
      fc.property(
        breadcrumbPathArb.filter(items => items.length >= 2),
        (items) => {
          cleanup();
          const { container, unmount } = render(<Breadcrumb items={items} />);
          
          // Default separator is '/'
          const separators = within(container).getAllByText('/');
          const expectedSeparatorCount = items.length - 1;
          
          unmount();
          return separators.length === expectedSeparatorCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: Single item path displays only current page without separators', () => {
    fc.assert(
      fc.property(
        breadcrumbItemArb(0),
        (item) => {
          cleanup();
          const { container, unmount } = render(<Breadcrumb items={[item]} />);
          
          // Should have current page element
          const currentElement = within(container).getByTestId('breadcrumb-current');
          const hasCurrentPage = currentElement.textContent === item.label;
          
          // Should not have any separators
          const separators = within(container).queryAllByText('/');
          const noSeparators = separators.length === 0;
          
          // Should not have any clickable buttons
          const button = within(container).queryByTestId(`breadcrumb-item-${item.id}`);
          const noButtons = button === null;
          
          unmount();
          return hasCurrentPage && noSeparators && noButtons;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 5: Empty path renders nothing', () => {
    cleanup();
    const { container } = render(<Breadcrumb items={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
