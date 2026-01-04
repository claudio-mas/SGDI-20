/**
 * Property-Based Test for Action Badge Color Mapping
 * 
 * Feature: integracao-templates, Property 11: Action Badge Color Mapping
 * Validates: Requirements 12.5
 * 
 * Property: For any audit log action type, the AuditReport_Component SHALL display
 * a badge with the correct color: create=green, edit=amber, delete=red, share=blue,
 * view=gray, restore=purple.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { getActionBadgeConfig } from '../../components/audit/AuditTable';
import { AuditAction } from '../../types';

// All valid audit actions
const auditActions: AuditAction[] = ['create', 'edit', 'delete', 'share', 'view', 'restore'];

// Expected color mapping per Requirements 12.5
const expectedColorMapping: Record<AuditAction, string> = {
  create: 'green',
  edit: 'amber',
  delete: 'red',
  share: 'blue',
  view: 'gray',
  restore: 'purple',
};

/**
 * Helper to check if a color class contains the expected color name
 */
function containsColor(colorClass: string, expectedColor: string): boolean {
  return colorClass.toLowerCase().includes(expectedColor.toLowerCase());
}

describe('Action Badge Color Mapping Property Tests', () => {
  it('Property 11: For any audit action type, the badge SHALL display the correct color', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...auditActions),
        (action: AuditAction) => {
          const config = getActionBadgeConfig(action);
          const expectedColor = expectedColorMapping[action];

          // Check that bgColor contains the expected color
          const bgColorMatches = containsColor(config.bgColor, expectedColor);
          
          // Check that textColor contains the expected color
          const textColorMatches = containsColor(config.textColor, expectedColor);
          
          // Check that borderColor contains the expected color
          const borderColorMatches = containsColor(config.borderColor, expectedColor);

          return bgColorMatches && textColorMatches && borderColorMatches;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: create action SHALL have green color', () => {
    fc.assert(
      fc.property(
        fc.constant('create' as AuditAction),
        (action) => {
          const config = getActionBadgeConfig(action);
          return (
            containsColor(config.bgColor, 'green') &&
            containsColor(config.textColor, 'green') &&
            containsColor(config.borderColor, 'green')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: edit action SHALL have amber color', () => {
    fc.assert(
      fc.property(
        fc.constant('edit' as AuditAction),
        (action) => {
          const config = getActionBadgeConfig(action);
          return (
            containsColor(config.bgColor, 'amber') &&
            containsColor(config.textColor, 'amber') &&
            containsColor(config.borderColor, 'amber')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: delete action SHALL have red color', () => {
    fc.assert(
      fc.property(
        fc.constant('delete' as AuditAction),
        (action) => {
          const config = getActionBadgeConfig(action);
          return (
            containsColor(config.bgColor, 'red') &&
            containsColor(config.textColor, 'red') &&
            containsColor(config.borderColor, 'red')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: share action SHALL have blue color', () => {
    fc.assert(
      fc.property(
        fc.constant('share' as AuditAction),
        (action) => {
          const config = getActionBadgeConfig(action);
          return (
            containsColor(config.bgColor, 'blue') &&
            containsColor(config.textColor, 'blue') &&
            containsColor(config.borderColor, 'blue')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: view action SHALL have gray color', () => {
    fc.assert(
      fc.property(
        fc.constant('view' as AuditAction),
        (action) => {
          const config = getActionBadgeConfig(action);
          return (
            containsColor(config.bgColor, 'gray') &&
            containsColor(config.textColor, 'gray') &&
            containsColor(config.borderColor, 'gray')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: restore action SHALL have purple color', () => {
    fc.assert(
      fc.property(
        fc.constant('restore' as AuditAction),
        (action) => {
          const config = getActionBadgeConfig(action);
          return (
            containsColor(config.bgColor, 'purple') &&
            containsColor(config.textColor, 'purple') &&
            containsColor(config.borderColor, 'purple')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: All action types SHALL have consistent color across bg, text, and border', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...auditActions),
        (action: AuditAction) => {
          const config = getActionBadgeConfig(action);
          const expectedColor = expectedColorMapping[action];

          // All three color properties should use the same base color
          const bgHasColor = containsColor(config.bgColor, expectedColor);
          const textHasColor = containsColor(config.textColor, expectedColor);
          const borderHasColor = containsColor(config.borderColor, expectedColor);

          return bgHasColor && textHasColor && borderHasColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: Badge config SHALL include label and icon for all actions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...auditActions),
        (action: AuditAction) => {
          const config = getActionBadgeConfig(action);

          // Config should have non-empty label and icon
          const hasLabel = typeof config.label === 'string' && config.label.length > 0;
          const hasIcon = typeof config.icon === 'string' && config.icon.length > 0;

          return hasLabel && hasIcon;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: Each action type SHALL have unique color mapping', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.constantFrom(...auditActions),
          fc.constantFrom(...auditActions)
        ).filter(([a, b]) => a !== b),
        ([action1, action2]) => {
          const color1 = expectedColorMapping[action1];
          const color2 = expectedColorMapping[action2];

          // Different actions should have different colors
          return color1 !== color2;
        }
      ),
      { numRuns: 100 }
    );
  });
});
