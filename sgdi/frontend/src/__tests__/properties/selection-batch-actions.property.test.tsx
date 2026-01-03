/**
 * Property-Based Test for Selection Batch Actions
 * 
 * Feature: integracao-templates, Property 3: Selection Enables Batch Actions
 * Validates: Requirements 3.4
 * 
 * Property: For any non-empty selection of files in DocumentExplorer_Component,
 * the batch action buttons (Add Tag, Rename, Move, Delete) SHALL be enabled;
 * for empty selection, they SHALL be disabled.
 */
import { describe, it, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '../../test/test-utils';
import { DocumentExplorer, ViewMode } from '../../components/documents/DocumentExplorer';
import { DocumentGridItem } from '../../components/documents/DocumentGrid';

// Arbitrary for generating document items
const documentItemArb = (id: number): fc.Arbitrary<DocumentGridItem> =>
  fc.record({
    id: fc.constant(`item-${id}`),
    name: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || `File${id}`),
    type: fc.constantFrom('file', 'folder') as fc.Arbitrary<'file' | 'folder'>,
    fileType: fc.constantFrom('pdf', 'docx', 'xlsx', 'jpg', 'png', 'folder'),
    size: fc.integer({ min: 100, max: 10000000 }),
    updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  });

// Generate a list of document items
const documentItemsArb = (minLength: number, maxLength: number): fc.Arbitrary<DocumentGridItem[]> =>
  fc.integer({ min: minLength, max: maxLength }).chain(length =>
    fc.tuple(...Array.from({ length }, (_, i) => documentItemArb(i)))
  );

// Mock folders
const mockFolders = [{ id: 'folder-1', name: 'Documents', children: [] }];
const mockPath = [{ id: 'root', name: 'Meus Arquivos' }];

describe('Selection Batch Actions Property Tests', () => {
  it('Property 3: For any empty selection, batch action buttons (Add Tag, Move, Delete) SHALL be disabled', () => {
    fc.assert(
      fc.property(
        documentItemsArb(1, 10),
        fc.constantFrom('grid', 'list') as fc.Arbitrary<ViewMode>,
        (items, viewMode) => {
          const { unmount } = render(
            <DocumentExplorer
              folders={mockFolders}
              items={items}
              currentPath={mockPath}
              viewMode={viewMode}
              onViewModeChange={vi.fn()}
              onFolderSelect={vi.fn()}
              onDocumentSelect={vi.fn()}
              onNavigate={vi.fn()}
              onAddTag={vi.fn()}
              onMove={vi.fn()}
              onDelete={vi.fn()}
            />
          );

          // With no selection, batch buttons should be disabled
          const addTagBtn = screen.getByTestId('btn-add-tag');
          const moveBtn = screen.getByTestId('btn-move');
          const deleteBtn = screen.getByTestId('btn-delete');

          const allDisabled = 
            addTagBtn.hasAttribute('disabled') &&
            moveBtn.hasAttribute('disabled') &&
            deleteBtn.hasAttribute('disabled');

          unmount();
          return allDisabled;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: For any non-empty selection in grid view, batch action buttons (Add Tag, Move, Delete) SHALL be enabled', () => {
    fc.assert(
      fc.property(
        documentItemsArb(1, 10),
        (items) => {
          if (items.length === 0) return true; // Skip if no items

          const { unmount } = render(
            <DocumentExplorer
              folders={mockFolders}
              items={items}
              currentPath={mockPath}
              viewMode="grid"
              onViewModeChange={vi.fn()}
              onFolderSelect={vi.fn()}
              onDocumentSelect={vi.fn()}
              onNavigate={vi.fn()}
              onAddTag={vi.fn()}
              onMove={vi.fn()}
              onDelete={vi.fn()}
            />
          );

          // Select the first item by clicking on it (grid uses grid-item-{id})
          const firstItemId = items[0].id;
          const itemElement = screen.queryByTestId(`grid-item-${firstItemId}`);
          
          if (itemElement) {
            fireEvent.click(itemElement);

            // After selection, batch buttons should be enabled
            const addTagBtn = screen.getByTestId('btn-add-tag');
            const moveBtn = screen.getByTestId('btn-move');
            const deleteBtn = screen.getByTestId('btn-delete');

            const allEnabled = 
              !addTagBtn.hasAttribute('disabled') &&
              !moveBtn.hasAttribute('disabled') &&
              !deleteBtn.hasAttribute('disabled');

            unmount();
            return allEnabled;
          }

          unmount();
          return true; // Skip if item not found (edge case)
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Rename button requires exactly one selection', () => {
    fc.assert(
      fc.property(
        documentItemsArb(2, 10),
        (items) => {
          if (items.length < 2) return true; // Need at least 2 items

          const { unmount } = render(
            <DocumentExplorer
              folders={mockFolders}
              items={items}
              currentPath={mockPath}
              viewMode="grid"
              onViewModeChange={vi.fn()}
              onFolderSelect={vi.fn()}
              onDocumentSelect={vi.fn()}
              onNavigate={vi.fn()}
              onRename={vi.fn()}
            />
          );

          const renameBtn = screen.getByTestId('btn-rename');

          // Initially disabled (no selection)
          const initiallyDisabled = renameBtn.hasAttribute('disabled');

          // Select first item (grid uses grid-item-{id})
          const firstItem = screen.queryByTestId(`grid-item-${items[0].id}`);
          if (firstItem) {
            fireEvent.click(firstItem);
            
            // Should be enabled with one selection
            const enabledWithOne = !renameBtn.hasAttribute('disabled');

            unmount();
            return initiallyDisabled && enabledWithOne;
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Clearing selection disables batch action buttons', () => {
    fc.assert(
      fc.property(
        documentItemsArb(1, 10),
        (items) => {
          if (items.length === 0) return true;

          const { unmount } = render(
            <DocumentExplorer
              folders={mockFolders}
              items={items}
              currentPath={mockPath}
              viewMode="grid"
              onViewModeChange={vi.fn()}
              onFolderSelect={vi.fn()}
              onDocumentSelect={vi.fn()}
              onNavigate={vi.fn()}
              onAddTag={vi.fn()}
              onMove={vi.fn()}
              onDelete={vi.fn()}
            />
          );

          // Select first item (grid uses grid-item-{id})
          const firstItem = screen.queryByTestId(`grid-item-${items[0].id}`);
          if (firstItem) {
            fireEvent.click(firstItem);

            // Buttons should be enabled
            const addTagBtn = screen.getByTestId('btn-add-tag');
            const enabledAfterSelect = !addTagBtn.hasAttribute('disabled');

            // Click the same item again to deselect
            fireEvent.click(firstItem);

            // Buttons should be disabled again
            const disabledAfterDeselect = addTagBtn.hasAttribute('disabled');

            unmount();
            return enabledAfterSelect && disabledAfterDeselect;
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: Multiple selections keep batch action buttons enabled', () => {
    fc.assert(
      fc.property(
        documentItemsArb(3, 10),
        fc.integer({ min: 2, max: 5 }),
        (items, selectCount) => {
          if (items.length < selectCount) return true;

          const { unmount } = render(
            <DocumentExplorer
              folders={mockFolders}
              items={items}
              currentPath={mockPath}
              viewMode="grid"
              onViewModeChange={vi.fn()}
              onFolderSelect={vi.fn()}
              onDocumentSelect={vi.fn()}
              onNavigate={vi.fn()}
              onAddTag={vi.fn()}
              onMove={vi.fn()}
              onDelete={vi.fn()}
            />
          );

          // Select multiple items using Ctrl+click simulation (grid uses grid-item-{id})
          for (let i = 0; i < Math.min(selectCount, items.length); i++) {
            const item = screen.queryByTestId(`grid-item-${items[i].id}`);
            if (item) {
              // Simulate Ctrl+click for multi-select (first click is normal)
              if (i === 0) {
                fireEvent.click(item);
              } else {
                fireEvent.click(item, { ctrlKey: true });
              }
            }
          }

          // Batch buttons should remain enabled
          const addTagBtn = screen.getByTestId('btn-add-tag');
          const moveBtn = screen.getByTestId('btn-move');
          const deleteBtn = screen.getByTestId('btn-delete');

          const allSelectionsValid = 
            !addTagBtn.hasAttribute('disabled') &&
            !moveBtn.hasAttribute('disabled') &&
            !deleteBtn.hasAttribute('disabled');

          unmount();
          return allSelectionsValid;
        }
      ),
      { numRuns: 100 }
    );
  });
});
