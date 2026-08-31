import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Network } from '../../src/simulation/network';
import { createNode } from '../../src/simulation/node';
import type { NodeCategory, RegulationSource } from '../../src/types';

function buildSimpleNetwork(): Network {
  const net = new Network(1.0, 0);
  net.addNode(createNode({ id: 'a', label: 'I exist', category: 'ontological' }));
  net.addNode(createNode({ id: 'b', label: 'I have worth', category: 'identity' }));
  net.addNode(createNode({ id: 'c', label: 'I can be loved', category: 'relational' }));
  // a -> b -> c (b depends on a, c depends on b)
  net.addEdge({ sourceId: 'a', targetId: 'b', weight: 0.8 });
  net.addEdge({ sourceId: 'b', targetId: 'c', weight: 0.6 });
  return net;
}

describe('Network', () => {
  it('adds nodes and edges', () => {
    const net = buildSimpleNetwork();
    expect(net.getNodeCount()).toBe(3);
    expect(net.getAllEdges()).toHaveLength(2);
  });

  it('retrieves nodes by id', () => {
    const net = buildSimpleNetwork();
    expect(net.getNode('a')?.label).toBe('I exist');
    expect(net.getNode('nonexistent')).toBeUndefined();
  });

  it('throws on duplicate node id', () => {
    const net = new Network();
    net.addNode(createNode({ id: 'x', label: 'test', category: 'peripheral' }));
    expect(() =>
      net.addNode(createNode({ id: 'x', label: 'dupe', category: 'peripheral' }))
    ).toThrow();
  });

  it('throws on edge with nonexistent source', () => {
    const net = new Network();
    net.addNode(createNode({ id: 'a', label: 'a', category: 'peripheral' }));
    expect(() =>
      net.addEdge({ sourceId: 'nope', targetId: 'a', weight: 0.5 })
    ).toThrow();
  });

  it('throws on self-loop', () => {
    const net = new Network();
    net.addNode(createNode({ id: 'a', label: 'a', category: 'peripheral' }));
    expect(() =>
      net.addEdge({ sourceId: 'a', targetId: 'a', weight: 0.5 })
    ).toThrow();
  });

  it('throws on edge weight outside [0, 1]', () => {
    const net = new Network();
    net.addNode(createNode({ id: 'a', label: 'a', category: 'peripheral' }));
    net.addNode(createNode({ id: 'b', label: 'b', category: 'peripheral' }));
    expect(() =>
      net.addEdge({ sourceId: 'a', targetId: 'b', weight: 1.5 })
    ).toThrow(RangeError);
  });

  it('getDependents returns correct edges', () => {
    const net = buildSimpleNetwork();
    const deps = net.getDependents('a');
    expect(deps).toHaveLength(1);
    expect(deps[0]?.targetId).toBe('b');
  });

  it('getAncestors returns correct edges', () => {
    const net = buildSimpleNetwork();
    const anc = net.getAncestors('c');
    expect(anc).toHaveLength(1);
    expect(anc[0]?.sourceId).toBe('b');
  });

  it('validateDAG returns true for acyclic graph', () => {
    const net = buildSimpleNetwork();
    expect(net.validateDAG()).toBe(true);
  });

  it('validateDAG returns false for cyclic graph', () => {
    const net = new Network();
    net.addNode(createNode({ id: 'a', label: 'a', category: 'peripheral' }));
    net.addNode(createNode({ id: 'b', label: 'b', category: 'peripheral' }));
    net.addEdge({ sourceId: 'a', targetId: 'b', weight: 0.5 });
    net.addEdge({ sourceId: 'b', targetId: 'a', weight: 0.5 });
    expect(net.validateDAG()).toBe(false);
  });

  it('round-trip serialization preserves structure', () => {
    const net = buildSimpleNetwork();
    const serialized = net.serialize();
    const restored = Network.deserialize(serialized);

    expect(restored.getNodeCount()).toBe(3);
    expect(restored.getAllEdges()).toHaveLength(2);
    expect(restored.getNode('a')?.label).toBe('I exist');
    expect(restored.getNode('b')?.category).toBe('identity');
    expect(restored.getIRC()).toBe(1.0);
    expect(restored.getCurrentLoad()).toBe(0);
  });

  it('round-trip via JSON preserves all node properties', () => {
    const net = buildSimpleNetwork();
    const json = JSON.stringify(net.serialize());
    const restored = Network.deserialize(JSON.parse(json));
    const nodeA = restored.getNode('a')!;

    expect(nodeA.resolution).toBe(1.0);
    expect(nodeA.confidence).toBe(0.8);
    expect(nodeA.source).toBe('internal');
    expect(nodeA.updateability).toBe(0.5);
    expect(nodeA.isCompressed).toBe(false);
  });

  it('setCurrentLoad clamps to non-negative', () => {
    const net = new Network();
    net.setCurrentLoad(-5);
    expect(net.getCurrentLoad()).toBe(0);
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
 * Generate a valid DAG network with N nodes and random forward-only edges.
 * Nodes are indexed 0..N-1; edges only go from lower index to higher index,
 * guaranteeing the DAG property.
 */
function arbDAGNetwork(minNodes: number = 2, maxNodes: number = 10): fc.Arbitrary<Network> {
  return fc.integer({ min: minNodes, max: maxNodes }).chain((nodeCount) => {
    // Generate node properties
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

    // Generate edges: for each possible pair (i, j) where i < j, coin flip
    const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
    const edgesArb = fc.tuple(
      fc.array(fc.boolean(), { minLength: maxEdges, maxLength: maxEdges }),
      fc.array(fc.double({ min: 0.1, max: 1, noNaN: true }), { minLength: maxEdges, maxLength: maxEdges })
    );

    return fc.tuple(nodesArb, edgesArb, fc.double({ min: 0.1, max: 10, noNaN: true })).map(
      ([nodeProps, [edgeFlags, edgeWeights], irc]) => {
        const net = new Network(irc, 0);

        // Add nodes
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

        // Add forward-only edges (i < j guarantees DAG)
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
      }
    );
  });
}

// --- Property-based tests ---

describe('Property-based: DAG validation', () => {
  it('any network built with forward-only edges validates as DAG', () => {
    /**Validates: Requirements 3.1*/
    fc.assert(
      fc.property(arbDAGNetwork(), (net) => {
        expect(net.validateDAG()).toBe(true);
      }),
      { numRuns: 50 }
    );
  });

  it('node count matches after construction', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 15 }),
        arbCategory,
        (count, category) => {
          const net = new Network();
          for (let i = 0; i < count; i++) {
            net.addNode(createNode({ id: `n${i}`, label: `Node ${i}`, category }));
          }
          expect(net.getNodeCount()).toBe(count);
        }
      )
    );
  });
});

describe('Property-based: round-trip serialization', () => {
  it('serialize -> JSON -> deserialize preserves all node properties', () => {
    /**Validates: Requirements 3.3*/
    fc.assert(
      fc.property(arbDAGNetwork(), (net) => {
        const serialized = net.serialize();
        const json = JSON.stringify(serialized);
        const restored = Network.deserialize(JSON.parse(json));

        // Same node count and edge count
        expect(restored.getNodeCount()).toBe(net.getNodeCount());
        expect(restored.getAllEdges().length).toBe(net.getAllEdges().length);

        // All node properties preserved
        for (const originalNode of net.getAllNodes()) {
          const restoredNode = restored.getNode(originalNode.id);
          expect(restoredNode).toBeDefined();
          expect(restoredNode!.id).toBe(originalNode.id);
          expect(restoredNode!.label).toBe(originalNode.label);
          expect(restoredNode!.resolution).toBe(originalNode.resolution);
          expect(restoredNode!.confidence).toBe(originalNode.confidence);
          expect(restoredNode!.source).toBe(originalNode.source);
          expect(restoredNode!.updateability).toBe(originalNode.updateability);
          expect(restoredNode!.activationThreshold).toBe(originalNode.activationThreshold);
          expect(restoredNode!.isCompressed).toBe(originalNode.isCompressed);
          expect(restoredNode!.category).toBe(originalNode.category);
          expect(restoredNode!.descendantCentrality).toBe(originalNode.descendantCentrality);
          expect(restoredNode!.pathCentrality).toBe(originalNode.pathCentrality);
        }

        // All edges preserved
        const originalEdges = net.getAllEdges();
        const restoredEdges = restored.getAllEdges();
        for (let i = 0; i < originalEdges.length; i++) {
          expect(restoredEdges[i]!.sourceId).toBe(originalEdges[i]!.sourceId);
          expect(restoredEdges[i]!.targetId).toBe(originalEdges[i]!.targetId);
          expect(restoredEdges[i]!.weight).toBe(originalEdges[i]!.weight);
        }

        // IRC preserved
        expect(restored.getIRC()).toBe(net.getIRC());
      }),
      { numRuns: 50 }
    );
  });

  it('serialized DAG is still a DAG after deserialization', () => {
    fc.assert(
      fc.property(arbDAGNetwork(), (net) => {
        const restored = Network.deserialize(JSON.parse(JSON.stringify(net.serialize())));
        expect(restored.validateDAG()).toBe(true);
      }),
      { numRuns: 50 }
    );
  });
});
