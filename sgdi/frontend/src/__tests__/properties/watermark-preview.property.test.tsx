/**
 * Property-Based Test for Watermark Preview Sync
 * 
 * Feature: integracao-templates, Property 8: Watermark Preview Sync
 * Validates: Requirements 9.5
 * 
 * Property: For any watermark configuration (text, position, color, size, opacity),
 * the preview in Settings_Component SHALL immediately reflect the current settings
 * without requiring a save action.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '../../test/test-utils';
import WatermarkSettings, { WatermarkConfig } from '../../components/settings/WatermarkSettings';

// Define valid positions
const validPositions: WatermarkConfig['position'][] = [
  'center-diagonal',
  'center-horizontal',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'tiled'
];

// Arbitraries for WatermarkConfig props
const positionArb = fc.constantFrom(...validPositions);
const hexCharArb = fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
const colorArb = fc.tuple(hexCharArb, hexCharArb, hexCharArb, hexCharArb, hexCharArb, hexCharArb)
  .map(chars => `#${chars.join('')}`);
const sizeArb = fc.integer({ min: 10, max: 100 });
const opacityArb = fc.integer({ min: 0, max: 100 });
const textArb = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);

// Full config arbitrary
const watermarkConfigArb = fc.record({
  enabled: fc.constant(true),
  text: textArb,
  position: positionArb,
  color: colorArb,
  size: sizeArb,
  opacity: opacityArb
});

describe('Watermark Preview Sync Property Tests', () => {
  // Helper function to convert hex color to rgb format
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  it('Property 8: For any initial config, preview immediately reflects all settings', () => {
    fc.assert(
      fc.property(watermarkConfigArb, (config) => {
        const { unmount } = render(
          <WatermarkSettings initialConfig={config} />
        );
        
        const previewText = screen.getByTestId('watermark-preview-text');
        
        // Verify position is reflected
        const hasCorrectPosition = previewText.getAttribute('data-position') === config.position;
        
        // Verify color is reflected (data attribute stores original hex)
        const hasCorrectColor = previewText.getAttribute('data-color') === config.color;
        
        // Verify size is reflected
        const hasCorrectSize = previewText.getAttribute('data-size') === String(config.size);
        
        // Verify opacity is reflected
        const hasCorrectOpacity = previewText.getAttribute('data-opacity') === String(config.opacity);
        
        // Verify style attributes are applied
        const style = previewText.style;
        const hasCorrectFontSize = style.fontSize === `${config.size}px`;
        // Browser converts hex to rgb, so we check both formats
        const hasCorrectStyleColor = style.color === config.color || style.color === hexToRgb(config.color);
        const hasCorrectStyleOpacity = style.opacity === String(config.opacity / 100);
        
        unmount();
        return hasCorrectPosition && hasCorrectColor && hasCorrectSize && hasCorrectOpacity &&
               hasCorrectFontSize && hasCorrectStyleColor && hasCorrectStyleOpacity;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: For any size change, preview immediately updates font size', () => {
    fc.assert(
      fc.property(sizeArb, sizeArb, (initialSize, newSize) => {
        fc.pre(initialSize !== newSize);
        
        const initialConfig: WatermarkConfig = {
          enabled: true,
          text: 'Test Watermark',
          position: 'center-diagonal',
          color: '#dc2626',
          size: initialSize,
          opacity: 50
        };
        
        const { unmount } = render(
          <WatermarkSettings initialConfig={initialConfig} />
        );
        
        // Change size via slider using testid
        const sizeSlider = screen.getByTestId('watermark-size-slider') as HTMLInputElement;
        fireEvent.change(sizeSlider, { target: { value: String(newSize) } });
        
        // Verify preview immediately reflects new size
        const previewText = screen.getByTestId('watermark-preview-text');
        const hasUpdatedSize = previewText.style.fontSize === `${newSize}px`;
        const hasUpdatedDataAttr = previewText.getAttribute('data-size') === String(newSize);
        
        unmount();
        return hasUpdatedSize && hasUpdatedDataAttr;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: For any opacity change, preview immediately updates opacity', () => {
    fc.assert(
      fc.property(opacityArb, opacityArb, (initialOpacity, newOpacity) => {
        fc.pre(initialOpacity !== newOpacity);
        
        const initialConfig: WatermarkConfig = {
          enabled: true,
          text: 'Test Watermark',
          position: 'center-diagonal',
          color: '#dc2626',
          size: 24,
          opacity: initialOpacity
        };
        
        const { unmount } = render(
          <WatermarkSettings initialConfig={initialConfig} />
        );
        
        // Change opacity via slider using testid
        const opacitySlider = screen.getByTestId('watermark-opacity-slider') as HTMLInputElement;
        fireEvent.change(opacitySlider, { target: { value: String(newOpacity) } });
        
        // Verify preview immediately reflects new opacity
        const previewText = screen.getByTestId('watermark-preview-text');
        const expectedOpacity = String(newOpacity / 100);
        const hasUpdatedOpacity = previewText.style.opacity === expectedOpacity;
        const hasUpdatedDataAttr = previewText.getAttribute('data-opacity') === String(newOpacity);
        
        unmount();
        return hasUpdatedOpacity && hasUpdatedDataAttr;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: For any position change, preview immediately updates position', () => {
    fc.assert(
      fc.property(positionArb, positionArb, (initialPosition, newPosition) => {
        fc.pre(initialPosition !== newPosition);
        
        const initialConfig: WatermarkConfig = {
          enabled: true,
          text: 'Test Watermark',
          position: initialPosition,
          color: '#dc2626',
          size: 24,
          opacity: 50
        };
        
        const { unmount } = render(
          <WatermarkSettings initialConfig={initialConfig} />
        );
        
        // Change position via select using testid
        const positionSelect = screen.getByTestId('watermark-position-select') as HTMLSelectElement;
        fireEvent.change(positionSelect, { target: { value: newPosition } });
        
        // Verify preview immediately reflects new position
        const previewText = screen.getByTestId('watermark-preview-text');
        const hasUpdatedPosition = previewText.getAttribute('data-position') === newPosition;
        
        unmount();
        return hasUpdatedPosition;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: For any text change, preview immediately updates text content', () => {
    fc.assert(
      fc.property(textArb, textArb, (initialText, newText) => {
        fc.pre(initialText !== newText);
        
        const initialConfig: WatermarkConfig = {
          enabled: true,
          text: initialText,
          position: 'center-diagonal',
          color: '#dc2626',
          size: 24,
          opacity: 50
        };
        
        const { unmount } = render(
          <WatermarkSettings initialConfig={initialConfig} />
        );
        
        // Change text via input using testid
        const textInput = screen.getByTestId('watermark-text-input') as HTMLInputElement;
        fireEvent.change(textInput, { target: { value: newText } });
        
        // Verify preview immediately reflects new text
        const previewText = screen.getByTestId('watermark-preview-text');
        const hasUpdatedText = previewText.textContent === newText;
        
        unmount();
        return hasUpdatedText;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: Preview updates without requiring save action (onSave callback is optional)', () => {
    fc.assert(
      fc.property(watermarkConfigArb, sizeArb, (config, newSize) => {
        fc.pre(config.size !== newSize);
        
        // Render WITHOUT onSave callback
        const { unmount } = render(
          <WatermarkSettings initialConfig={config} />
        );
        
        // Change size
        const sizeSlider = screen.getByTestId('watermark-size-slider') as HTMLInputElement;
        fireEvent.change(sizeSlider, { target: { value: String(newSize) } });
        
        // Verify preview still updates even without onSave
        const previewText = screen.getByTestId('watermark-preview-text');
        const hasUpdatedSize = previewText.style.fontSize === `${newSize}px`;
        
        unmount();
        return hasUpdatedSize;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: When watermark is disabled, preview is not shown', () => {
    fc.assert(
      fc.property(watermarkConfigArb, (config) => {
        const disabledConfig = { ...config, enabled: false };
        
        const { unmount } = render(
          <WatermarkSettings initialConfig={disabledConfig} />
        );
        
        // Verify preview text is not rendered when disabled
        const previewText = screen.queryByTestId('watermark-preview-text');
        const isHidden = previewText === null;
        
        unmount();
        return isHidden;
      }),
      { numRuns: 100 }
    );
  });
});
