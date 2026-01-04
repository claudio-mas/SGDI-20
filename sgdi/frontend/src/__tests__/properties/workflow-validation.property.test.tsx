/**
 * Property-Based Test for Workflow Structure Validation
 * 
 * Feature: integracao-templates, Property 10: Workflow Structure Validation
 * Validates: Requirements 10.5
 * 
 * Property: For any workflow submitted for save, the WorkflowEditor_Component SHALL validate that:
 * (a) exactly one Start node exists
 * (b) at least one End node exists
 * (c) all nodes except End have at least one outgoing connection
 * (d) all nodes except Start have at least one incoming connection
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { validateWorkflow } from '../../components/workflow/WorkflowEditor';
import { WorkflowNode, WorkflowConnection } from '../../types';

// Arbitrary for non-terminal node types (not start or end)
const middleNodeTypeArb = fc.constantFrom(
  'review', 'approval', 'condition', 'publication', 'email'
) as fc.Arbitrary<WorkflowNode['type']>;

// Generate a unique ID
const generateId = (prefix: string, index: number) => `${prefix}_${index}`;

describe('Workflow Structure Validation Property Tests', () => {
  /**
   * Property 10a: Exactly one Start node must exist
   */
  describe('Property 10a: Start node validation', () => {
    it('validates that workflow with no start node produces error', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (nodeCount) => {
            // Create nodes without any start node
            const nodes: WorkflowNode[] = [];
            for (let i = 0; i < nodeCount; i++) {
              nodes.push({
                id: generateId('node', i),
                type: i === nodeCount - 1 ? 'end' : 'approval',
                name: `Node ${i}`,
                position: { x: 100 + i * 150, y: 100 },
                config: {},
              });
            }

            const connections: WorkflowConnection[] = [];
            for (let i = 0; i < nodeCount - 1; i++) {
              connections.push({
                id: generateId('conn', i),
                from: generateId('node', i),
                to: generateId('node', i + 1),
              });
            }

            const errors = validateWorkflow(nodes, connections);
            const hasStartError = errors.some(e => 
              e.message.toLowerCase().includes('início') || 
              e.message.toLowerCase().includes('start')
            );

            return hasStartError;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('validates that workflow with multiple start nodes produces error', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 5 }),
          (startCount) => {
            // Create multiple start nodes
            const nodes: WorkflowNode[] = [];
            for (let i = 0; i < startCount; i++) {
              nodes.push({
                id: generateId('start', i),
                type: 'start',
                name: `Start ${i}`,
                position: { x: 100 + i * 150, y: 100 },
                config: {},
              });
            }
            // Add an end node
            nodes.push({
              id: 'end_0',
              type: 'end',
              name: 'End',
              position: { x: 100, y: 300 },
              config: {},
            });

            // Connect all starts to end
            const connections: WorkflowConnection[] = nodes
              .filter(n => n.type === 'start')
              .map((n, i) => ({
                id: generateId('conn', i),
                from: n.id,
                to: 'end_0',
              }));

            const errors = validateWorkflow(nodes, connections);
            const hasMultipleStartError = errors.some(e => 
              e.message.toLowerCase().includes('apenas um') || 
              e.message.toLowerCase().includes('only one')
            );

            return hasMultipleStartError;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('validates that workflow with exactly one start node passes start validation', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 3 }),
          (middleNodeCount) => {
            // Create a valid workflow with exactly one start
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
            ];

            // Add middle nodes
            for (let i = 0; i < middleNodeCount; i++) {
              nodes.push({
                id: generateId('middle', i),
                type: 'approval',
                name: `Approval ${i}`,
                position: { x: 250 + i * 150, y: 100 },
                config: {},
              });
            }

            // Add end node
            nodes.push({
              id: 'end_0',
              type: 'end',
              name: 'End',
              position: { x: 250 + middleNodeCount * 150, y: 100 },
              config: {},
            });

            // Create connections
            const connections: WorkflowConnection[] = [];
            const nodeIds = nodes.map(n => n.id);
            for (let i = 0; i < nodeIds.length - 1; i++) {
              connections.push({
                id: generateId('conn', i),
                from: nodeIds[i],
                to: nodeIds[i + 1],
              });
            }

            const errors = validateWorkflow(nodes, connections);
            const hasStartError = errors.some(e => 
              (e.message.toLowerCase().includes('início') || 
               e.message.toLowerCase().includes('start')) &&
              e.type === 'error'
            );

            return !hasStartError;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 10b: At least one End node must exist
   */
  describe('Property 10b: End node validation', () => {
    it('validates that workflow with no end node produces error', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (nodeCount) => {
            // Create nodes without any end node
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
            ];

            for (let i = 0; i < nodeCount; i++) {
              nodes.push({
                id: generateId('node', i),
                type: 'approval',
                name: `Node ${i}`,
                position: { x: 250 + i * 150, y: 100 },
                config: {},
              });
            }

            // Create connections (but no end node)
            const connections: WorkflowConnection[] = [];
            const nodeIds = nodes.map(n => n.id);
            for (let i = 0; i < nodeIds.length - 1; i++) {
              connections.push({
                id: generateId('conn', i),
                from: nodeIds[i],
                to: nodeIds[i + 1],
              });
            }

            const errors = validateWorkflow(nodes, connections);
            const hasEndError = errors.some(e => 
              e.message.toLowerCase().includes('fim') || 
              e.message.toLowerCase().includes('end')
            );

            return hasEndError;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('validates that workflow with at least one end node passes end validation', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 3 }),
          (endCount) => {
            // Create a workflow with multiple end nodes (valid)
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
            ];

            // Add end nodes
            for (let i = 0; i < endCount; i++) {
              nodes.push({
                id: generateId('end', i),
                type: 'end',
                name: `End ${i}`,
                position: { x: 300, y: 100 + i * 100 },
                config: {},
              });
            }

            // Connect start to all ends
            const connections: WorkflowConnection[] = nodes
              .filter(n => n.type === 'end')
              .map((n, i) => ({
                id: generateId('conn', i),
                from: 'start_0',
                to: n.id,
              }));

            const errors = validateWorkflow(nodes, connections);
            const hasEndError = errors.some(e => 
              (e.message.toLowerCase().includes('fim') || 
               e.message.toLowerCase().includes('end')) &&
              e.type === 'error' &&
              !e.nodeId // General end node error, not specific node error
            );

            return !hasEndError;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 10c: All nodes except End must have at least one outgoing connection
   */
  describe('Property 10c: Outgoing connection validation', () => {
    it('validates that non-end nodes without outgoing connections produce errors', () => {
      fc.assert(
        fc.property(
          middleNodeTypeArb,
          (nodeType) => {
            // Create a node without outgoing connection
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
              {
                id: 'orphan_0',
                type: nodeType,
                name: 'Orphan Node',
                position: { x: 250, y: 100 },
                config: {},
              },
              {
                id: 'end_0',
                type: 'end',
                name: 'End',
                position: { x: 400, y: 100 },
                config: {},
              },
            ];

            // Only connect start to end, leaving orphan without outgoing
            const connections: WorkflowConnection[] = [
              { id: 'conn_0', from: 'start_0', to: 'orphan_0' },
              { id: 'conn_1', from: 'start_0', to: 'end_0' },
            ];

            const errors = validateWorkflow(nodes, connections);
            const hasOutgoingError = errors.some(e => 
              e.nodeId === 'orphan_0' &&
              (e.message.toLowerCase().includes('saída') || 
               e.message.toLowerCase().includes('outgoing'))
            );

            return hasOutgoingError;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('validates that end nodes without outgoing connections do not produce errors', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 3 }),
          (endCount) => {
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
            ];

            // Add end nodes (they should not need outgoing connections)
            for (let i = 0; i < endCount; i++) {
              nodes.push({
                id: generateId('end', i),
                type: 'end',
                name: `End ${i}`,
                position: { x: 300, y: 100 + i * 100 },
                config: {},
              });
            }

            // Connect start to all ends
            const connections: WorkflowConnection[] = nodes
              .filter(n => n.type === 'end')
              .map((n, i) => ({
                id: generateId('conn', i),
                from: 'start_0',
                to: n.id,
              }));

            const errors = validateWorkflow(nodes, connections);
            
            // No end node should have an outgoing connection error
            const hasEndOutgoingError = errors.some(e => 
              e.nodeId && 
              nodes.find(n => n.id === e.nodeId)?.type === 'end' &&
              (e.message.toLowerCase().includes('saída') || 
               e.message.toLowerCase().includes('outgoing'))
            );

            return !hasEndOutgoingError;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('validates that start node without outgoing connection produces error', () => {
      fc.assert(
        fc.property(
          fc.constant(true),
          () => {
            // Start node with no outgoing connection
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
              {
                id: 'end_0',
                type: 'end',
                name: 'End',
                position: { x: 300, y: 100 },
                config: {},
              },
            ];

            // No connections at all
            const connections: WorkflowConnection[] = [];

            const errors = validateWorkflow(nodes, connections);
            const hasStartOutgoingError = errors.some(e => 
              e.nodeId === 'start_0' &&
              (e.message.toLowerCase().includes('saída') || 
               e.message.toLowerCase().includes('outgoing'))
            );

            return hasStartOutgoingError;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 10d: All nodes except Start must have at least one incoming connection
   */
  describe('Property 10d: Incoming connection validation', () => {
    it('validates that non-start nodes without incoming connections produce errors', () => {
      fc.assert(
        fc.property(
          middleNodeTypeArb,
          (nodeType) => {
            // Create a node without incoming connection
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
              {
                id: 'orphan_0',
                type: nodeType,
                name: 'Orphan Node',
                position: { x: 250, y: 200 },
                config: {},
              },
              {
                id: 'end_0',
                type: 'end',
                name: 'End',
                position: { x: 400, y: 100 },
                config: {},
              },
            ];

            // Connect start to end, and orphan to end (orphan has no incoming)
            const connections: WorkflowConnection[] = [
              { id: 'conn_0', from: 'start_0', to: 'end_0' },
              { id: 'conn_1', from: 'orphan_0', to: 'end_0' },
            ];

            const errors = validateWorkflow(nodes, connections);
            const hasIncomingError = errors.some(e => 
              e.nodeId === 'orphan_0' &&
              (e.message.toLowerCase().includes('entrada') || 
               e.message.toLowerCase().includes('incoming'))
            );

            return hasIncomingError;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('validates that start node without incoming connection does not produce error', () => {
      fc.assert(
        fc.property(
          fc.constant(true),
          () => {
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
              {
                id: 'end_0',
                type: 'end',
                name: 'End',
                position: { x: 300, y: 100 },
                config: {},
              },
            ];

            const connections: WorkflowConnection[] = [
              { id: 'conn_0', from: 'start_0', to: 'end_0' },
            ];

            const errors = validateWorkflow(nodes, connections);
            
            // Start node should not have an incoming connection error
            const hasStartIncomingError = errors.some(e => 
              e.nodeId === 'start_0' &&
              (e.message.toLowerCase().includes('entrada') || 
               e.message.toLowerCase().includes('incoming'))
            );

            return !hasStartIncomingError;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('validates that end node without incoming connection produces error', () => {
      fc.assert(
        fc.property(
          fc.constant(true),
          () => {
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
              {
                id: 'middle_0',
                type: 'approval',
                name: 'Approval',
                position: { x: 250, y: 100 },
                config: {},
              },
              {
                id: 'end_0',
                type: 'end',
                name: 'End',
                position: { x: 400, y: 100 },
                config: {},
              },
            ];

            // Connect start to middle, but middle not to end
            const connections: WorkflowConnection[] = [
              { id: 'conn_0', from: 'start_0', to: 'middle_0' },
            ];

            const errors = validateWorkflow(nodes, connections);
            const hasEndIncomingError = errors.some(e => 
              e.nodeId === 'end_0' &&
              (e.message.toLowerCase().includes('entrada') || 
               e.message.toLowerCase().includes('incoming'))
            );

            return hasEndIncomingError;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Combined validation: Valid workflow should pass all validations
   */
  describe('Property 10: Complete workflow validation', () => {
    it('validates that a properly structured workflow produces no structural errors', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 5 }),
          fc.array(middleNodeTypeArb, { minLength: 0, maxLength: 5 }),
          (endCount, middleTypes) => {
            const actualEndCount = Math.max(1, endCount); // At least one end
            
            // Build a valid workflow
            const nodes: WorkflowNode[] = [
              {
                id: 'start_0',
                type: 'start',
                name: 'Start',
                position: { x: 100, y: 100 },
                config: {},
              },
            ];

            // Add middle nodes
            middleTypes.forEach((type, i) => {
              nodes.push({
                id: generateId('middle', i),
                type,
                name: `${type} ${i}`,
                position: { x: 250 + i * 150, y: 100 },
                config: {},
              });
            });

            // Add end nodes
            for (let i = 0; i < actualEndCount; i++) {
              nodes.push({
                id: generateId('end', i),
                type: 'end',
                name: `End ${i}`,
                position: { x: 250 + middleTypes.length * 150 + 150, y: 100 + i * 100 },
                config: {},
              });
            }

            // Create a linear chain of connections
            const connections: WorkflowConnection[] = [];
            const nonEndNodes = nodes.filter(n => n.type !== 'end');
            const endNodes = nodes.filter(n => n.type === 'end');

            // Connect non-end nodes in sequence
            for (let i = 0; i < nonEndNodes.length - 1; i++) {
              connections.push({
                id: generateId('conn', i),
                from: nonEndNodes[i].id,
                to: nonEndNodes[i + 1].id,
              });
            }

            // Connect last non-end node to all end nodes
            const lastNonEnd = nonEndNodes[nonEndNodes.length - 1];
            endNodes.forEach((endNode, i) => {
              connections.push({
                id: generateId('conn_end', i),
                from: lastNonEnd.id,
                to: endNode.id,
              });
            });

            // Handle condition nodes - they need both yes and no paths
            // For simplicity, we'll add extra connections for condition nodes
            nodes.filter(n => n.type === 'condition').forEach((condNode, i) => {
              // Find existing connection from this condition
              const existingConn = connections.find(c => c.from === condNode.id);
              if (existingConn) {
                existingConn.condition = 'yes';
                // Add a 'no' path to an end node
                connections.push({
                  id: generateId('cond_no', i),
                  from: condNode.id,
                  to: endNodes[0].id,
                  condition: 'no',
                });
              }
            });

            const errors = validateWorkflow(nodes, connections);
            
            // Filter out warnings (like condition path warnings)
            const structuralErrors = errors.filter(e => e.type === 'error');

            // A valid workflow should have no structural errors
            return structuralErrors.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('validates that empty workflow produces multiple errors', () => {
      fc.assert(
        fc.property(
          fc.constant(true),
          () => {
            const nodes: WorkflowNode[] = [];
            const connections: WorkflowConnection[] = [];

            const errors = validateWorkflow(nodes, connections);
            
            // Should have at least errors for missing start and end
            const hasStartError = errors.some(e => 
              e.message.toLowerCase().includes('início') || 
              e.message.toLowerCase().includes('start')
            );
            const hasEndError = errors.some(e => 
              e.message.toLowerCase().includes('fim') || 
              e.message.toLowerCase().includes('end')
            );

            return hasStartError && hasEndError;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
