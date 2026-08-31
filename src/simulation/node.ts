import type { RepresentationNode, CreateNodeOptions } from '../types';

/**
 * Create a RepresentationNode with validated defaults.
 *
 * Defaults:
 * - resolution: 1.0 (full resolution)
 * - confidence: 0.8
 * - source: 'internal'
 * - updateability: 0.5
 * - isCompressed: false
 * - descendantCentrality: 0 (computed later by centrality module)
 * - pathCentrality: 0 (computed later by centrality module)
 *
 * Throws if resolution would be outside [0, 1] or activationThreshold < 0.
 */
export function createNode(options: CreateNodeOptions): RepresentationNode {
  const {
    id,
    label,
    category,
    activationThreshold = 0.5,
    confidence = 0.8,
    source = 'internal',
    updateability = 0.5,
  } = options;

  if (activationThreshold < 0) {
    throw new RangeError(
      `activationThreshold must be non-negative, got ${activationThreshold}`
    );
  }

  if (confidence < 0 || confidence > 1) {
    throw new RangeError(
      `confidence must be in [0, 1], got ${confidence}`
    );
  }

  if (updateability < 0 || updateability > 1) {
    throw new RangeError(
      `updateability must be in [0, 1], got ${updateability}`
    );
  }

  return {
    id,
    label,
    category,
    resolution: 1.0,
    confidence,
    source,
    updateability,
    activationThreshold,
    isCompressed: false,
    descendantCentrality: 0,
    pathCentrality: 0,
  };
}

/**
 * Clamp resolution to valid range [0, 1].
 * Returns the clamped value.
 */
export function clampResolution(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Update a node's resolution, clamping to valid range.
 * Sets isCompressed flag if resolution drops below 0.3.
 */
export function updateNodeResolution(
  node: RepresentationNode,
  newResolution: number
): RepresentationNode {
  const clamped = clampResolution(newResolution);
  return {
    ...node,
    resolution: clamped,
    isCompressed: clamped < 0.3,
  };
}
