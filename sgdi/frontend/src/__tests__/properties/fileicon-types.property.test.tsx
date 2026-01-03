/**
 * Property-Based Test for FileIcon Types
 * 
 * Feature: integracao-templates, Property 13: Component Variant Rendering
 * Validates: Requirements 15.7
 * 
 * Property: For any valid combination of type and size props passed to FileIcon,
 * the component SHALL apply the correct CSS classes and visual styles corresponding to the specified type.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '../../test/test-utils';
import { FileIcon, FileType } from '../../components/common/FileIcon';

// Define the expected CSS color classes for each file type
const typeExpectedColors: Record<FileType, string> = {
  pdf: 'text-red-500',
  docx: 'text-blue-600',
  xlsx: 'text-green-600',
  pptx: 'text-orange-500',
  jpg: 'text-purple-500',
  png: 'text-purple-500',
  zip: 'text-amber-600',
  folder: 'text-amber-500',
  unknown: 'text-gray-500',
};

// Define the expected CSS classes for each size
const sizeExpectedClasses: Record<string, string[]> = {
  sm: ['w-4', 'h-4'],
  md: ['w-6', 'h-6'],
  lg: ['w-8', 'h-8'],
};

// Arbitraries for FileIcon props
const fileTypeArb = fc.constantFrom(
  'pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png', 'zip', 'folder', 'unknown'
) as fc.Arbitrary<FileType>;
const sizeArb = fc.constantFrom('sm', 'md', 'lg') as fc.Arbitrary<'sm' | 'md' | 'lg'>;

describe('FileIcon Type Rendering Property Tests', () => {
  it('Property 13: For any file type, FileIcon applies correct color CSS class', () => {
    fc.assert(
      fc.property(fileTypeArb, (type) => {
        const { unmount } = render(<FileIcon type={type} />);
        const icon = screen.getByTestId('file-icon');
        
        const expectedColorClass = typeExpectedColors[type];
        const hasCorrectColorClass = icon.classList.contains(expectedColorClass);
        
        // Verify data-type attribute is set correctly
        const hasCorrectDataAttribute = icon.getAttribute('data-type') === type;
        
        unmount();
        return hasCorrectColorClass && hasCorrectDataAttribute;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any size, FileIcon applies correct size CSS classes', () => {
    fc.assert(
      fc.property(sizeArb, (size) => {
        const { unmount } = render(<FileIcon type="pdf" size={size} />);
        const icon = screen.getByTestId('file-icon');
        
        const expectedClasses = sizeExpectedClasses[size];
        const hasAllExpectedClasses = expectedClasses.every(cls => icon.classList.contains(cls));
        
        // Verify data-size attribute is set correctly
        const hasCorrectDataAttribute = icon.getAttribute('data-size') === size;
        
        unmount();
        return hasAllExpectedClasses && hasCorrectDataAttribute;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: For any combination of type and size, FileIcon applies both color and size CSS classes', () => {
    fc.assert(
      fc.property(fileTypeArb, sizeArb, (type, size) => {
        const { unmount } = render(<FileIcon type={type} size={size} />);
        const icon = screen.getByTestId('file-icon');
        
        const expectedColorClass = typeExpectedColors[type];
        const expectedSizeClasses = sizeExpectedClasses[size];
        
        const hasColorClass = icon.classList.contains(expectedColorClass);
        const hasSizeClasses = expectedSizeClasses.every(cls => icon.classList.contains(cls));
        
        // Verify data attributes are set correctly
        const hasCorrectTypeAttr = icon.getAttribute('data-type') === type;
        const hasCorrectSizeAttr = icon.getAttribute('data-size') === size;
        
        unmount();
        return hasColorClass && hasSizeClasses && hasCorrectTypeAttr && hasCorrectSizeAttr;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: FileIcon always renders as SVG element with correct base attributes', () => {
    fc.assert(
      fc.property(fileTypeArb, sizeArb, (type, size) => {
        const { unmount } = render(<FileIcon type={type} size={size} />);
        const icon = screen.getByTestId('file-icon');
        
        // Verify it's an SVG element with correct base attributes
        const isSvgElement = icon.tagName.toLowerCase() === 'svg';
        const hasCorrectViewBox = icon.getAttribute('viewBox') === '0 0 24 24';
        const hasCorrectFill = icon.getAttribute('fill') === 'none';
        const hasCorrectStroke = icon.getAttribute('stroke') === 'currentColor';
        
        unmount();
        return isSvgElement && hasCorrectViewBox && hasCorrectFill && hasCorrectStroke;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: FileIcon renders SVG path content for each file type', () => {
    fc.assert(
      fc.property(fileTypeArb, (type) => {
        const { unmount } = render(<FileIcon type={type} />);
        const icon = screen.getByTestId('file-icon');
        
        // Verify the SVG contains a path element
        const pathElement = icon.querySelector('path');
        const hasPathElement = pathElement !== null;
        
        unmount();
        return hasPathElement;
      }),
      { numRuns: 100 }
    );
  });
});
