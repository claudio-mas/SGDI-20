/**
 * Property-Based Test for Workflow Connection Rendering
 * 
 * Feature: integracao-templates, Property 9: Workflow Connection Rendering
 * Validates: Requirements 10.3
 * 
 * Property: For any two connected nodes in WorkflowEditor_Component, a visual connection
 * (arrow/line) SHALL be rendered between them, and the connection SHALL update position
 * when either node is moved.
 */
import { describe, it, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '../../test/test-utils';
import WorkflowCanvas from '../../components/workflow/WorkflowCanvas';
import { WorkflowNode, WorkflowConnection, WorkflowNodeType } from '../../types';

// Arbitrary for node types
const nodeTypeArb = fc.constantFrom<WorkflowNodeType>(
  'start', 'review', 'approval', 'condition', 'publication', 'email', 'end'
);

// Arbitrary for position
const positionArb = fc.record({
  x: fc.integer({ min: 50, max: 500 }),
  y: fc.integer({ min: 50, max: 500 }),
});

// Arbitrary for generating a workflow node
const workflowNodeArb = (id: string): fc.Arbitrary<WorkflowNode> =>
  fc.record({
    id: fc.constant(id),
    type: nodeTypeArb,
    name: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
    position: positionArb,
    config: fc.constant({}),
  });

// Arbitrary for generating a pair of connected nodes
const connectedNodePairArb = fc.tuple(
  workflowNodeArb('node-1'),
  workflowNodeArb('node-2')
).map(([node1, node2]) => {
  // Ensure nodes don't overlap
  if (Math.abs(node1.position.x - node2.position.x) < 100) {
    node2.position.x = node1.position.x + 150;
  }
  if (Math.abs(node1.position.y - node2.position.y) < 50) {
    node2.position.y = node1.position.y + 100;
  }
  return [node1, node2] as [WorkflowNode, WorkflowNode];
});

// Arbitrary for connection label
const connectionLabelArb = fc.option(fc.constantFrom('Sim', 'Não', 'Aprovado', 'Rejeitado'), { nil: undefined });

// Arbitrary for connection condition
const connectionConditionArb = fc.option(
  fc.constantFrom<'approved' | 'rejected' | 'yes' | 'no'>('approved', 'rejected', 'yes', 'no'),
  { nil: undefined }
);

describe('Workflow Connection Rendering Property Tests', () => {
  const defaultProps = {
    zoom: 100,
    onNodeSelect: vi.fn(),
    onNodeMove: vi.fn(),
    onNodeDrop: vi.fn(),
    onConnectionClick: vi.fn(),
  };

  it('Property 9: For any two connected nodes, a visual connection path is rendered', () => {
    fc.assert(
      fc.property(
        connectedNodePairArb,
        connectionLabelArb,
        connectionConditionArb,
        ([node1, node2], label, condition) => {
          const nodes: WorkflowNode[] = [node1, node2];
          const connection: WorkflowConnection = {
            id: 'conn-1',
            from: node1.id,
            to: node2.id,
            label,
            condition,
          };
          const connections: WorkflowConnection[] = [connection];

          const { container, unmount } = render(
            <WorkflowCanvas
              {...defaultProps}
              nodes={nodes}
              connections={connections}
            />
          );

          // Check that an SVG path element exists for the connection
          const svgPaths = container.querySelectorAll('svg path');
          const hasConnectionPath = svgPaths.length > 0;

          // Verify the path has the expected stroke attributes
          let hasValidPath = false;
          svgPaths.forEach(path => {
            const d = path.getAttribute('d');
            const stroke = path.getAttribute('stroke');
            if (d && d.includes('M') && d.includes('C') && stroke) {
              hasValidPath = true;
            }
          });

          unmount();
          return hasConnectionPath && hasValidPath;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 9: Connection path contains bezier curve from source to target node', () => {
    fc.assert(
      fc.property(connectedNodePairArb, ([node1, node2]) => {
        const nodes: WorkflowNode[] = [node1, node2];
        const connection: WorkflowConnection = {
          id: 'conn-1',
          from: node1.id,
          to: node2.id,
        };
        const connections: WorkflowConnection[] = [connection];

        const { container, unmount } = render(
          <WorkflowCanvas
            {...defaultProps}
            nodes={nodes}
            connections={connections}
          />
        );

        // Get the SVG path
        const svgPath = container.querySelector('svg path');
        const pathD = svgPath?.getAttribute('d') || '';

        // Path should start with M (moveto) and contain C (curveto) for bezier
        const hasMoveTo = pathD.startsWith('M');
        const hasCurveTo = pathD.includes('C');

        // Extract coordinates from path - format: M x1 y1 C cx1 cy1, cx2 cy2, x2 y2
        const pathValid = hasMoveTo && hasCurveTo;

        unmount();
        return pathValid;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 9: Connection with label renders label element', () => {
    fc.assert(
      fc.property(
        connectedNodePairArb,
        fc.constantFrom('Sim', 'Não', 'Aprovado'),
        ([node1, node2], label) => {
          const nodes: WorkflowNode[] = [node1, node2];
          const connection: WorkflowConnection = {
            id: 'conn-1',
            from: node1.id,
            to: node2.id,
            label,
          };
          const connections: WorkflowConnection[] = [connection];

          const { container, unmount } = render(
            <WorkflowCanvas
              {...defaultProps}
              nodes={nodes}
              connections={connections}
            />
          );

          // Check that the label text is rendered in the SVG
          const svgText = container.querySelector('svg text');
          const hasLabel = svgText?.textContent === label;

          // Check that label has a background rect
          const labelRect = container.querySelector('svg g rect');
          const hasLabelBackground = labelRect !== null;

          unmount();
          return hasLabel && hasLabelBackground;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 9: Connection without label does not render label element', () => {
    fc.assert(
      fc.property(connectedNodePairArb, ([node1, node2]) => {
        const nodes: WorkflowNode[] = [node1, node2];
        const connection: WorkflowConnection = {
          id: 'conn-1',
          from: node1.id,
          to: node2.id,
          // No label
        };
        const connections: WorkflowConnection[] = [connection];

        const { container, unmount } = render(
          <WorkflowCanvas
            {...defaultProps}
            nodes={nodes}
            connections={connections}
          />
        );

        // Check that no label text is rendered (only defs marker text might exist)
        const svgTexts = container.querySelectorAll('svg text');
        const hasNoLabelText = svgTexts.length === 0;

        unmount();
        return hasNoLabelText;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 9: Multiple connections render multiple paths', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }),
        (connectionCount) => {
          // Create a chain of nodes
          const nodes: WorkflowNode[] = [];
          const connections: WorkflowConnection[] = [];

          for (let i = 0; i <= connectionCount; i++) {
            nodes.push({
              id: `node-${i}`,
              type: i === 0 ? 'start' : i === connectionCount ? 'end' : 'approval',
              name: `Node ${i}`,
              position: { x: 100 + i * 150, y: 100 + (i % 2) * 100 },
              config: {},
            });
          }

          for (let i = 0; i < connectionCount; i++) {
            connections.push({
              id: `conn-${i}`,
              from: `node-${i}`,
              to: `node-${i + 1}`,
            });
          }

          const { container, unmount } = render(
            <WorkflowCanvas
              {...defaultProps}
              nodes={nodes}
              connections={connections}
            />
          );

          // Count the number of path elements (excluding marker paths)
          const svgPaths = container.querySelectorAll('svg > g > path, svg > path');
          // Filter to only connection paths (those with stroke attribute)
          const connectionPaths = Array.from(svgPaths).filter(
            path => path.getAttribute('stroke') && path.getAttribute('d')?.includes('C')
          );

          const hasCorrectPathCount = connectionPaths.length === connectionCount;

          unmount();
          return hasCorrectPathCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 9: Connection path has arrowhead marker', () => {
    fc.assert(
      fc.property(connectedNodePairArb, ([node1, node2]) => {
        const nodes: WorkflowNode[] = [node1, node2];
        const connection: WorkflowConnection = {
          id: 'conn-1',
          from: node1.id,
          to: node2.id,
        };
        const connections: WorkflowConnection[] = [connection];

        const { container, unmount } = render(
          <WorkflowCanvas
            {...defaultProps}
            nodes={nodes}
            connections={connections}
          />
        );

        // Check that the arrowhead marker is defined
        const marker = container.querySelector('svg defs marker#arrowhead');
        const hasMarkerDef = marker !== null;

        // Check that the path references the marker
        const svgPath = container.querySelector('svg path');
        const markerEnd = svgPath?.getAttribute('marker-end');
        const hasMarkerRef = markerEnd === 'url(#arrowhead)';

        unmount();
        return hasMarkerDef && hasMarkerRef;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 9: Connection is clickable and triggers callback', () => {
    fc.assert(
      fc.property(connectedNodePairArb, ([node1, node2]) => {
        const onConnectionClick = vi.fn();
        const nodes: WorkflowNode[] = [node1, node2];
        const connection: WorkflowConnection = {
          id: 'conn-test-click',
          from: node1.id,
          to: node2.id,
        };
        const connections: WorkflowConnection[] = [connection];

        const { container, unmount } = render(
          <WorkflowCanvas
            {...defaultProps}
            nodes={nodes}
            connections={connections}
            onConnectionClick={onConnectionClick}
          />
        );

        // Find and click the connection path
        const svgPath = container.querySelector('svg path[stroke]');
        if (svgPath) {
          fireEvent.click(svgPath);
        }

        const wasClicked = onConnectionClick.mock.calls.length === 1 &&
          onConnectionClick.mock.calls[0][0] === 'conn-test-click';

        unmount();
        return wasClicked;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 9: Invalid connection (missing node) does not render path', () => {
    fc.assert(
      fc.property(workflowNodeArb('node-1'), (node1) => {
        const nodes: WorkflowNode[] = [node1];
        // Connection references a non-existent node
        const connection: WorkflowConnection = {
          id: 'conn-invalid',
          from: node1.id,
          to: 'non-existent-node',
        };
        const connections: WorkflowConnection[] = [connection];

        const { container, unmount } = render(
          <WorkflowCanvas
            {...defaultProps}
            nodes={nodes}
            connections={connections}
          />
        );

        // Should not render any connection paths (only marker defs might exist)
        const svgPaths = container.querySelectorAll('svg path[stroke]');
        const connectionPaths = Array.from(svgPaths).filter(
          path => path.getAttribute('d')?.includes('C')
        );
        const hasNoInvalidPaths = connectionPaths.length === 0;

        unmount();
        return hasNoInvalidPaths;
      }),
      { numRuns: 100 }
    );
  });
});
