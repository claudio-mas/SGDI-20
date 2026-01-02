import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('Test Environment Setup', () => {
  it('should run basic tests', () => {
    expect(true).toBe(true);
  });

  it('should have fast-check available for property-based testing', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n + 0 === n;
      }),
      { numRuns: 100 }
    );
  });
});
