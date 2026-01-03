/**
 * Property-Based Test for View Mode Toggle
 * 
 * Feature: integracao-templates, Property 2: View Mode Toggle
 * Validates: Requirements 3.3
 * 
 * Property: For any current view mode (grid or list) in DocumentExplorer_Component,
 * clicking the view toggle SHALL switch to the opposite mode.
 */
import { describe, it, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '../../test/test-utils';
import { DocumentExplorer, ViewMode } from '../../components/documents/DocumentExplorer';

// Mock data for DocumentExplorer
const mockFolders = [
  { id: 'folder-1', name: 'Documents', children: [] },
];

const mockItems = [
  { id: 'item-1', name: 'File 1.pdf', type: 'file' as const, fileType: 'pdf', size: 1024, updatedAt: new Date() },
];

const mockPath = [{ id: 'root', name: 'Meus Arquivos' }];

// Arbitrary for view mode
const viewModeArb = fc.constantFrom('grid', 'list') as fc.Arbitrary<ViewMode>;

describe('View Mode Toggle Property Tests', () => {
  it('Property 2: For any current view mode, clicking the opposite toggle switches to that mode', () => {
    fc.assert(
      fc.property(viewModeArb, (initialViewMode) => {
        let currentViewMode = initialViewMode;
        const handleViewModeChange = vi.fn((mode: ViewMode) => {
          currentViewMode = mode;
        });

        const { unmount } = render(
          <DocumentExplorer
            folders={mockFolders}
            items={mockItems}
            currentPath={mockPath}
            viewMode={initialViewMode}
            onViewModeChange={handleViewModeChange}
            onFolderSelect={vi.fn()}
            onDocumentSelect={vi.fn()}
            onNavigate={vi.fn()}
          />
        );

        // Determine which button to click (the opposite of current mode)
        const oppositeMode = initialViewMode === 'grid' ? 'list' : 'grid';
        const buttonTestId = oppositeMode === 'grid' ? 'btn-view-grid' : 'btn-view-list';
        
        const toggleButton = screen.getByTestId(buttonTestId);
        fireEvent.click(toggleButton);

        // Verify the callback was called with the opposite mode
        const wasCalledWithOppositeMode = handleViewModeChange.mock.calls.length === 1 &&
          handleViewModeChange.mock.calls[0][0] === oppositeMode;

        unmount();
        return wasCalledWithOppositeMode;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Clicking the current mode button calls onViewModeChange with same mode', () => {
    fc.assert(
      fc.property(viewModeArb, (initialViewMode) => {
        const handleViewModeChange = vi.fn();

        const { unmount } = render(
          <DocumentExplorer
            folders={mockFolders}
            items={mockItems}
            currentPath={mockPath}
            viewMode={initialViewMode}
            onViewModeChange={handleViewModeChange}
            onFolderSelect={vi.fn()}
            onDocumentSelect={vi.fn()}
            onNavigate={vi.fn()}
          />
        );

        // Click the button for the current mode
        const buttonTestId = initialViewMode === 'grid' ? 'btn-view-grid' : 'btn-view-list';
        const toggleButton = screen.getByTestId(buttonTestId);
        fireEvent.click(toggleButton);

        // Verify the callback was called with the same mode
        const wasCalledWithSameMode = handleViewModeChange.mock.calls.length === 1 &&
          handleViewModeChange.mock.calls[0][0] === initialViewMode;

        unmount();
        return wasCalledWithSameMode;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: View mode toggle buttons have correct aria-pressed state', () => {
    fc.assert(
      fc.property(viewModeArb, (viewMode) => {
        const { unmount } = render(
          <DocumentExplorer
            folders={mockFolders}
            items={mockItems}
            currentPath={mockPath}
            viewMode={viewMode}
            onViewModeChange={vi.fn()}
            onFolderSelect={vi.fn()}
            onDocumentSelect={vi.fn()}
            onNavigate={vi.fn()}
          />
        );

        const gridButton = screen.getByTestId('btn-view-grid');
        const listButton = screen.getByTestId('btn-view-list');

        // Verify aria-pressed reflects the current view mode
        const gridPressed = gridButton.getAttribute('aria-pressed') === 'true';
        const listPressed = listButton.getAttribute('aria-pressed') === 'true';

        const correctAriaState = viewMode === 'grid' 
          ? (gridPressed && !listPressed)
          : (!gridPressed && listPressed);

        unmount();
        return correctAriaState;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Toggling view mode multiple times alternates correctly', () => {
    fc.assert(
      fc.property(
        viewModeArb,
        fc.integer({ min: 1, max: 10 }),
        (initialViewMode, toggleCount) => {
          const viewModeHistory: ViewMode[] = [initialViewMode];
          const handleViewModeChange = vi.fn((mode: ViewMode) => {
            viewModeHistory.push(mode);
          });

          const { rerender, unmount } = render(
            <DocumentExplorer
              folders={mockFolders}
              items={mockItems}
              currentPath={mockPath}
              viewMode={initialViewMode}
              onViewModeChange={handleViewModeChange}
              onFolderSelect={vi.fn()}
              onDocumentSelect={vi.fn()}
              onNavigate={vi.fn()}
            />
          );

          let currentMode = initialViewMode;
          
          // Perform multiple toggles
          for (let i = 0; i < toggleCount; i++) {
            const oppositeMode = currentMode === 'grid' ? 'list' : 'grid';
            const buttonTestId = oppositeMode === 'grid' ? 'btn-view-grid' : 'btn-view-list';
            
            const toggleButton = screen.getByTestId(buttonTestId);
            fireEvent.click(toggleButton);
            
            // Simulate parent component updating the viewMode prop
            currentMode = oppositeMode;
            rerender(
              <DocumentExplorer
                folders={mockFolders}
                items={mockItems}
                currentPath={mockPath}
                viewMode={currentMode}
                onViewModeChange={handleViewModeChange}
                onFolderSelect={vi.fn()}
                onDocumentSelect={vi.fn()}
                onNavigate={vi.fn()}
              />
            );
          }

          // Verify the callback was called the correct number of times
          const correctCallCount = handleViewModeChange.mock.calls.length === toggleCount;

          // Verify each toggle switched to the opposite mode
          let allTogglesCorrect = true;
          for (let i = 0; i < toggleCount; i++) {
            const expectedMode = i % 2 === 0 
              ? (initialViewMode === 'grid' ? 'list' : 'grid')
              : initialViewMode;
            if (handleViewModeChange.mock.calls[i][0] !== expectedMode) {
              allTogglesCorrect = false;
              break;
            }
          }

          unmount();
          return correctCallCount && allTogglesCorrect;
        }
      ),
      { numRuns: 100 }
    );
  });
});
