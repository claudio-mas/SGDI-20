/**
 * Property-Based Test for Version Chronological Order
 * 
 * Feature: integracao-templates, Property 7: Version Chronological Order
 * Validates: Requirements 7.1
 * 
 * Property: For any document with multiple versions, the VersionHistory_Component
 * SHALL display versions in reverse chronological order (newest first), with each
 * version showing correct timestamp and author.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, within } from '../../test/test-utils';
import { VersionHistory } from '../../components/documents/VersionHistory';
import { Document, DocumentVersion, User } from '../../types';

// Helper to create a valid date within range
const createValidDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day, 12, 0, 0);
};

// Arbitrary for generating a user with simple valid data
const userArb: fc.Arbitrary<User> = fc.record({
  id: fc.constant('user-1'),
  name: fc.constantFrom('Alice', 'Bob', 'Carlos', 'Diana'),
  email: fc.constant('user@example.com'),
  avatar: fc.constant(undefined),
  role: fc.constant('user' as const),
  departmentId: fc.constant(undefined),
});

// Generate versions with distinct, valid dates
const versionsArb: fc.Arbitrary<DocumentVersion[]> = fc
  .array(
    fc.tuple(
      fc.integer({ min: 2020, max: 2025 }),
      fc.integer({ min: 1, max: 12 }),
      fc.integer({ min: 1, max: 28 }),
      userArb,
      fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
      fc.integer({ min: 1000, max: 100000000 })
    ),
    { minLength: 2, maxLength: 5 }
  )
  .map((items) =>
    items.map(([year, month, day, user, comment, size], idx) => ({
      id: `version-${idx}`,
      documentId: 'doc-1',
      version: `v${idx + 1}.0`,
      modifiedAt: createValidDate(year, month, day),
      modifiedBy: user,
      comment,
      size,
      isCurrent: idx === 0,
    }))
  );

// Arbitrary for generating a document
const documentArb: fc.Arbitrary<Document> = fc.record({
  id: fc.constant('doc-1'),
  name: fc.constantFrom('Report.pdf', 'Contract.docx', 'Data.xlsx'),
  type: fc.constantFrom('pdf', 'docx', 'xlsx'),
  size: fc.integer({ min: 1000, max: 100000000 }),
  folderId: fc.constant(undefined),
  ownerId: fc.constant('owner-1'),
  status: fc.constantFrom('draft', 'review', 'approved', 'rejected'),
  tags: fc.constant([]),
  createdAt: fc.constant(new Date('2020-01-01')),
  updatedAt: fc.constant(new Date('2020-01-01')),
  deletedAt: fc.constant(undefined),
});

// Helper to check if versions are sorted in reverse chronological order (newest first)
function isReverseChrono(versions: DocumentVersion[]): boolean {
  for (let i = 1; i < versions.length; i++) {
    const prevDate = new Date(versions[i - 1].modifiedAt).getTime();
    const currDate = new Date(versions[i].modifiedAt).getTime();
    if (prevDate < currDate) {
      return false;
    }
  }
  return true;
}

// Helper to extract version IDs from rendered table rows
function getDisplayedVersionIds(): string[] {
  const versionList = screen.getByTestId('version-list');
  const rows = within(versionList).getAllByTestId(/^version-row-/);
  return rows.map((row) => {
    const testId = row.getAttribute('data-testid');
    return testId ? testId.replace('version-row-', '') : '';
  });
}

describe('Version Chronological Order Property Tests', () => {
  it('Property 7: Versions are displayed in reverse chronological order (newest first)', () => {
    fc.assert(
      fc.property(fc.tuple(documentArb, versionsArb), ([document, versions]) => {
        const { unmount } = render(
          <VersionHistory document={document} versions={versions} />
        );

        // Get displayed version IDs in order
        const displayedIds = getDisplayedVersionIds();

        // Map displayed IDs back to versions
        const displayedVersions = displayedIds.map(
          (id) => versions.find((v) => v.id === id)!
        );

        // Check if displayed versions are in reverse chronological order
        const sorted = isReverseChrono(displayedVersions);

        unmount();
        return sorted;
      }),
      { numRuns: 20 }
    );
  });

  it('Property 7: Each version displays correct timestamp and author', () => {
    fc.assert(
      fc.property(fc.tuple(documentArb, versionsArb), ([document, versions]) => {
        const { unmount } = render(
          <VersionHistory document={document} versions={versions} />
        );

        // For each version, check that its row exists and contains date and author info
        const allVersionsValid = versions.every((version) => {
          const row = screen.queryByTestId(`version-row-${version.id}`);
          if (!row) return false;

          // Check year is displayed
          const versionDate = new Date(version.modifiedAt);
          const year = versionDate.getFullYear().toString();
          const hasYear = row.textContent?.includes(year) ?? false;

          // Check author name is displayed
          const hasAuthor =
            row.textContent?.includes(version.modifiedBy.name) ?? false;

          // Check version number is displayed
          const hasVersion = row.textContent?.includes(version.version) ?? false;

          return hasYear && hasAuthor && hasVersion;
        });

        unmount();
        return allVersionsValid;
      }),
      { numRuns: 20 }
    );
  });
});
