/**
 * Property-Based Test for Input Variants
 * 
 * Feature: integracao-templates, Property 13: Component Variant Rendering
 * Validates: Requirements 15.5
 * 
 * Property: For any valid combination of type, size, and state props passed to Input,
 * the component SHALL apply the correct CSS classes and visual styles corresponding to the specified variant.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '../../test/test-utils';
import { Input } from '../../components/common/Input';

// Define the expected CSS classes for each input type
const typeExpectedBehavior: Record<string, { type: string; additionalClasses?: string[] }> = {
  text: { type: 'text' },
  email: { type: 'email' },
  password: { type: 'password' },
  search: { type: 'search', additionalClasses: ['border-0', 'bg-[#f0f2f4]'] },
};

// Define the expected CSS classes for each size
const sizeExpectedClasses: Record<string, string[]> = {
  sm: ['h-9', 'text-xs'],
  md: ['h-12', 'text-base'],
  lg: ['h-14', 'text-lg'],
};

// Arbitraries for Input props
const typeArb = fc.constantFrom('text', 'email', 'password', 'search') as fc.Arbitrary<'text' | 'email' | 'password' | 'search'>;
const sizeArb = fc.constantFrom('sm', 'md', 'lg') as fc.Arbitrary<'sm' | 'md' | 'lg'>;
const disabledArb = fc.boolean();
const errorArb = fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined });
const iconPositionArb = fc.constantFrom('left', 'right') as fc.Arbitrary<'left' | 'right'>;

describe('Input Variant Rendering Property Tests', () => {
  it('Property 13: For any input type, Input renders with correct type attribute', () => {
    fc.assert(
      fc.property(typeArb, (type) => {
        const { unmount } = render(<Input type={type} data-testid="input" />);
        const input = screen.getByTestId('input');
        
        const expectedType = typeExpectedBehavior[type].type;
        const hasCorrectType = input.getAttribute('type') === expectedType;
        
        unmount();
        return hasCorrectType;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any size, Input applies correct CSS classes', () => {
    fc.assert(
      fc.property(sizeArb, (size) => {
        const { unmount } = render(<Input size={size} data-testid="input" />);
        const input = screen.getByTestId('input');
        
        const expectedClasses = sizeExpectedClasses[size];
        const hasAllExpectedClasses = expectedClasses.every(cls => input.classList.contains(cls));
        
        unmount();
        return hasAllExpectedClasses;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any combination of type and size, Input applies both sets of styles', () => {
    fc.assert(
      fc.property(typeArb, sizeArb, (type, size) => {
        const { unmount } = render(<Input type={type} size={size} data-testid="input" />);
        const input = screen.getByTestId('input');
        
        // Check type attribute
        const expectedType = typeExpectedBehavior[type].type;
        const hasCorrectType = input.getAttribute('type') === expectedType;
        
        // Check size classes
        const sizeClasses = sizeExpectedClasses[size];
        const hasSizeClasses = sizeClasses.every(cls => input.classList.contains(cls));
        
        // Check type-specific classes (e.g., search has special styling)
        const typeClasses = typeExpectedBehavior[type].additionalClasses || [];
        const hasTypeClasses = typeClasses.every(cls => input.classList.contains(cls));
        
        unmount();
        return hasCorrectType && hasSizeClasses && hasTypeClasses;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any disabled state, Input applies disabled styles consistently', () => {
    fc.assert(
      fc.property(typeArb, sizeArb, disabledArb, (type, size, disabled) => {
        const { unmount } = render(<Input type={type} size={size} disabled={disabled} data-testid="input" />);
        const input = screen.getByTestId('input');
        
        // When disabled, should have opacity-50 and cursor-not-allowed
        const hasDisabledStyles = disabled 
          ? input.classList.contains('opacity-50') && input.classList.contains('cursor-not-allowed')
          : !input.classList.contains('opacity-50');
        
        // Should be actually disabled
        const isDisabled = disabled ? input.hasAttribute('disabled') : !input.hasAttribute('disabled');
        
        // Should still have size classes regardless of disabled state
        const sizeClasses = sizeExpectedClasses[size];
        const hasSizeClasses = sizeClasses.every(cls => input.classList.contains(cls));
        
        unmount();
        return hasDisabledStyles && isDisabled && hasSizeClasses;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any error state, Input applies error styles consistently', () => {
    fc.assert(
      fc.property(typeArb, sizeArb, errorArb, (type, size, error) => {
        const { unmount } = render(<Input type={type} size={size} error={error} data-testid="input" />);
        const input = screen.getByTestId('input');
        
        // When error is present, should have error border
        const hasErrorStyles = error 
          ? input.classList.contains('border-red-500')
          : !input.classList.contains('border-red-500');
        
        // Should have aria-invalid when error is present
        const hasAriaInvalid = error 
          ? input.getAttribute('aria-invalid') === 'true'
          : input.getAttribute('aria-invalid') === 'false';
        
        // Error message should be displayed when error is present
        const errorElement = document.querySelector('[data-testid="input-error"]');
        const hasErrorMessage = error ? errorElement !== null : errorElement === null;
        
        // Should still have size classes regardless of error state
        const sizeClasses = sizeExpectedClasses[size];
        const hasSizeClasses = sizeClasses.every(cls => input.classList.contains(cls));
        
        unmount();
        return hasErrorStyles && hasAriaInvalid && hasErrorMessage && hasSizeClasses;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any icon position, Input renders icon in correct position', () => {
    fc.assert(
      fc.property(iconPositionArb, (iconPosition) => {
        const { unmount } = render(
          <Input 
            icon={<span>icon</span>} 
            iconPosition={iconPosition} 
            data-testid="input" 
          />
        );
        
        const leftIcon = document.querySelector('[data-testid="input-icon-left"]');
        const rightIcon = document.querySelector('[data-testid="input-icon-right"]');
        
        const hasCorrectIconPosition = iconPosition === 'left' 
          ? leftIcon !== null && rightIcon === null
          : leftIcon === null && rightIcon !== null;
        
        unmount();
        return hasCorrectIconPosition;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: Password type with showPasswordToggle renders toggle button', () => {
    fc.assert(
      fc.property(fc.boolean(), (showPasswordToggle) => {
        const { unmount } = render(
          <Input 
            type="password" 
            showPasswordToggle={showPasswordToggle} 
            data-testid="input" 
          />
        );
        
        const toggleButton = document.querySelector('[data-testid="password-toggle"]');
        const hasCorrectToggle = showPasswordToggle 
          ? toggleButton !== null 
          : toggleButton === null;
        
        unmount();
        return hasCorrectToggle;
      }),
      { numRuns: 100 }
    );
  });
});
