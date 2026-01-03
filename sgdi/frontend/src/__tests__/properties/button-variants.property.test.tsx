/**
 * Property-Based Test for Button Variants
 * 
 * Feature: integracao-templates, Property 13: Component Variant Rendering
 * Validates: Requirements 15.4
 * 
 * Property: For any valid combination of variant and size props passed to Button,
 * the component SHALL apply the correct CSS classes corresponding to the specified variant and size.
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '../../test/test-utils';
import { Button } from '../../components/common/Button';

// Define the expected CSS classes for each variant
const variantExpectedClasses: Record<string, string[]> = {
  primary: ['bg-primary'],
  secondary: ['bg-white', 'border'],
  danger: ['bg-red-500'],
  ghost: ['text-[#616f89]'],
};

// Define the expected CSS classes for each size
const sizeExpectedClasses: Record<string, string[]> = {
  sm: ['px-3', 'py-1.5', 'text-xs'],
  md: ['px-5', 'py-2.5', 'text-sm'],
  lg: ['px-6', 'py-3', 'text-base'],
};

// Arbitraries for Button props
const variantArb = fc.constantFrom('primary', 'secondary', 'danger', 'ghost') as fc.Arbitrary<'primary' | 'secondary' | 'danger' | 'ghost'>;
const sizeArb = fc.constantFrom('sm', 'md', 'lg') as fc.Arbitrary<'sm' | 'md' | 'lg'>;
const loadingArb = fc.boolean();
const disabledArb = fc.boolean();

describe('Button Variant Rendering Property Tests', () => {
  it('Property 13: For any variant, Button applies correct CSS classes', () => {
    fc.assert(
      fc.property(variantArb, (variant) => {
        const { unmount } = render(<Button variant={variant}>Test Button</Button>);
        const button = screen.getByRole('button');
        
        const expectedClasses = variantExpectedClasses[variant];
        const hasAllExpectedClasses = expectedClasses.every(cls => button.classList.contains(cls));
        
        unmount();
        return hasAllExpectedClasses;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any size, Button applies correct CSS classes', () => {
    fc.assert(
      fc.property(sizeArb, (size) => {
        const { unmount } = render(<Button size={size}>Test Button</Button>);
        const button = screen.getByRole('button');
        
        const expectedClasses = sizeExpectedClasses[size];
        const hasAllExpectedClasses = expectedClasses.every(cls => button.classList.contains(cls));
        
        unmount();
        return hasAllExpectedClasses;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any combination of variant and size, Button applies both sets of CSS classes', () => {
    fc.assert(
      fc.property(variantArb, sizeArb, (variant, size) => {
        const { unmount } = render(<Button variant={variant} size={size}>Test Button</Button>);
        const button = screen.getByRole('button');
        
        const variantClasses = variantExpectedClasses[variant];
        const sizeClasses = sizeExpectedClasses[size];
        
        const hasVariantClasses = variantClasses.every(cls => button.classList.contains(cls));
        const hasSizeClasses = sizeClasses.every(cls => button.classList.contains(cls));
        
        unmount();
        return hasVariantClasses && hasSizeClasses;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any disabled state, Button applies disabled styles consistently', () => {
    fc.assert(
      fc.property(variantArb, disabledArb, (variant, disabled) => {
        const { unmount } = render(<Button variant={variant} disabled={disabled}>Test Button</Button>);
        const button = screen.getByRole('button');
        
        // When disabled, should have opacity-50 and cursor-not-allowed
        const hasDisabledStyles = disabled 
          ? button.classList.contains('opacity-50') && button.classList.contains('cursor-not-allowed')
          : !button.classList.contains('opacity-50');
        
        // Should still have variant classes regardless of disabled state
        const variantClasses = variantExpectedClasses[variant];
        const hasVariantClasses = variantClasses.every(cls => button.classList.contains(cls));
        
        unmount();
        return hasDisabledStyles && hasVariantClasses;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any loading state, Button applies disabled styles and shows spinner', () => {
    fc.assert(
      fc.property(variantArb, loadingArb, (variant, loading) => {
        const { unmount } = render(<Button variant={variant} loading={loading}>Test Button</Button>);
        const button = screen.getByRole('button');
        
        // When loading, should have disabled styles
        const hasDisabledStyles = loading 
          ? button.classList.contains('opacity-50') && button.classList.contains('cursor-not-allowed')
          : !button.classList.contains('opacity-50');
        
        // When loading, spinner should be present
        const spinner = button.querySelector('[data-testid="loading-spinner"]');
        const hasCorrectSpinner = loading ? spinner !== null : spinner === null;
        
        // Should still have variant classes regardless of loading state
        const variantClasses = variantExpectedClasses[variant];
        const hasVariantClasses = variantClasses.every(cls => button.classList.contains(cls));
        
        unmount();
        return hasDisabledStyles && hasCorrectSpinner && hasVariantClasses;
      }),
      { numRuns: 100 }
    );
  });
});
