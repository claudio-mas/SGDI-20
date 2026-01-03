/**
 * Property-Based Test for Badge Variants
 * 
 * Feature: integracao-templates, Property 13: Component Variant Rendering
 * Validates: Requirements 15.6
 * 
 * Property: For any valid combination of variant and size props passed to Badge,
 * the component SHALL apply the correct CSS classes and visual styles corresponding to the specified variant.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '../../test/test-utils';
import { Badge } from '../../components/common/Badge';

// Define the expected CSS classes for each variant
const variantExpectedClasses: Record<string, string[]> = {
  success: ['bg-green-100', 'text-green-800'],
  warning: ['bg-amber-100', 'text-amber-800'],
  error: ['bg-red-100', 'text-red-800'],
  info: ['bg-blue-100', 'text-blue-800'],
  default: ['bg-gray-100', 'text-gray-800'],
};

// Define the expected CSS classes for each size
const sizeExpectedClasses: Record<string, string[]> = {
  sm: ['px-2', 'py-0.5', 'text-xs'],
  md: ['px-2.5', 'py-1', 'text-sm'],
};

// Arbitraries for Badge props
const variantArb = fc.constantFrom('success', 'warning', 'error', 'info', 'default') as fc.Arbitrary<'success' | 'warning' | 'error' | 'info' | 'default'>;
const sizeArb = fc.constantFrom('sm', 'md') as fc.Arbitrary<'sm' | 'md'>;
const childrenArb = fc.string({ minLength: 1, maxLength: 50 });

describe('Badge Variant Rendering Property Tests', () => {
  it('Property 13: For any variant, Badge applies correct CSS classes', () => {
    fc.assert(
      fc.property(variantArb, childrenArb, (variant, children) => {
        const { unmount } = render(<Badge variant={variant}>{children}</Badge>);
        const badge = screen.getByTestId('badge');
        
        const expectedClasses = variantExpectedClasses[variant];
        const hasAllExpectedClasses = expectedClasses.every(cls => badge.classList.contains(cls));
        
        // Verify data-variant attribute is set correctly
        const hasCorrectDataAttribute = badge.getAttribute('data-variant') === variant;
        
        unmount();
        return hasAllExpectedClasses && hasCorrectDataAttribute;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any size, Badge applies correct CSS classes', () => {
    fc.assert(
      fc.property(sizeArb, childrenArb, (size, children) => {
        const { unmount } = render(<Badge size={size}>{children}</Badge>);
        const badge = screen.getByTestId('badge');
        
        const expectedClasses = sizeExpectedClasses[size];
        const hasAllExpectedClasses = expectedClasses.every(cls => badge.classList.contains(cls));
        
        // Verify data-size attribute is set correctly
        const hasCorrectDataAttribute = badge.getAttribute('data-size') === size;
        
        unmount();
        return hasAllExpectedClasses && hasCorrectDataAttribute;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any combination of variant and size, Badge applies both sets of CSS classes', () => {
    fc.assert(
      fc.property(variantArb, sizeArb, childrenArb, (variant, size, children) => {
        const { unmount } = render(<Badge variant={variant} size={size}>{children}</Badge>);
        const badge = screen.getByTestId('badge');
        
        const variantClasses = variantExpectedClasses[variant];
        const sizeClasses = sizeExpectedClasses[size];
        
        const hasVariantClasses = variantClasses.every(cls => badge.classList.contains(cls));
        const hasSizeClasses = sizeClasses.every(cls => badge.classList.contains(cls));
        
        // Verify data attributes are set correctly
        const hasCorrectVariantAttr = badge.getAttribute('data-variant') === variant;
        const hasCorrectSizeAttr = badge.getAttribute('data-size') === size;
        
        unmount();
        return hasVariantClasses && hasSizeClasses && hasCorrectVariantAttr && hasCorrectSizeAttr;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any children content, Badge renders children correctly', () => {
    fc.assert(
      fc.property(variantArb, sizeArb, childrenArb, (variant, size, children) => {
        const { unmount } = render(<Badge variant={variant} size={size}>{children}</Badge>);
        const badge = screen.getByTestId('badge');
        
        // Verify children are rendered
        const hasCorrectContent = badge.textContent === children;
        
        unmount();
        return hasCorrectContent;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: Badge always has base styles regardless of variant/size', () => {
    fc.assert(
      fc.property(variantArb, sizeArb, childrenArb, (variant, size, children) => {
        const { unmount } = render(<Badge variant={variant} size={size}>{children}</Badge>);
        const badge = screen.getByTestId('badge');
        
        // Base styles that should always be present
        const baseClasses = ['inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-full'];
        const hasBaseClasses = baseClasses.every(cls => badge.classList.contains(cls));
        
        unmount();
        return hasBaseClasses;
      }),
      { numRuns: 100 }
    );
  });
});
