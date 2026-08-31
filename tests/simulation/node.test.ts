import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createNode, clampResolution, updateNodeResolution } from '../../src/simulation/node';
import type { NodeCategory, RegulationSource } from '../../src/types';

describe('createNode', () => {
  it('creates a node with default values', () => {
    const node = createNode({
      id: 'test-1',
      label: 'I exist as separate',
      category: 'ontological',
    });

    expect(node.id).toBe('test-1');
    expect(node.label).toBe('I exist as separate');
    expect(node.category).toBe('ontological');
    expect(node.resolution).toBe(1.0);
    expect(node.confidence).toBe(0.8);
    expect(node.source).toBe('internal');
    expect(node.updateability).toBe(0.5);
    expect(node.activationThreshold).toBe(0.5);
    expect(node.isCompressed).toBe(false);
    expect(node.descendantCentrality).toBe(0);
    expect(node.pathCentrality).toBe(0);
  });

  it('accepts custom values', () => {
    const node = createNode({
      id: 'test-2',
      label: 'I am validated',
      category: 'relational',
      activationThreshold: 0.3,
      confidence: 0.9,
      source: 'external',
      updateability: 0.2,
    });

    expect(node.activationThreshold).toBe(0.3);
    expect(node.confidence).toBe(0.9);
    expect(node.source).toBe('external');
    expect(node.updateability).toBe(0.2);
  });

  it('throws on negative activationThreshold', () => {
    expect(() =>
      createNode({
        id: 'bad',
        label: 'invalid',
        category: 'peripheral',
        activationThreshold: -0.1,
      })
    ).toThrow(RangeError);
  });

  it('throws on confidence outside [0, 1]', () => {
    expect(() =>
      createNode({
        id: 'bad',
        label: 'invalid',
        category: 'peripheral',
        confidence: 1.5,
      })
    ).toThrow(RangeError);

    expect(() =>
      createNode({
        id: 'bad',
        label: 'invalid',
        category: 'peripheral',
        confidence: -0.1,
      })
    ).toThrow(RangeError);
  });

  it('throws on updateability outside [0, 1]', () => {
    expect(() =>
      createNode({
        id: 'bad',
        label: 'invalid',
        category: 'peripheral',
        updateability: 2.0,
      })
    ).toThrow(RangeError);
  });
});

describe('clampResolution', () => {
  it('clamps values below 0 to 0', () => {
    expect(clampResolution(-0.5)).toBe(0);
  });

  it('clamps values above 1 to 1', () => {
    expect(clampResolution(1.5)).toBe(1);
  });

  it('passes through valid values', () => {
    expect(clampResolution(0.7)).toBe(0.7);
    expect(clampResolution(0)).toBe(0);
    expect(clampResolution(1)).toBe(1);
  });
});

describe('updateNodeResolution', () => {
  it('updates resolution and sets isCompressed when below 0.3', () => {
    const node = createNode({
      id: 'n1',
      label: 'test',
      category: 'functional',
    });

    const updated = updateNodeResolution(node, 0.2);
    expect(updated.resolution).toBe(0.2);
    expect(updated.isCompressed).toBe(true);
  });

  it('does not set isCompressed when resolution >= 0.3', () => {
    const node = createNode({
      id: 'n1',
      label: 'test',
      category: 'functional',
    });

    const updated = updateNodeResolution(node, 0.5);
    expect(updated.resolution).toBe(0.5);
    expect(updated.isCompressed).toBe(false);
  });

  it('clamps resolution to [0, 1]', () => {
    const node = createNode({
      id: 'n1',
      label: 'test',
      category: 'functional',
    });

    expect(updateNodeResolution(node, -1).resolution).toBe(0);
    expect(updateNodeResolution(node, 5).resolution).toBe(1);
  });

  it('does not mutate the original node', () => {
    const node = createNode({
      id: 'n1',
      label: 'test',
      category: 'functional',
    });

    updateNodeResolution(node, 0.1);
    expect(node.resolution).toBe(1.0);
    expect(node.isCompressed).toBe(false);
  });
});


// --- Arbitrary generators ---

const arbCategory: fc.Arbitrary<NodeCategory> = fc.constantFrom(
  'ontological', 'identity', 'relational', 'functional', 'peripheral'
);

const arbSource: fc.Arbitrary<RegulationSource> = fc.constantFrom(
  'internal', 'external', 'mixed'
);

const arbValidNodeOptions = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  label: fc.string({ minLength: 1, maxLength: 50 }),
  category: arbCategory,
  activationThreshold: fc.double({ min: 0, max: 10, noNaN: true }),
  confidence: fc.double({ min: 0, max: 1, noNaN: true }),
  source: arbSource,
  updateability: fc.double({ min: 0, max: 1, noNaN: true }),
});

// --- Property-based tests ---

describe('Property-based: clampResolution', () => {
  it('output is always in [0, 1] for any finite input', () => {
    /**Validates: Requirements 2.5*/
    fc.assert(
      fc.property(fc.double({ noNaN: true }), (value) => {
        const result = clampResolution(value);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      })
    );
  });

  it('is idempotent: clamping a clamped value does not change it', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true }), (value) => {
        const once = clampResolution(value);
        const twice = clampResolution(once);
        expect(twice).toBe(once);
      })
    );
  });
});

describe('Property-based: createNode resolution bounds', () => {
  it('resolution is always 1.0 on creation for any valid options', () => {
    /**Validates: Requirements 2.4*/
    fc.assert(
      fc.property(arbValidNodeOptions, (opts) => {
        const node = createNode(opts);
        expect(node.resolution).toBe(1.0);
        expect(node.resolution).toBeGreaterThanOrEqual(0);
        expect(node.resolution).toBeLessThanOrEqual(1);
      })
    );
  });

  it('updateNodeResolution always produces resolution in [0, 1]', () => {
    /**Validates: Requirements 2.5*/
    fc.assert(
      fc.property(
        arbValidNodeOptions,
        fc.double({ noNaN: true }),
        (opts, newRes) => {
          const node = createNode(opts);
          const updated = updateNodeResolution(node, newRes);
          expect(updated.resolution).toBeGreaterThanOrEqual(0);
          expect(updated.resolution).toBeLessThanOrEqual(1);
        }
      )
    );
  });

  it('isCompressed is true iff resolution < 0.3 after update', () => {
    fc.assert(
      fc.property(
        arbValidNodeOptions,
        fc.double({ min: -100, max: 100, noNaN: true }),
        (opts, newRes) => {
          const node = createNode(opts);
          const updated = updateNodeResolution(node, newRes);
          if (updated.resolution < 0.3) {
            expect(updated.isCompressed).toBe(true);
          } else {
            expect(updated.isCompressed).toBe(false);
          }
        }
      )
    );
  });
});

describe('Property-based: createNode threshold validation', () => {
  it('negative activationThreshold always throws RangeError', () => {
    /**Validates: Requirements 2.5*/
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: -Number.MIN_VALUE, noNaN: true }),
        arbCategory,
        (threshold, category) => {
          expect(() =>
            createNode({
              id: 'test',
              label: 'test',
              category,
              activationThreshold: threshold,
            })
          ).toThrow(RangeError);
        }
      )
    );
  });

  it('confidence outside [0, 1] always throws RangeError', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.double({ min: 1.0001, max: 1000, noNaN: true }),
          fc.double({ min: -1000, max: -0.0001, noNaN: true })
        ),
        arbCategory,
        (confidence, category) => {
          expect(() =>
            createNode({
              id: 'test',
              label: 'test',
              category,
              confidence,
            })
          ).toThrow(RangeError);
        }
      )
    );
  });

  it('updateability outside [0, 1] always throws RangeError', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.double({ min: 1.0001, max: 1000, noNaN: true }),
          fc.double({ min: -1000, max: -0.0001, noNaN: true })
        ),
        arbCategory,
        (updateability, category) => {
          expect(() =>
            createNode({
              id: 'test',
              label: 'test',
              category,
              updateability,
            })
          ).toThrow(RangeError);
        }
      )
    );
  });
});
