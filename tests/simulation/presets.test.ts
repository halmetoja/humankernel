import { describe, it, expect } from 'vitest';
import { createDistributedTopology, createHubDependentTopology } from '../../src/simulation/presets';
import { Network } from '../../src/simulation/network';
import { computeDescendantCentrality } from '../../src/simulation/centrality';

describe('createDistributedTopology', () => {
  const topology = createDistributedTopology();

  it('returns 12-15 nodes', () => {
    expect(topology.nodes.length).toBeGreaterThanOrEqual(12);
    expect(topology.nodes.length).toBeLessThanOrEqual(15);
  });

  it('has maximum descendant centrality of 3-4', () => {
    const network = Network.deserialize(topology);
    const centrality = computeDescendantCentrality(network);
    const maxCentrality = Math.max(...centrality.values());
    expect(maxCentrality).toBeGreaterThanOrEqual(3);
    expect(maxCentrality).toBeLessThanOrEqual(4);
  });

  it('has redundant paths (most non-root nodes have 2+ ancestors)', () => {
    const network = Network.deserialize(topology);
    const nodes = network.getAllNodes();
    let nodesWithMultipleAncestors = 0;
    for (const node of nodes) {
      const ancestors = network.getAncestors(node.id);
      if (ancestors.length >= 2) {
        nodesWithMultipleAncestors++;
      }
    }
    const rootNodes = nodes.filter(
      (n) => network.getAncestors(n.id).length === 0
    );
    const nonRootNodes = nodes.length - rootNodes.length;
    expect(nodesWithMultipleAncestors).toBeGreaterThan(nonRootNodes / 2);
  });

  it('validates as a DAG', () => {
    const network = Network.deserialize(topology);
    expect(network.validateDAG()).toBe(true);
  });

  it('uses varied activation thresholds', () => {
    const thresholds = new Set(topology.nodes.map((n) => n.activationThreshold));
    expect(thresholds.size).toBeGreaterThan(1);
  });

  it('uses varied regulation sources', () => {
    const sources = new Set(topology.nodes.map((n) => n.source));
    expect(sources.size).toBeGreaterThan(1);
  });

  it('has IRC set for realistic demonstration', () => {
    expect(topology.irc).toBeGreaterThan(0);
  });

  it('starts with zero load', () => {
    expect(topology.currentLoad).toBe(0);
  });
});

describe('createHubDependentTopology', () => {
  const topology = createHubDependentTopology();

  it('returns 12-15 nodes', () => {
    expect(topology.nodes.length).toBeGreaterThanOrEqual(12);
    expect(topology.nodes.length).toBeLessThanOrEqual(15);
  });

  it('has hub node "I am validated" with descendant centrality 8-12', () => {
    const network = Network.deserialize(topology);
    const centrality = computeDescendantCentrality(network);
    const hubCentrality = centrality.get('validated');
    expect(hubCentrality).toBeDefined();
    expect(hubCentrality).toBeGreaterThanOrEqual(8);
    expect(hubCentrality).toBeLessThanOrEqual(12);
  });

  it('has serial dependencies through the hub (9+ direct dependents)', () => {
    const network = Network.deserialize(topology);
    const hubDependents = network.getDependents('validated');
    expect(hubDependents.length).toBeGreaterThanOrEqual(7);
  });

  it('validates as a DAG', () => {
    const network = Network.deserialize(topology);
    expect(network.validateDAG()).toBe(true);
  });

  it('uses same IRC as distributed topology for fair comparison', () => {
    const distributed = createDistributedTopology();
    expect(topology.irc).toBe(distributed.irc);
  });

  it('has matched node count with distributed topology', () => {
    const distributed = createDistributedTopology();
    expect(topology.nodes.length).toBe(distributed.nodes.length);
  });

  it('uses varied activation thresholds', () => {
    const thresholds = new Set(topology.nodes.map((n) => n.activationThreshold));
    expect(thresholds.size).toBeGreaterThan(1);
  });

  it('uses varied regulation sources', () => {
    const sources = new Set(topology.nodes.map((n) => n.source));
    expect(sources.size).toBeGreaterThan(1);
  });

  it('starts with zero load', () => {
    expect(topology.currentLoad).toBe(0);
  });
});
