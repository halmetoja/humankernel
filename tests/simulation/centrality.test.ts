import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Network } from '../../src/simulation/network';
import { createNode } from '../../src/simulation/node';
import {
  computeDescendantCentrality,
  computePathCentrality,
  applyCentralityMetrics,
} from '../../src/simulation/centrality';
import type { NodeCategory, RegulationSource } from '../../src/types';

function buildChainNetwork(): Network {
  // A -> B -> C -> D (linear chain)
  const net = new Network(1.0, 0);
  net.addNode(createNode({ id: 'a', label: 'root', category: 'ontological' }));
  net.addNode(createNode({ id: 'b', label: 'mid1', category: 'identity' }));
  net.addNode(createNode({ id: 'c', label: 'mid2', category: 'relational' }));
  net.addNode(createNode({ id: 'd', label: 'leaf', category: 'peripheral' }));
  net.addEdge({ sourceId: 'a', targetId: 'b', weight: 1 });
  net.addEdge({ sourceId: 'b', targetId: 'c', weight: 1 });
  net.addEdge({ sourceId: 'c', targetId: 'd', weight: 1 });
  return net;
}

function buildDiamondNetwork(): Network {
  //     A
  //    / \
  //   B   C
  //    \ /
  //     D
  const net = new Network(1.0, 0);
  net.addNode(createNode({ id: 'a', label: 'root', category: 'ontological' }));
  net.addNode(createNode({ id: 'b', label: 'left', category: 'identity' }));
  net.addNode(createNode({ id: 'c', label: 'right', category: 'identity' }));
  net.addNode(createNode({ id: 'd', label: 'sink', category: 'peripheral' }));
  net.addEdge({ sourceId: 'a', targetId: 'b', weight: 1 });
  net.addEdge({ sourceId: 'a', targetId: 'c', weight: 1 });
  net.addEdge({ sourceId: 'b', targetId: 'd', weight: 1 });
  net.addEdge({ sourceId: 'c', targetId: 'd', weight: 1 });
  return net;
}

describe('computeDescendantCentrality', () => {
  it('leaf nodes have centrality 0', () => {
    const net = buildChainNetwork();
    const result = computeDescendantCentrality(net);
    expect(result.get('d')).toBe(0);
  });

  it('root of chain has centrality equal to chain length - 1', () => {
    const net = buildChainNetwork();
    const result = computeDescendantCentrality(net);
    expect(result.get('a')).toBe(3); // reaches b, c, d
    expect(result.get('b')).toBe(2); // reaches c, d
    expect(result.get('c')).toBe(1); // reaches d
  });

  it('diamond: root reaches all descendants', () => {
    const net = buildDiamondNetwork();
    const result = computeDescendantCentrality(net);
    expect(result.get('a')).toBe(3); // reaches b, c, d
    expect(result.get('b')).toBe(1); // reaches d
    expect(result.get('c')).toBe(1); // reaches d
    expect(result.get('d')).toBe(0);
  });

  it('isolated node has centrality 0', () => {
    const net = new Network();
    net.addNode(createNode({ id: 'solo', label: 'alone', category: 'peripheral' }));
    const result = computeDescendantCentrality(net);
    expect(result.get('solo')).toBe(0);
  });
});

describe('computePathCentrality', () => {
  it('path centrality is non-negative for all nodes', () => {
    const net = buildDiamondNetwork();
    const result = computePathCentrality(net);
    for (const [, value] of result) {
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  it('chain: middle nodes have higher path centrality than endpoints', () => {
    const net = buildChainNetwork();
    const result = computePathCentrality(net);
    // Middle nodes participate in more paths
    const a = result.get('a')!;
    const b = result.get('b')!;
    const c = result.get('c')!;
    const d = result.get('d')!;
    expect(b).toBeGreaterThan(d);
    expect(c).toBeGreaterThan(d);
    // Root still participates in many paths
    expect(a).toBeGreaterThan(0);
  });

  it('diamond: root has highest path centrality', () => {
    const net = buildDiamondNetwork();
    const result = computePathCentrality(net);
    const a = result.get('a')!;
    const b = result.get('b')!;
    const d = result.get('d')!;
    // Root sits on all paths from top to bottom
    expect(a).toBeGreaterThanOrEqual(b);
    expect(a).toBeGreaterThanOrEqual(d);
  });
});

describe('applyCentralityMetrics', () => {
  it('updates descendantCentrality and pathCentrality on all nodes', () => {
    const net = buildChainNetwork();
    applyCentralityMetrics(net);

    const a = net.getNode('a')!;
    const d = net.getNode('d')!;

    expect(a.descendantCentrality).toBe(3);
    expect(d.descendantCentrality).toBe(0);
    expect(a.pathCentrality).toBeGreaterThan(0);
    expect(d.pathCentrality).toBeGreaterThanOrEqual(0);
  });

  it('centrality survives serialization round-trip', () => {
    const net = buildChainNetwork();
    applyCentralityMetrics(net);

    const restored = Network.deserialize(JSON.parse(JSON.stringify(net.serialize())));
    const a = restored.getNode('a')!;
    expect(a.descendantCentrality).toBe(3);
    expect(a.pathCentrality).toBeGreaterThan(0);
  });
});


// --- Arbitrary generators ---

const arbCategory: fc.Arbitrary<NodeCategory> = fc.constantFrom(
  'ontological', 'identity', 'relational', 'functional', 'peripheral'
);

const arbSource: fc.Arbitrary<RegulationSource> = fc.constantFrom(
  'internal', 'external', 'mixed'
);

/**
 * Generate a valid DAG network with N nodes and forward-only edges.
 */
function arbDAGNetwork(minNodes: number = 2, maxNodes: number = 8): fc.Arbitrary<Network> {
  return fc.integer({ min: minNodes, max: maxNodes }).chain((nodeCount) => {
    const nodesArb = fc.tuple(
      ...Array.from({ length: nodeCount }, () =>
        fc.record({
          category: arbCategory,
          activationThreshold: fc.double({ min: 0, max: 5, noNaN: true }),
          confidence: fc.double({ min: 0, max: 1, noNaN: true }),
          source: arbSource,
          updateability: fc.double({ min: 0, max: 1, noNaN: true }),
        })
      )
    );

    const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
    const edgesArb = fc.tuple(
      fc.array(fc.boolean(), { minLength: maxEdges, maxLength: maxEdges }),
      fc.array(fc.double({ min: 0.1, max: 1, noNaN: true }), { minLength: maxEdges, maxLength: maxEdges })
    );

    return fc.tuple(nodesArb, edgesArb).map(([nodeProps, [edgeFlags, edgeWeights]]) => {
      const net = new Network(1.0, 0);

      for (let i = 0; i < nodeCount; i++) {
        const props = nodeProps[i]!;
        net.addNode(
          createNode({
            id: `n${i}`,
            label: `Node ${i}`,
            category: props.category,
            activationThreshold: props.activationThreshold,
            confidence: props.confidence,
            source: props.source,
            updateability: props.updateability,
          })
        );
      }

      let edgeIdx = 0;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (edgeFlags[edgeIdx]) {
            net.addEdge({
              sourceId: `n${i}`,
              targetId: `n${j}`,
              weight: edgeWeights[edgeIdx]!,
            });
          }
          edgeIdx++;
        }
      }

      return net;
    });
  });
}

// --- Property-based tests ---

describe('Property-based: descendant centrality', () => {
  it('leaf nodes (no outgoing edges) always have descendant centrality 0', () => {
    /**Validates: Requirements 2.2*/
    fc.assert(
      fc.property(arbDAGNetwork(), (net) => {
        const centrality = computeDescendantCentrality(net);

        for (const node of net.getAllNodes()) {
          const dependents = net.getDependents(node.id);
          if (dependents.length === 0) {
            expect(centrality.get(node.id)).toBe(0);
          }
        }
      }),
      { numRuns: 50 }
    );
  });

  it('descendant centrality is bounded by (nodeCount - 1)', () => {
    fc.assert(
      fc.property(arbDAGNetwork(), (net) => {
        const centrality = computeDescendantCentrality(net);
        const maxPossible = net.getNodeCount() - 1;

        for (const [, value] of centrality) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(maxPossible);
        }
      }),
      { numRuns: 50 }
    );
  });
});

describe('Property-based: path centrality', () => {
  it('path centrality is non-negative for all nodes in any valid DAG', () => {
    /**Validates: Requirements 2.3*/
    fc.assert(
      fc.property(arbDAGNetwork(), (net) => {
        const centrality = computePathCentrality(net);

        for (const [, value] of centrality) {
          expect(value).toBeGreaterThanOrEqual(0);
        }
      }),
      { numRuns: 50 }
    );
  });
});

describe('Property-based: centrality after serialization round-trip', () => {
  it('centrality values are consistent after serialize -> deserialize', () => {
    /**Validates: Requirements 3.3*/
    fc.assert(
      fc.property(arbDAGNetwork(), (net) => {
        applyCentralityMetrics(net);

        const restored = Network.deserialize(JSON.parse(JSON.stringify(net.serialize())));

        for (const originalNode of net.getAllNodes()) {
          const restoredNode = restored.getNode(originalNode.id)!;
          expect(restoredNode.descendantCentrality).toBe(originalNode.descendantCentrality);
          expect(restoredNode.pathCentrality).toBe(originalNode.pathCentrality);
        }
      }),
      { numRuns: 50 }
    );
  });

  it('recomputing centrality after round-trip gives same values', () => {
    fc.assert(
      fc.property(arbDAGNetwork(), (net) => {
        applyCentralityMetrics(net);
        const originalCentralities = new Map<string, { desc: number; path: number }>();
        for (const node of net.getAllNodes()) {
          originalCentralities.set(node.id, {
            desc: node.descendantCentrality,
            path: node.pathCentrality,
          });
        }

        // Round-trip and recompute
        const restored = Network.deserialize(JSON.parse(JSON.stringify(net.serialize())));
        applyCentralityMetrics(restored);

        for (const node of restored.getAllNodes()) {
          const original = originalCentralities.get(node.id)!;
          expect(node.descendantCentrality).toBe(original.desc);
          expect(node.pathCentrality).toBe(original.path);
        }
      }),
      { numRuns: 50 }
    );
  });
});
