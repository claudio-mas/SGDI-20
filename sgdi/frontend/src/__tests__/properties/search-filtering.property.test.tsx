/**
 * Property-Based Test for Search Filter Results Matching
 * 
 * Feature: integracao-templates, Property 4: Search Filter Results Matching
 * Validates: Requirements 3.5
 * 
 * Property: For any search query entered in a filterable list (documents),
 * all returned results SHALL contain the search term in their searchable fields,
 * and no results without the search term SHALL be displayed.
 */
import { describe, it, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '../../test/test-utils';
import { DocumentExplorer, ViewMode } from '../../components/documents/DocumentExplorer';
import { DocumentGridItem } from '../../components/documents/DocumentGrid';

// Arbitrary for generating document items with specific names
const documentItemArb = (id: number, name: string): fc.Arbitrary<DocumentGridItem> =>
  fc.record({
    id: fc.constant(`item-${id}`),
    name: fc.constant(name),
    type: fc.constantFrom('file', 'folder') as fc.Arbitrary<'file' | 'folder'>,
    fileType: fc.constantFrom('pdf', 'docx', 'xlsx', 'jpg', 'png', 'folder'),
    size: fc.integer({ min: 100, max: 10000000 }),
    updatedAt: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  });

// Generate a list of document items with random names
const documentItemsWithNamesArb = (): fc.Arbitrary<DocumentGridItem[]> =>
  fc.array(
    fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
    { minLength: 3, maxLength: 15 }
  ).chain(names =>
    fc.tuple(...names.map((name, i) => documentItemArb(i, name)))
  );

// Generate a search query that matches at least one item
const searchQueryArb = fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0);

// Mock folders and path
const mockFolders = [{ id: 'folder-1', name: 'Documents', children: [] }];
const mockPath = [{ id: 'root', name: 'Meus Arquivos' }];

describe('Search Filter Results Matching Property Tests', () => {
  it('Property 4: For any search query, all displayed results SHALL contain the search term (case-insensitive)', () => {
    fc.assert(
      fc.property(
        documentItemsWithNamesArb(),
        searchQueryArb,
        fc.constantFrom('grid', 'list') as fc.Arbitrary<ViewMode>,
        (items, searchQuery, viewMode) => {
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
            />
          );

          // Find the search input and enter the query
          const searchInput = screen.getByPlaceholderText('Buscar arquivos...');
          fireEvent.change(searchInput, { target: { value: searchQuery } });

          // Calculate expected filtered items
          const query = searchQuery.toLowerCase();
          const expectedMatches = items.filter(item => 
            item.name.toLowerCase().includes(query)
          );

          // Check displayed items in grid or list view
          const displayedItemIds: string[] = [];
          
          if (viewMode === 'grid') {
            items.forEach(item => {
              const element = screen.queryByTestId(`grid-item-${item.id}`);
              if (element) {
                displayedItemIds.push(item.id);
              }
            });
          } else {
            // List view uses Table component with table-row-{id} test IDs
            items.forEach(item => {
              const element = screen.queryByTestId(`table-row-${item.id}`);
              if (element) {
                displayedItemIds.push(item.id);
              }
            });
          }

          // Verify: all displayed items should match the search query
          const allDisplayedMatch = displayedItemIds.every(id => {
            const item = items.find(i => i.id === id);
            return item && item.name.toLowerCase().includes(query);
          });

          // Verify: count of displayed items matches expected
          const correctCount = displayedItemIds.length === expectedMatches.length;

          unmount();
          return allDisplayedMatch && correctCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Empty search query SHALL display all items', () => {
    fc.assert(
      fc.property(
        documentItemsWithNamesArb(),
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
            />
          );

          // Search input should be empty by default
          const searchInput = screen.getByPlaceholderText('Buscar arquivos...');
          expect(searchInput).toHaveValue('');

          // Count displayed items
          let displayedCount = 0;
          
          if (viewMode === 'grid') {
            items.forEach(item => {
              if (screen.queryByTestId(`grid-item-${item.id}`)) {
                displayedCount++;
              }
            });
          } else {
            // List view uses Table component with table-row-{id} test IDs
            items.forEach(item => {
              if (screen.queryByTestId(`table-row-${item.id}`)) {
                displayedCount++;
              }
            });
          }

          // All items should be displayed
          const allDisplayed = displayedCount === items.length;

          unmount();
          return allDisplayed;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Clearing search query SHALL restore all items', () => {
    fc.assert(
      fc.property(
        documentItemsWithNamesArb(),
        searchQueryArb,
        fc.constantFrom('grid', 'list') as fc.Arbitrary<ViewMode>,
        (items, searchQuery, viewMode) => {
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
            />
          );

          const searchInput = screen.getByPlaceholderText('Buscar arquivos...');

          // Enter search query
          fireEvent.change(searchInput, { target: { value: searchQuery } });

          // Clear search query
          fireEvent.change(searchInput, { target: { value: '' } });

          // Count displayed items after clearing
          let displayedCount = 0;
          
          if (viewMode === 'grid') {
            items.forEach(item => {
              if (screen.queryByTestId(`grid-item-${item.id}`)) {
                displayedCount++;
              }
            });
          } else {
            // List view uses Table component with table-row-{id} test IDs
            items.forEach(item => {
              if (screen.queryByTestId(`table-row-${item.id}`)) {
                displayedCount++;
              }
            });
          }

          // All items should be displayed after clearing
          const allRestored = displayedCount === items.length;

          unmount();
          return allRestored;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Search is case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('grid', 'list') as fc.Arbitrary<ViewMode>,
        (viewMode) => {
          // Create items with known names for case testing
          const items: DocumentGridItem[] = [
            { id: 'item-0', name: 'Document.PDF', type: 'file', fileType: 'pdf', size: 1000, updatedAt: new Date() },
            { id: 'item-1', name: 'REPORT.docx', type: 'file', fileType: 'docx', size: 2000, updatedAt: new Date() },
            { id: 'item-2', name: 'image.PNG', type: 'file', fileType: 'png', size: 3000, updatedAt: new Date() },
          ];

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
            />
          );

          const searchInput = screen.getByPlaceholderText('Buscar arquivos...');

          // Search with lowercase
          fireEvent.change(searchInput, { target: { value: 'document' } });

          // Should find 'Document.PDF'
          const testId = viewMode === 'grid' ? 'grid-item-item-0' : 'table-row-item-0';
          const foundLowercase = screen.queryByTestId(testId) !== null;

          // Search with uppercase
          fireEvent.change(searchInput, { target: { value: 'DOCUMENT' } });
          const foundUppercase = screen.queryByTestId(testId) !== null;

          // Search with mixed case
          fireEvent.change(searchInput, { target: { value: 'DoCuMeNt' } });
          const foundMixedCase = screen.queryByTestId(testId) !== null;

          unmount();
          return foundLowercase && foundUppercase && foundMixedCase;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: No results without search term SHALL be displayed', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('grid', 'list') as fc.Arbitrary<ViewMode>,
        (viewMode) => {
          // Create items with distinct names
          const items: DocumentGridItem[] = [
            { id: 'item-0', name: 'Alpha.pdf', type: 'file', fileType: 'pdf', size: 1000, updatedAt: new Date() },
            { id: 'item-1', name: 'Beta.docx', type: 'file', fileType: 'docx', size: 2000, updatedAt: new Date() },
            { id: 'item-2', name: 'Gamma.xlsx', type: 'file', fileType: 'xlsx', size: 3000, updatedAt: new Date() },
            { id: 'item-3', name: 'Delta.png', type: 'file', fileType: 'png', size: 4000, updatedAt: new Date() },
          ];

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
            />
          );

          const searchInput = screen.getByPlaceholderText('Buscar arquivos...');

          // Search for 'Alpha' - should only show item-0
          fireEvent.change(searchInput, { target: { value: 'Alpha' } });

          const prefix = viewMode === 'grid' ? 'grid-item-' : 'table-row-';
          
          const alphaVisible = screen.queryByTestId(`${prefix}item-0`) !== null;
          const betaHidden = screen.queryByTestId(`${prefix}item-1`) === null;
          const gammaHidden = screen.queryByTestId(`${prefix}item-2`) === null;
          const deltaHidden = screen.queryByTestId(`${prefix}item-3`) === null;

          unmount();
          return alphaVisible && betaHidden && gammaHidden && deltaHidden;
        }
      ),
      { numRuns: 100 }
    );
  });
});
