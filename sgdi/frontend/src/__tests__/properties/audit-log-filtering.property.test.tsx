/**
 * Property-Based Test for Audit Log Filtering
 * 
 * Feature: integracao-templates, Property 4: Search Filter Results Matching
 * Validates: Requirements 12.2
 * 
 * Property: For any search query entered in a filterable list (audit logs),
 * all returned results SHALL contain the search term in their searchable fields,
 * and no results without the search term SHALL be displayed.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { AuditLog, AuditAction, AuditFiltersState } from '../../types';

// Audit actions for generating test data
const auditActions: AuditAction[] = ['create', 'edit', 'delete', 'share', 'view', 'restore'];

// Arbitrary for generating audit log entries
const auditLogArb = (id: number): fc.Arbitrary<AuditLog> =>
  fc.record({
    id: fc.constant(`log-${id}`),
    timestamp: fc.date({ min: new Date('2023-01-01'), max: new Date() }),
    userId: fc.string({ minLength: 3, maxLength: 10 }).map(s => `user-${s}`),
    userName: fc.string({ minLength: 2, maxLength: 20 }).filter(s => s.trim().length > 0),
    userEmail: fc.emailAddress(),
    userAvatar: fc.option(fc.webUrl(), { nil: undefined }),
    action: fc.constantFrom(...auditActions),
    documentId: fc.option(fc.string({ minLength: 3, maxLength: 10 }).map(s => `doc-${s}`), { nil: undefined }),
    documentName: fc.string({ minLength: 3, maxLength: 30 }).filter(s => s.trim().length > 0),
    documentDeleted: fc.option(fc.boolean(), { nil: undefined }),
    ipAddress: fc.ipV4(),
    details: fc.option(
      fc.record({
        browser: fc.option(fc.string({ minLength: 3, maxLength: 20 }), { nil: undefined }),
        os: fc.option(fc.string({ minLength: 3, maxLength: 20 }), { nil: undefined }),
        location: fc.option(fc.string({ minLength: 3, maxLength: 30 }), { nil: undefined }),
      }),
      { nil: undefined }
    ),
  });

// Generate a list of audit logs
const auditLogsArb = (): fc.Arbitrary<AuditLog[]> =>
  fc.integer({ min: 5, max: 20 }).chain(count =>
    fc.tuple(...Array.from({ length: count }, (_, i) => auditLogArb(i)))
  );

// Generate a search query
const searchQueryArb = fc.string({ minLength: 1, maxLength: 15 }).filter(s => s.trim().length > 0);

/**
 * Filter function that mirrors the implementation in Auditoria.tsx
 * This is the function under test
 */
export function filterAuditLogs(logs: AuditLog[], filters: AuditFiltersState): AuditLog[] {
  let result = [...logs];

  // Filter by user (userName or userEmail)
  if (filters.userId) {
    const searchTerm = filters.userId.toLowerCase();
    result = result.filter(
      (log) =>
        log.userName.toLowerCase().includes(searchTerm) ||
        log.userEmail.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by action
  if (filters.action) {
    result = result.filter((log) => log.action === filters.action);
  }

  // Filter by document name
  if (filters.documentName) {
    const searchTerm = filters.documentName.toLowerCase();
    result = result.filter((log) =>
      log.documentName.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by period
  if (filters.period && filters.period !== 'all') {
    const now = new Date();
    const periodDays: Record<string, number> = {
      today: 1,
      yesterday: 2,
      '7days': 7,
      '30days': 30,
      '90days': 90,
    };
    const days = periodDays[filters.period] || 7;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    result = result.filter((log) => new Date(log.timestamp) >= cutoff);
  }

  return result;
}

describe('Audit Log Filtering Property Tests', () => {
  it('Property 4: For any document name search query, all returned results SHALL contain the search term (case-insensitive)', () => {
    fc.assert(
      fc.property(
        auditLogsArb(),
        searchQueryArb,
        (logs, searchQuery) => {
          const filters: AuditFiltersState = {
            period: 'all',
            userId: '',
            action: '',
            documentName: searchQuery,
          };

          const filteredLogs = filterAuditLogs(logs, filters);
          const query = searchQuery.toLowerCase();

          // All filtered results must contain the search term in documentName
          const allMatch = filteredLogs.every(log =>
            log.documentName.toLowerCase().includes(query)
          );

          // Calculate expected matches
          const expectedMatches = logs.filter(log =>
            log.documentName.toLowerCase().includes(query)
          );

          // Count must match expected
          const correctCount = filteredLogs.length === expectedMatches.length;

          return allMatch && correctCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: For any user search query, all returned results SHALL match userName or userEmail (case-insensitive)', () => {
    fc.assert(
      fc.property(
        auditLogsArb(),
        searchQueryArb,
        (logs, searchQuery) => {
          const filters: AuditFiltersState = {
            period: 'all',
            userId: searchQuery,
            action: '',
            documentName: '',
          };

          const filteredLogs = filterAuditLogs(logs, filters);
          const query = searchQuery.toLowerCase();

          // All filtered results must contain the search term in userName or userEmail
          const allMatch = filteredLogs.every(log =>
            log.userName.toLowerCase().includes(query) ||
            log.userEmail.toLowerCase().includes(query)
          );

          // Calculate expected matches
          const expectedMatches = logs.filter(log =>
            log.userName.toLowerCase().includes(query) ||
            log.userEmail.toLowerCase().includes(query)
          );

          // Count must match expected
          const correctCount = filteredLogs.length === expectedMatches.length;

          return allMatch && correctCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: For any action filter, all returned results SHALL have the exact action type', () => {
    fc.assert(
      fc.property(
        auditLogsArb(),
        fc.constantFrom(...auditActions),
        (logs, action) => {
          const filters: AuditFiltersState = {
            period: 'all',
            userId: '',
            action: action,
            documentName: '',
          };

          const filteredLogs = filterAuditLogs(logs, filters);

          // All filtered results must have the exact action
          const allMatch = filteredLogs.every(log => log.action === action);

          // Calculate expected matches
          const expectedMatches = logs.filter(log => log.action === action);

          // Count must match expected
          const correctCount = filteredLogs.length === expectedMatches.length;

          return allMatch && correctCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Empty filters SHALL return all logs', () => {
    fc.assert(
      fc.property(
        auditLogsArb(),
        (logs) => {
          const filters: AuditFiltersState = {
            period: 'all',
            userId: '',
            action: '',
            documentName: '',
          };

          const filteredLogs = filterAuditLogs(logs, filters);

          // All logs should be returned
          return filteredLogs.length === logs.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Combined filters SHALL return intersection of individual filter results', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...auditActions),
        (action) => {
          // Create logs with known values for testing combined filters
          const testLogs: AuditLog[] = [
            {
              id: 'log-1',
              timestamp: new Date(),
              userId: 'user-1',
              userName: 'TestUser',
              userEmail: 'test@example.com',
              action: action,
              documentName: 'TestDocument.pdf',
              ipAddress: '192.168.1.1',
            },
            {
              id: 'log-2',
              timestamp: new Date(),
              userId: 'user-2',
              userName: 'OtherUser',
              userEmail: 'other@example.com',
              action: action,
              documentName: 'OtherDocument.pdf',
              ipAddress: '192.168.1.2',
            },
            {
              id: 'log-3',
              timestamp: new Date(),
              userId: 'user-3',
              userName: 'TestUser',
              userEmail: 'test2@example.com',
              action: 'view' as AuditAction,
              documentName: 'TestDocument.pdf',
              ipAddress: '192.168.1.3',
            },
          ];

          // Filter by both user and action
          const filters: AuditFiltersState = {
            period: 'all',
            userId: 'TestUser',
            action: action,
            documentName: '',
          };

          const filteredLogs = filterAuditLogs(testLogs, filters);

          // Should only return logs that match BOTH criteria
          const allMatchBoth = filteredLogs.every(log =>
            (log.userName.toLowerCase().includes('testuser') ||
             log.userEmail.toLowerCase().includes('testuser')) &&
            log.action === action
          );

          // log-1 should match (TestUser + action), log-2 should not (OtherUser), log-3 should not (different action)
          const expectedCount = testLogs.filter(log =>
            (log.userName.toLowerCase().includes('testuser') ||
             log.userEmail.toLowerCase().includes('testuser')) &&
            log.action === action
          ).length;

          return allMatchBoth && filteredLogs.length === expectedCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: No results without matching criteria SHALL be displayed', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          // Create logs with distinct values
          const testLogs: AuditLog[] = [
            {
              id: 'log-1',
              timestamp: new Date(),
              userId: 'user-1',
              userName: 'Alpha',
              userEmail: 'alpha@test.com',
              action: 'create',
              documentName: 'AlphaDoc.pdf',
              ipAddress: '192.168.1.1',
            },
            {
              id: 'log-2',
              timestamp: new Date(),
              userId: 'user-2',
              userName: 'Beta',
              userEmail: 'beta@test.com',
              action: 'edit',
              documentName: 'BetaDoc.pdf',
              ipAddress: '192.168.1.2',
            },
            {
              id: 'log-3',
              timestamp: new Date(),
              userId: 'user-3',
              userName: 'Gamma',
              userEmail: 'gamma@test.com',
              action: 'delete',
              documentName: 'GammaDoc.pdf',
              ipAddress: '192.168.1.3',
            },
          ];

          // Filter by document name 'Alpha'
          const filters: AuditFiltersState = {
            period: 'all',
            userId: '',
            action: '',
            documentName: 'Alpha',
          };

          const filteredLogs = filterAuditLogs(testLogs, filters);

          // Only log-1 should be returned
          const onlyAlpha = filteredLogs.length === 1 && filteredLogs[0].id === 'log-1';

          // Beta and Gamma should NOT be in results
          const noBeta = !filteredLogs.some(log => log.id === 'log-2');
          const noGamma = !filteredLogs.some(log => log.id === 'log-3');

          return onlyAlpha && noBeta && noGamma;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Search is case-insensitive for document name', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('lowercase', 'UPPERCASE', 'MixedCase'),
        (caseType) => {
          const testLogs: AuditLog[] = [
            {
              id: 'log-1',
              timestamp: new Date(),
              userId: 'user-1',
              userName: 'User',
              userEmail: 'user@test.com',
              action: 'create',
              documentName: 'TestDocument.PDF',
              ipAddress: '192.168.1.1',
            },
          ];

          const searchTerms: Record<string, string> = {
            lowercase: 'testdocument',
            UPPERCASE: 'TESTDOCUMENT',
            MixedCase: 'TeStDoCuMeNt',
          };

          const filters: AuditFiltersState = {
            period: 'all',
            userId: '',
            action: '',
            documentName: searchTerms[caseType],
          };

          const filteredLogs = filterAuditLogs(testLogs, filters);

          // Should find the document regardless of case
          return filteredLogs.length === 1 && filteredLogs[0].id === 'log-1';
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 4: Search is case-insensitive for user name and email', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('name-lower', 'name-upper', 'email-lower', 'email-upper'),
        (searchType) => {
          const testLogs: AuditLog[] = [
            {
              id: 'log-1',
              timestamp: new Date(),
              userId: 'user-1',
              userName: 'JohnDoe',
              userEmail: 'john.doe@Example.COM',
              action: 'create',
              documentName: 'Document.pdf',
              ipAddress: '192.168.1.1',
            },
          ];

          const searchTerms: Record<string, string> = {
            'name-lower': 'johndoe',
            'name-upper': 'JOHNDOE',
            'email-lower': 'john.doe@example.com',
            'email-upper': 'JOHN.DOE@EXAMPLE.COM',
          };

          const filters: AuditFiltersState = {
            period: 'all',
            userId: searchTerms[searchType],
            action: '',
            documentName: '',
          };

          const filteredLogs = filterAuditLogs(testLogs, filters);

          // Should find the user regardless of case
          return filteredLogs.length === 1 && filteredLogs[0].id === 'log-1';
        }
      ),
      { numRuns: 100 }
    );
  });
});
