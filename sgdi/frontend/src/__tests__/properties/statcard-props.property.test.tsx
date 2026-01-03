/**
 * Property-Based Test for StatCard Props Rendering
 * 
 * Feature: integracao-templates, Property 1: StatCard Props Rendering
 * Validates: Requirements 2.6
 * 
 * Property: For any valid combination of icon, label, value, and color props passed to StatCard_Component,
 * the component SHALL render all props correctly with the appropriate color styling applied.
 */
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '../../test/test-utils';
import { StatCard, StatCardProps } from '../../components/dashboard/StatCard';

// Define the expected CSS classes for each color variant
const colorExpectedClasses: Record<StatCardProps['color'], { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-primary' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
};

// Arbitraries for StatCard props
const colorArb = fc.constantFrom('blue', 'purple', 'orange', 'green') as fc.Arbitrary<StatCardProps['color']>;
const iconArb = fc.constantFrom('description', 'folder', 'share', 'pending_actions', 'cloud_upload', 'task');
const labelArb = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);
const valueStringArb = fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0);
const valueNumberArb = fc.integer({ min: 0, max: 999999 });
const valueArb = fc.oneof(valueStringArb, valueNumberArb);

const trendDirectionArb = fc.constantFrom('up', 'down') as fc.Arbitrary<'up' | 'down'>;
const trendValueArb = fc.integer({ min: 0, max: 100 });
const trendLabelArb = fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0);
const trendArb = fc.record({
  value: trendValueArb,
  direction: trendDirectionArb,
  label: trendLabelArb,
});

describe('StatCard Props Rendering Property Tests', () => {
  it('Property 1: For any color, StatCard applies correct CSS classes to icon container', () => {
    fc.assert(
      fc.property(colorArb, iconArb, labelArb, valueArb, (color, icon, label, value) => {
        const { unmount } = render(
          <StatCard icon={icon} label={label} value={value} color={color} />
        );
        
        const card = screen.getByTestId('stat-card');
        const iconContainer = screen.getByTestId('stat-card-icon-container');
        
        // Verify data-color attribute is set correctly
        const hasCorrectColorAttr = card.getAttribute('data-color') === color;
        
        // Verify icon container has correct color classes
        const expectedClasses = colorExpectedClasses[color];
        const hasBgClass = iconContainer.classList.contains(expectedClasses.bg);
        const hasTextClass = iconContainer.classList.contains(expectedClasses.text);
        
        unmount();
        return hasCorrectColorAttr && hasBgClass && hasTextClass;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: For any icon prop, StatCard renders the icon correctly', () => {
    fc.assert(
      fc.property(colorArb, iconArb, labelArb, valueArb, (color, icon, label, value) => {
        const { unmount } = render(
          <StatCard icon={icon} label={label} value={value} color={color} />
        );
        
        const iconElement = screen.getByTestId('stat-card-icon');
        const hasCorrectIcon = iconElement.textContent === icon;
        
        unmount();
        return hasCorrectIcon;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: For any label prop, StatCard renders the label correctly', () => {
    fc.assert(
      fc.property(colorArb, iconArb, labelArb, valueArb, (color, icon, label, value) => {
        const { unmount } = render(
          <StatCard icon={icon} label={label} value={value} color={color} />
        );
        
        const labelElement = screen.getByTestId('stat-card-label');
        const hasCorrectLabel = labelElement.textContent === label;
        
        unmount();
        return hasCorrectLabel;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: For any value prop (string or number), StatCard renders the value correctly', () => {
    fc.assert(
      fc.property(colorArb, iconArb, labelArb, valueArb, (color, icon, label, value) => {
        const { unmount } = render(
          <StatCard icon={icon} label={label} value={value} color={color} />
        );
        
        const valueElement = screen.getByTestId('stat-card-value');
        const hasCorrectValue = valueElement.textContent === String(value);
        
        unmount();
        return hasCorrectValue;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: For any trend prop, StatCard renders trend with correct direction styling', () => {
    fc.assert(
      fc.property(colorArb, iconArb, labelArb, valueArb, trendArb, (color, icon, label, value, trend) => {
        const { unmount } = render(
          <StatCard icon={icon} label={label} value={value} color={color} trend={trend} />
        );
        
        const trendElement = screen.getByTestId('stat-card-trend');
        const trendValueElement = screen.getByTestId('stat-card-trend-value');
        const trendLabelElement = screen.getByTestId('stat-card-trend-label');
        
        // Verify trend is rendered
        const trendExists = trendElement !== null;
        
        // Verify direction attribute
        const hasCorrectDirection = trendValueElement.getAttribute('data-direction') === trend.direction;
        
        // Verify trend value contains the percentage
        const hasCorrectTrendValue = trendValueElement.textContent?.includes(`${trend.value}%`);
        
        // Verify trend label
        const hasCorrectTrendLabel = trendLabelElement.textContent === trend.label;
        
        // Verify correct color class based on direction
        const hasCorrectTrendColor = trend.direction === 'up'
          ? trendValueElement.classList.contains('text-green-600')
          : trendValueElement.classList.contains('text-red-600');
        
        unmount();
        return trendExists && hasCorrectDirection && hasCorrectTrendValue && hasCorrectTrendLabel && hasCorrectTrendColor;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: StatCard without trend prop does not render trend section', () => {
    fc.assert(
      fc.property(colorArb, iconArb, labelArb, valueArb, (color, icon, label, value) => {
        const { unmount } = render(
          <StatCard icon={icon} label={label} value={value} color={color} />
        );
        
        const trendElement = screen.queryByTestId('stat-card-trend');
        const trendNotRendered = trendElement === null;
        
        unmount();
        return trendNotRendered;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: For any combination of all props, StatCard renders all elements correctly', () => {
    fc.assert(
      fc.property(
        colorArb, 
        iconArb, 
        labelArb, 
        valueArb, 
        fc.option(trendArb, { nil: undefined }),
        (color, icon, label, value, trend) => {
          const { unmount } = render(
            <StatCard icon={icon} label={label} value={value} color={color} trend={trend} />
          );
          
          const card = screen.getByTestId('stat-card');
          const iconElement = screen.getByTestId('stat-card-icon');
          const labelElement = screen.getByTestId('stat-card-label');
          const valueElement = screen.getByTestId('stat-card-value');
          const iconContainer = screen.getByTestId('stat-card-icon-container');
          
          // Verify all required elements exist
          const allElementsExist = card && iconElement && labelElement && valueElement && iconContainer;
          
          // Verify color is applied
          const hasCorrectColor = card.getAttribute('data-color') === color;
          
          // Verify content
          const hasCorrectIcon = iconElement.textContent === icon;
          const hasCorrectLabel = labelElement.textContent === label;
          const hasCorrectValue = valueElement.textContent === String(value);
          
          // Verify trend rendering matches prop
          const trendElement = screen.queryByTestId('stat-card-trend');
          const trendRenderingCorrect = trend ? trendElement !== null : trendElement === null;
          
          unmount();
          return allElementsExist && hasCorrectColor && hasCorrectIcon && hasCorrectLabel && hasCorrectValue && trendRenderingCorrect;
        }
      ),
      { numRuns: 100 }
    );
  });
});
