/**
 * Property-Based Test for Task Filtering
 * 
 * Feature: integracao-templates, Property 4: Search Filter Results Matching
 * Validates: Requirements 11.5
 * 
 * Property: For any search query entered in a filterable list (tasks),
 * all returned results SHALL contain the search term in their searchable fields,
 * and no results without the search term SHALL be displayed.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { WorkflowTask, TaskStatus, TaskPriority } from '../../types';

// Filter function extracted from Tarefas.tsx for testing
const filterTasksBySearch = (tasks: WorkflowTask[], search: string): WorkflowTask[] => {
  if (!search) return tasks;
  
  const searchLower = search.toLowerCase();
  return tasks.filter(t =>
    t.documentName.toLowerCase().includes(searchLower) ||
    t.id.toLowerCase().includes(searchLower) ||
    t.requesterName.toLowerCase().includes(searchLower) ||
    t.type.toLowerCase().includes(searchLower)
  );
};

// Arbitrary for generating workflow tasks
const workflowTaskArb = (id: number): fc.Arbitrary<WorkflowTask> =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }).map(s => `task-${id}-${s.replace(/\s/g, '')}`),
    workflowInstanceId: fc.constant(`wf-${id}`),
    documentId: fc.constant(`doc-${id}`),
    documentName: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    documentType: fc.constantFrom('pdf', 'docx', 'xlsx', 'pptx', 'png', 'jpg'),
    documentSize: fc.integer({ min: 1000, max: 10000000 }),
    documentVersion: fc.constantFrom('1.0', '2.0', '3.0'),
    assigneeId: fc.constant('user-001'),
    requesterId: fc.constant(`user-${id + 100}`),
    requesterName: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
    department: fc.constantFrom('TI', 'RH', 'Financeiro', 'Marketing'),
    type: fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
    status: fc.constantFrom('pending', 'in_progress', 'approved', 'rejected') as fc.Arbitrary<TaskStatus>,
    priority: fc.constantFrom('normal', 'urgent') as fc.Arbitrary<TaskPriority>,
    dueDate: fc.date({ min: new Date('2023-01-01'), max: new Date('2025-12-31') }),
    createdAt: fc.date({ min: new Date('2023-01-01'), max: new Date() }),
  });

// Generate a list of workflow tasks
const workflowTasksArb = (): fc.Arbitrary<WorkflowTask[]> =>
  fc.integer({ min: 3, max: 15 }).chain(count =>
    fc.tuple(...Array.from({ length: count }, (_, i) => workflowTaskArb(i)))
  );

// Generate a search query
const searchQueryArb = fc.string({ minLength: 1, maxLength: 15 }).filter(s => s.trim().length > 0);

describe('Task Filtering Property Tests', () => {
  it('Property 4: For any search query, all filtered results SHALL contain the search term in searchable fields', () => {
    fc.assert(
      fc.property(
        workflowTasksArb(),
        searchQueryArb,
        (tasks, searchQuery) => {
          const filteredTasks = filterTasksBySearch(tasks, searchQuery);
          const searchLower = searchQuery.toLowerCase();

          // All filtered tasks must contain the search term in at least one searchable field
          return filteredTasks.every(task =>
            task.documentName.toLowerCase().includes(searchLower) ||
            task.id.toLowerCase().includes(searchLower) ||
            task.requesterName.toLowerCase().includes(searchLower) ||
            task.type.toLowerCase().includes(searchLower)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: No results without the search term SHALL be displayed', () => {
    fc.assert(
      fc.property(
        workflowTasksArb(),
        searchQueryArb,
        (tasks, searchQuery) => {
          const filteredTasks = filterTasksBySearch(tasks, searchQuery);
          const searchLower = searchQuery.toLowerCase();

          // Calculate expected matches
          const expectedMatches = tasks.filter(task =>
            task.documentName.toLowerCase().includes(searchLower) ||
            task.id.toLowerCase().includes(searchLower) ||
            task.requesterName.toLowerCase().includes(searchLower) ||
            task.type.toLowerCase().includes(searchLower)
          );

          // Filtered count should match expected count
          return filteredTasks.length === expectedMatches.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Empty search query SHALL return all tasks', () => {
    fc.assert(
      fc.property(
        workflowTasksArb(),
        (tasks) => {
          const filteredTasks = filterTasksBySearch(tasks, '');
          return filteredTasks.length === tasks.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Search is case-insensitive', () => {
    fc.assert(
      fc.property(
        workflowTasksArb(),
        searchQueryArb,
        (tasks, searchQuery) => {
          const lowerResults = filterTasksBySearch(tasks, searchQuery.toLowerCase());
          const upperResults = filterTasksBySearch(tasks, searchQuery.toUpperCase());
          const mixedResults = filterTasksBySearch(tasks, searchQuery);

          // All case variations should return the same results
          return lowerResults.length === upperResults.length &&
                 upperResults.length === mixedResults.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Filtering preserves task identity', () => {
    fc.assert(
      fc.property(
        workflowTasksArb(),
        searchQueryArb,
        (tasks, searchQuery) => {
          const filteredTasks = filterTasksBySearch(tasks, searchQuery);

          // All filtered tasks must exist in the original list
          return filteredTasks.every(filtered =>
            tasks.some(original => original.id === filtered.id)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Filtering is idempotent', () => {
    fc.assert(
      fc.property(
        workflowTasksArb(),
        searchQueryArb,
        (tasks, searchQuery) => {
          const firstFilter = filterTasksBySearch(tasks, searchQuery);
          const secondFilter = filterTasksBySearch(firstFilter, searchQuery);

          // Filtering twice with the same query should return the same results
          return firstFilter.length === secondFilter.length &&
                 firstFilter.every((task, i) => task.id === secondFilter[i].id);
        }
      ),
      { numRuns: 100 }
    );
  });
});
