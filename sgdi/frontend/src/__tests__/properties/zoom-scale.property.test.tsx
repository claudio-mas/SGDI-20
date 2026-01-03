/**
 * Property-Based Test for Zoom Scale Adjustment
 * 
 * Feature: integracao-templates, Property 6: Zoom Scale Adjustment
 * Validates: Requirements 4.2
 * 
 * Property: For any zoom action (in or out) in DocumentViewer_Component,
 * the document display scale SHALL increase or decrease by a consistent increment,
 * staying within valid bounds (e.g., 25% to 400%).
 */
import { describe, it, vi, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '../../test/test-utils';
import { DocumentViewer, DocumentInfo } from '../../components/documents/DocumentViewer';

// Constants matching the component defaults
const DEFAULT_MIN_ZOOM = 25;
const DEFAULT_MAX_ZOOM = 400;
const DEFAULT_ZOOM_STEP = 25;

// Mock document for testing
const createMockDocument = (): DocumentInfo => ({
  id: 'doc-1',
  name: 'Test Document.pdf',
  type: 'pdf',
  size: 1024 * 1024,
  status: 'draft',
  owner: { id: 'user-1', name: 'Test User' },
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
  totalPages: 5,
});

// Arbitrary for valid zoom levels (multiples of step within bounds)
const validZoomArb = fc.integer({ min: 1, max: 16 }).map(n => n * DEFAULT_ZOOM_STEP);

// Arbitrary for zoom configuration
const zoomConfigArb = fc.record({
  minZoom: fc.constantFrom(25, 50),
  maxZoom: fc.constantFrom(200, 300, 400),
  zoomStep: fc.constantFrom(10, 25, 50),
});

describe('Zoom Scale Adjustment Property Tests', () => {
  it('Property 6: Zoom in increases zoom by exactly zoomStep until maxZoom', () => {
    fc.assert(
      fc.property(validZoomArb, (initialZoom) => {
        const onZoomChange = vi.fn();
        const mockDocument = createMockDocument();

        const { unmount } = render(
          <DocumentViewer
            document={mockDocument}
            initialZoom={initialZoom}
            onZoomChange={onZoomChange}
          />
        );

        const zoomInBtn = screen.getByTestId('zoom-in-btn');
        fireEvent.click(zoomInBtn);

        const expectedZoom = Math.min(initialZoom + DEFAULT_ZOOM_STEP, DEFAULT_MAX_ZOOM);
        
        // If we're already at max, no change should occur
        if (initialZoom >= DEFAULT_MAX_ZOOM) {
          // onZoomChange is still called but with the clamped value
          expect(onZoomChange).toHaveBeenCalledWith(DEFAULT_MAX_ZOOM);
        } else {
          expect(onZoomChange).toHaveBeenCalledWith(expectedZoom);
        }

        unmount();
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 6: Zoom out decreases zoom by exactly zoomStep until minZoom', () => {
    fc.assert(
      fc.property(validZoomArb, (initialZoom) => {
        const onZoomChange = vi.fn();
        const mockDocument = createMockDocument();

        const { unmount } = render(
          <DocumentViewer
            document={mockDocument}
            initialZoom={initialZoom}
            onZoomChange={onZoomChange}
          />
        );

        const zoomOutBtn = screen.getByTestId('zoom-out-btn');
        fireEvent.click(zoomOutBtn);

        const expectedZoom = Math.max(initialZoom - DEFAULT_ZOOM_STEP, DEFAULT_MIN_ZOOM);
        
        // If we're already at min, no change should occur
        if (initialZoom <= DEFAULT_MIN_ZOOM) {
          expect(onZoomChange).toHaveBeenCalledWith(DEFAULT_MIN_ZOOM);
        } else {
          expect(onZoomChange).toHaveBeenCalledWith(expectedZoom);
        }

        unmount();
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 6: Zoom level display shows correct percentage', () => {
    fc.assert(
      fc.property(validZoomArb, (initialZoom) => {
        const mockDocument = createMockDocument();

        const { unmount } = render(
          <DocumentViewer
            document={mockDocument}
            initialZoom={initialZoom}
          />
        );

        const zoomLevel = screen.getByTestId('zoom-level');
        const displayedZoom = zoomLevel.textContent;

        unmount();
        return displayedZoom === `${initialZoom}%`;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 6: Zoom stays within bounds after multiple zoom-in clicks', () => {
    fc.assert(
      fc.property(
        validZoomArb,
        fc.integer({ min: 1, max: 20 }),
        (initialZoom, clickCount) => {
          let currentZoom = initialZoom;
          const onZoomChange = vi.fn((zoom: number) => {
            currentZoom = zoom;
          });
          const mockDocument = createMockDocument();

          const { rerender, unmount } = render(
            <DocumentViewer
              document={mockDocument}
              initialZoom={initialZoom}
              onZoomChange={onZoomChange}
            />
          );

          // Click zoom in multiple times
          for (let i = 0; i < clickCount; i++) {
            const zoomInBtn = screen.getByTestId('zoom-in-btn');
            fireEvent.click(zoomInBtn);
            
            // Rerender with updated zoom
            rerender(
              <DocumentViewer
                document={mockDocument}
                initialZoom={currentZoom}
                onZoomChange={onZoomChange}
              />
            );
          }

          // Verify zoom never exceeds maxZoom
          const finalZoom = currentZoom;
          
          unmount();
          return finalZoom <= DEFAULT_MAX_ZOOM && finalZoom >= DEFAULT_MIN_ZOOM;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Zoom stays within bounds after multiple zoom-out clicks', () => {
    fc.assert(
      fc.property(
        validZoomArb,
        fc.integer({ min: 1, max: 20 }),
        (initialZoom, clickCount) => {
          let currentZoom = initialZoom;
          const onZoomChange = vi.fn((zoom: number) => {
            currentZoom = zoom;
          });
          const mockDocument = createMockDocument();

          const { rerender, unmount } = render(
            <DocumentViewer
              document={mockDocument}
              initialZoom={initialZoom}
              onZoomChange={onZoomChange}
            />
          );

          // Click zoom out multiple times
          for (let i = 0; i < clickCount; i++) {
            const zoomOutBtn = screen.getByTestId('zoom-out-btn');
            fireEvent.click(zoomOutBtn);
            
            // Rerender with updated zoom
            rerender(
              <DocumentViewer
                document={mockDocument}
                initialZoom={currentZoom}
                onZoomChange={onZoomChange}
              />
            );
          }

          // Verify zoom never goes below minZoom
          const finalZoom = currentZoom;
          
          unmount();
          return finalZoom >= DEFAULT_MIN_ZOOM && finalZoom <= DEFAULT_MAX_ZOOM;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Custom zoom bounds are respected', () => {
    fc.assert(
      fc.property(zoomConfigArb, (config) => {
        const { minZoom, maxZoom, zoomStep } = config;
        
        // Start at a valid zoom level within bounds
        const initialZoom = Math.max(minZoom, Math.min(100, maxZoom));
        
        let currentZoom = initialZoom;
        const onZoomChange = vi.fn((zoom: number) => {
          currentZoom = zoom;
        });
        const mockDocument = createMockDocument();

        const { unmount } = render(
          <DocumentViewer
            document={mockDocument}
            initialZoom={initialZoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            zoomStep={zoomStep}
            onZoomChange={onZoomChange}
          />
        );

        // Test zoom in
        const zoomInBtn = screen.getByTestId('zoom-in-btn');
        fireEvent.click(zoomInBtn);

        const expectedZoomIn = Math.min(initialZoom + zoomStep, maxZoom);
        const zoomInCorrect = currentZoom === expectedZoomIn;

        unmount();
        return zoomInCorrect;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 6: Zoom increment is consistent regardless of current zoom level', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 14 }).map(n => n * DEFAULT_ZOOM_STEP), // Avoid boundary cases
        (initialZoom) => {
          const onZoomChange = vi.fn();
          const mockDocument = createMockDocument();

          const { unmount } = render(
            <DocumentViewer
              document={mockDocument}
              initialZoom={initialZoom}
              onZoomChange={onZoomChange}
            />
          );

          const zoomInBtn = screen.getByTestId('zoom-in-btn');
          fireEvent.click(zoomInBtn);

          // The increment should always be exactly zoomStep
          const newZoom = onZoomChange.mock.calls[0][0];
          const increment = newZoom - initialZoom;

          unmount();
          return increment === DEFAULT_ZOOM_STEP;
        }
      ),
      { numRuns: 100 }
    );
  });
});
