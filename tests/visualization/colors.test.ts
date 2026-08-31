import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  resolutionToColor,
  resolutionStateLabel,
  resolutionCssVar,
} from '../../src/visualization/colors';

describe('resolutionToColor', () => {
  it('returns green (#4caf50) at resolution 1.0', () => {
    expect(resolutionToColor(1.0)).toBe('#4caf50');
  });

  it('returns yellow (#ffeb3b) at resolution 0.5', () => {
    expect(resolutionToColor(0.5)).toBe('#ffeb3b');
  });

  it('returns red (#f44336) at resolution 0.0', () => {
    expect(resolutionToColor(0.0)).toBe('#f44336');
  });

  it('clamps values above 1.0 to green', () => {
    expect(resolutionToColor(1.5)).toBe('#4caf50');
    expect(resolutionToColor(100)).toBe('#4caf50');
  });

  it('clamps values below 0.0 to red', () => {
    expect(resolutionToColor(-0.5)).toBe('#f44336');
    expect(resolutionToColor(-100)).toBe('#f44336');
  });

  it('returns valid hex color for midpoints', () => {
    const color025 = resolutionToColor(0.25);
    expect(color025).toMatch(/^#[0-9a-f]{6}$/);

    const color075 = resolutionToColor(0.75);
    expect(color075).toMatch(/^#[0-9a-f]{6}$/);
  });

  /**
   * Property: resolutionToColor always returns a valid hex color for any input.
   * Validates: Requirements 8.2
   */
  it('always returns a valid hex color for any number', () => {
    fc.assert(
      fc.property(fc.double({ min: -10, max: 10, noNaN: true }), (resolution) => {
        const color = resolutionToColor(resolution);
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
      })
    );
  });

  /**
   * Property: gradient monotonically transitions from red through yellow to green.
   * Higher resolution should have higher green channel and lower red channel overall.
   * Validates: Requirements 8.2
   */
  it('monotonically transitions: red channel decreases as resolution increases from 0.5 to 1.0', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.5, max: 1.0, noNaN: true }),
        fc.double({ min: 0.5, max: 1.0, noNaN: true }),
        (a, b) => {
          const lower = Math.min(a, b);
          const higher = Math.max(a, b);
          if (lower === higher) return;

          const colorLower = resolutionToColor(lower);
          const colorHigher = resolutionToColor(higher);

          // Extract red channel
          const redLower = parseInt(colorLower.slice(1, 3), 16);
          const redHigher = parseInt(colorHigher.slice(1, 3), 16);

          // Red should decrease or stay same as resolution increases in [0.5, 1.0]
          expect(redHigher).toBeLessThanOrEqual(redLower);
        }
      )
    );
  });

  /**
   * Property: green channel increases as resolution increases from 0.0 to 0.5.
   * Validates: Requirements 8.2
   */
  it('green channel increases as resolution increases from 0.0 to 0.5', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.0, max: 0.5, noNaN: true }),
        fc.double({ min: 0.0, max: 0.5, noNaN: true }),
        (a, b) => {
          const lower = Math.min(a, b);
          const higher = Math.max(a, b);
          if (lower === higher) return;

          const colorLower = resolutionToColor(lower);
          const colorHigher = resolutionToColor(higher);

          // Extract green channel
          const greenLower = parseInt(colorLower.slice(3, 5), 16);
          const greenHigher = parseInt(colorHigher.slice(3, 5), 16);

          // Green should increase or stay same as resolution increases in [0.0, 0.5]
          expect(greenHigher).toBeGreaterThanOrEqual(greenLower);
        }
      )
    );
  });
});

describe('resolutionStateLabel', () => {
  it('returns "Full resolution" for values >= 0.8', () => {
    expect(resolutionStateLabel(1.0)).toBe('Full resolution');
    expect(resolutionStateLabel(0.8)).toBe('Full resolution');
    expect(resolutionStateLabel(0.9)).toBe('Full resolution');
  });

  it('returns "Partial compression" for values in [0.5, 0.8)', () => {
    expect(resolutionStateLabel(0.5)).toBe('Partial compression');
    expect(resolutionStateLabel(0.7)).toBe('Partial compression');
  });

  it('returns "Significant compression" for values in [0.3, 0.5)', () => {
    expect(resolutionStateLabel(0.3)).toBe('Significant compression');
    expect(resolutionStateLabel(0.4)).toBe('Significant compression');
  });

  it('returns "Highly compressed" for values < 0.3', () => {
    expect(resolutionStateLabel(0.0)).toBe('Highly compressed');
    expect(resolutionStateLabel(0.29)).toBe('Highly compressed');
  });

  /**
   * Property: resolutionStateLabel always returns one of the defined labels.
   * Validates: Requirements 8.6
   */
  it('always returns a valid state label for any resolution', () => {
    const validLabels = [
      'Full resolution',
      'Partial compression',
      'Significant compression',
      'Highly compressed',
    ];

    fc.assert(
      fc.property(fc.double({ min: -1, max: 2, noNaN: true }), (resolution) => {
        const label = resolutionStateLabel(resolution);
        expect(validLabels).toContain(label);
      })
    );
  });
});

describe('resolutionCssVar', () => {
  it('returns --accent for high resolution', () => {
    expect(resolutionCssVar(1.0)).toBe('--accent');
    expect(resolutionCssVar(0.7)).toBe('--accent');
  });

  it('returns --warning for medium resolution', () => {
    expect(resolutionCssVar(0.5)).toBe('--warning');
    expect(resolutionCssVar(0.4)).toBe('--warning');
  });

  it('returns --danger for low resolution', () => {
    expect(resolutionCssVar(0.0)).toBe('--danger');
    expect(resolutionCssVar(0.3)).toBe('--danger');
  });
});
