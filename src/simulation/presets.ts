import type { RepresentationalNetwork } from '../types';
import { createNode } from './node';

/**
 * Create a distributed (resilient) topology.
 *
 * Structure: 14 nodes with multiple independent anchors.
 * No single node dominates. Maximum descendant centrality is 3-4.
 * Most nodes have 2+ parents providing redundant structural support.
 *
 * Psychological content: core SRF representations covering ontological,
 * identity, relational, functional, and peripheral categories.
 *
 * This topology demonstrates structural resilience: loss of any single
 * representation does not threaten the coherence of the whole network.
 */
export function createDistributedTopology(): RepresentationalNetwork {
  const nodes = [
    createNode({
      id: 'separate',
      label: 'I exist as separate',
      category: 'ontological',
      activationThreshold: 0.3,
      confidence: 0.9,
      source: 'internal',
      updateability: 0.2,
    }),
    createNode({
      id: 'worth',
      label: 'I have inherent worth',
      category: 'identity',
      activationThreshold: 0.4,
      confidence: 0.8,
      source: 'internal',
      updateability: 0.3,
    }),
    createNode({
      id: 'loved',
      label: 'I can be loved',
      category: 'relational',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'mixed',
      updateability: 0.5,
    }),
    createNode({
      id: 'criticized',
      label: 'I can be criticized',
      category: 'relational',
      activationThreshold: 0.4,
      confidence: 0.8,
      source: 'mixed',
      updateability: 0.4,
    }),
    createNode({
      id: 'fail',
      label: 'I can fail',
      category: 'functional',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'internal',
      updateability: 0.5,
    }),
    createNode({
      id: 'others-minds',
      label: 'Others have independent minds',
      category: 'relational',
      activationThreshold: 0.4,
      confidence: 0.8,
      source: 'external',
      updateability: 0.3,
    }),
    createNode({
      id: 'needs',
      label: 'My needs are acceptable',
      category: 'identity',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'mixed',
      updateability: 0.4,
    }),
    createNode({
      id: 'uncertainty',
      label: 'I can tolerate uncertainty',
      category: 'functional',
      activationThreshold: 0.6,
      confidence: 0.6,
      source: 'internal',
      updateability: 0.5,
    }),
    createNode({
      id: 'continuity',
      label: 'My continuity of being persists',
      category: 'ontological',
      activationThreshold: 0.3,
      confidence: 0.9,
      source: 'internal',
      updateability: 0.2,
    }),
    createNode({
      id: 'repair',
      label: 'Relationships can be repaired',
      category: 'relational',
      activationThreshold: 0.6,
      confidence: 0.6,
      source: 'mixed',
      updateability: 0.6,
    }),
    createNode({
      id: 'agency',
      label: 'I can affect outcomes',
      category: 'functional',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'internal',
      updateability: 0.4,
    }),
    createNode({
      id: 'imperfect',
      label: 'I can be imperfect and still valued',
      category: 'identity',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'mixed',
      updateability: 0.5,
    }),
    createNode({
      id: 'boundaries',
      label: 'I can set boundaries',
      category: 'functional',
      activationThreshold: 0.6,
      confidence: 0.6,
      source: 'internal',
      updateability: 0.5,
    }),
    createNode({
      id: 'validated',
      label: 'I am validated',
      category: 'identity',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'mixed',
      updateability: 0.4,
    }),
  ];

  // Edge structure: distributed, redundant paths.
  // Edges go from source (structural support) to target (depends on source).
  //
  // Design: a wide, shallow graph where:
  //   - 6 anchor nodes each directly support 2-4 leaf/dependent nodes
  //   - Dependent nodes receive support from 2+ different anchors (redundancy)
  //   - No chains deeper than 1 hop (anchor → dependent), so max descendant
  //     centrality equals the number of direct dependents per anchor: 3-4.
  //
  // Anchors: separate, continuity, worth, others-minds, agency, uncertainty
  // Dependents: loved, criticized, fail, needs, repair, imperfect, boundaries, validated
  const edges = [
    // "separate" supports: needs, boundaries, loved (3 descendants)
    { sourceId: 'separate', targetId: 'needs', weight: 0.7 },
    { sourceId: 'separate', targetId: 'boundaries', weight: 0.6 },
    { sourceId: 'separate', targetId: 'loved', weight: 0.5 },

    // "continuity" supports: loved, fail, repair (3 descendants)
    { sourceId: 'continuity', targetId: 'loved', weight: 0.6 },
    { sourceId: 'continuity', targetId: 'fail', weight: 0.5 },
    { sourceId: 'continuity', targetId: 'repair', weight: 0.5 },

    // "worth" supports: imperfect, needs, loved (3 descendants)
    { sourceId: 'worth', targetId: 'imperfect', weight: 0.7 },
    { sourceId: 'worth', targetId: 'needs', weight: 0.6 },
    { sourceId: 'worth', targetId: 'loved', weight: 0.5 },

    // "others-minds" supports: criticized, repair, imperfect (3 descendants)
    { sourceId: 'others-minds', targetId: 'criticized', weight: 0.7 },
    { sourceId: 'others-minds', targetId: 'repair', weight: 0.6 },
    { sourceId: 'others-minds', targetId: 'imperfect', weight: 0.4 },

    // "agency" supports: fail, boundaries, criticized (3 descendants)
    { sourceId: 'agency', targetId: 'fail', weight: 0.7 },
    { sourceId: 'agency', targetId: 'boundaries', weight: 0.6 },
    { sourceId: 'agency', targetId: 'criticized', weight: 0.4 },

    // "uncertainty" supports: criticized, repair, fail (3 descendants)
    { sourceId: 'uncertainty', targetId: 'criticized', weight: 0.6 },
    { sourceId: 'uncertainty', targetId: 'repair', weight: 0.5 },
    { sourceId: 'uncertainty', targetId: 'fail', weight: 0.4 },

    // "validated" is just another leaf node here, supported by two anchors
    { sourceId: 'worth', targetId: 'validated', weight: 0.5 },
    { sourceId: 'others-minds', targetId: 'validated', weight: 0.5 },
  ];

  return {
    nodes,
    edges,
    irc: 3.5,
    currentLoad: 0,
  };
}

/**
 * Create a hub-dependent (fragile) topology.
 *
 * Structure: 14 nodes with one dominant hub ("I am validated").
 * The hub has descendant centrality 8-12 (most other nodes depend on it
 * directly or through short serial chains).
 * Serial dependencies: most paths go through the hub.
 *
 * Same psychological content as the distributed topology plus the hub node,
 * but wired differently. Most representations depend on external validation
 * rather than having multiple independent structural supports.
 *
 * This topology demonstrates structural fragility: loss of the hub node
 * cascades widely through the network, collapsing many dependent
 * representations simultaneously.
 */
export function createHubDependentTopology(): RepresentationalNetwork {
  const nodes = [
    createNode({
      id: 'separate',
      label: 'I exist as separate',
      category: 'ontological',
      activationThreshold: 0.3,
      confidence: 0.9,
      source: 'internal',
      updateability: 0.2,
    }),
    createNode({
      id: 'continuity',
      label: 'My continuity of being persists',
      category: 'ontological',
      activationThreshold: 0.3,
      confidence: 0.9,
      source: 'internal',
      updateability: 0.2,
    }),
    // The dominant hub node
    createNode({
      id: 'validated',
      label: 'I am validated',
      category: 'identity',
      activationThreshold: 0.4,
      confidence: 0.7,
      source: 'external',
      updateability: 0.3,
    }),
    createNode({
      id: 'worth',
      label: 'I have inherent worth',
      category: 'identity',
      activationThreshold: 0.4,
      confidence: 0.8,
      source: 'external',
      updateability: 0.3,
    }),
    createNode({
      id: 'loved',
      label: 'I can be loved',
      category: 'relational',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'external',
      updateability: 0.5,
    }),
    createNode({
      id: 'criticized',
      label: 'I can be criticized',
      category: 'relational',
      activationThreshold: 0.4,
      confidence: 0.8,
      source: 'external',
      updateability: 0.4,
    }),
    createNode({
      id: 'fail',
      label: 'I can fail',
      category: 'functional',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'external',
      updateability: 0.5,
    }),
    createNode({
      id: 'others-minds',
      label: 'Others have independent minds',
      category: 'relational',
      activationThreshold: 0.4,
      confidence: 0.8,
      source: 'external',
      updateability: 0.3,
    }),
    createNode({
      id: 'needs',
      label: 'My needs are acceptable',
      category: 'identity',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'external',
      updateability: 0.4,
    }),
    createNode({
      id: 'uncertainty',
      label: 'I can tolerate uncertainty',
      category: 'functional',
      activationThreshold: 0.6,
      confidence: 0.6,
      source: 'external',
      updateability: 0.5,
    }),
    createNode({
      id: 'repair',
      label: 'Relationships can be repaired',
      category: 'relational',
      activationThreshold: 0.6,
      confidence: 0.6,
      source: 'external',
      updateability: 0.6,
    }),
    createNode({
      id: 'agency',
      label: 'I can affect outcomes',
      category: 'functional',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'external',
      updateability: 0.4,
    }),
    createNode({
      id: 'imperfect',
      label: 'I can be imperfect and still valued',
      category: 'identity',
      activationThreshold: 0.5,
      confidence: 0.7,
      source: 'external',
      updateability: 0.5,
    }),
    createNode({
      id: 'boundaries',
      label: 'I can set boundaries',
      category: 'functional',
      activationThreshold: 0.6,
      confidence: 0.6,
      source: 'external',
      updateability: 0.5,
    }),
  ];

  // Edge structure: hub-dependent, serial dependencies through "I am validated".
  //
  // Architecture:
  //   - "separate" and "continuity" are ontological anchors that support the hub
  //   - The hub "validated" directly supports 9 nodes
  //   - Two of those dependents each support one further leaf node,
  //     bringing the hub's total descendant centrality to 11
  //   - This creates a funnel topology: everything flows through validation
  const edges = [
    // Ontological anchors support the hub
    { sourceId: 'separate', targetId: 'validated', weight: 0.8 },
    { sourceId: 'continuity', targetId: 'validated', weight: 0.7 },

    // Hub directly supports 9 nodes
    { sourceId: 'validated', targetId: 'worth', weight: 0.9 },
    { sourceId: 'validated', targetId: 'loved', weight: 0.8 },
    { sourceId: 'validated', targetId: 'criticized', weight: 0.7 },
    { sourceId: 'validated', targetId: 'fail', weight: 0.7 },
    { sourceId: 'validated', targetId: 'others-minds', weight: 0.6 },
    { sourceId: 'validated', targetId: 'needs', weight: 0.8 },
    { sourceId: 'validated', targetId: 'agency', weight: 0.7 },
    { sourceId: 'validated', targetId: 'imperfect', weight: 0.8 },
    { sourceId: 'validated', targetId: 'uncertainty', weight: 0.6 },

    // Serial chains from hub dependents to leaf nodes
    { sourceId: 'loved', targetId: 'repair', weight: 0.7 },
    { sourceId: 'agency', targetId: 'boundaries', weight: 0.6 },
  ];

  return {
    nodes,
    edges,
    irc: 3.5,
    currentLoad: 0,
  };
}
