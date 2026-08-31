// Human Kernel Theory Toolkit - Core Type Definitions
// Based on SRF v0.3.3 Master Context

/** Semantic category of a representation */
export type NodeCategory =
  | 'ontological'
  | 'identity'
  | 'relational'
  | 'functional'
  | 'peripheral';

/** Where regulation originates for this representation */
export type RegulationSource = 'internal' | 'external' | 'mixed';

/** Topology preset type */
export type TopologyType = 'distributed' | 'hub-dependent';

/**
 * A node in the representational network.
 *
 * v0.1 implements: resolution, confidence, source, updateability, centrality metrics.
 * v0.2 will add: salience, authority/weight, selfRelevanceWeight.
 *
 * SRF identifies seven distinct representational properties that must not be collapsed:
 * resolution, weight/authority, salience, evidence, confidence, truth, updateability.
 * High salience does not imply truth. A low-resolution representation can have high authority.
 */
export interface RepresentationNode {
  /** Unique identifier */
  id: string;
  /** Human-readable label (SRF terminology) */
  label: string;
  /** Current resolution level: 0 = fully compressed, 1 = full resolution */
  resolution: number;
  /** Certainty of this representation (0-1) */
  confidence: number;
  /** Where regulation originates */
  source: RegulationSource;
  /** How easily new information revises this representation (0-1) */
  updateability: number;
  /** Number of unique dependent nodes reachable (computed) */
  descendantCentrality: number;
  /** Total number of dependency paths through this node (computed) */
  pathCentrality: number;
  /** Load level at which this node begins losing resolution */
  activationThreshold: number;
  /** Whether this node is currently in a compressed state */
  isCompressed: boolean;
  /** Semantic category */
  category: NodeCategory;
}

/** A directed dependency edge: target depends on source */
export interface DependencyEdge {
  /** Node that provides structural support */
  sourceId: string;
  /** Node that depends on the source */
  targetId: string;
  /** Dependency strength: 0-1 */
  weight: number;
}

/**
 * The complete representational network.
 * v0.1 assumes a DAG. Cycles are not errors - they are a v0.2+ extension
 * for modeling self-reinforcing patterns (feedback loops).
 */
export interface RepresentationalNetwork {
  nodes: RepresentationNode[];
  edges: DependencyEdge[];
  /** Network-level IRC (holding threshold): how many contradictory
      representations can coexist simultaneously */
  irc: number;
  /** Current global affective load */
  currentLoad: number;
}

/** A single simulation step result */
export interface SimulationStep {
  stepNumber: number;
  currentLoad: number;
  /** Node IDs that were compressed in this step */
  nodesCompressed: string[];
  /** Cascade events triggered in this step */
  cascadeEvents: CascadeEvent[];
  /** Sum of all node resolutions */
  totalResolution: number;
  /** Emergent CT - null if not yet determined */
  emergentCT: number | null;
}

/** A cascade propagation event */
export interface CascadeEvent {
  /** Node whose resolution drop triggered the cascade */
  sourceNodeId: string;
  /** Node affected by the cascade */
  affectedNodeId: string;
  /** Amount of resolution lost by the affected node */
  resolutionLost: number;
}

/** Aggregate network metrics */
export interface NetworkMetrics {
  /** Sum of all node resolutions */
  totalResolution: number;
  /** Number of nodes with isCompressed = true */
  compressedNodeCount: number;
  /** Longest cascade chain in the simulation history */
  maxCascadeDepth: number;
  /** Emergent CT - null if load never exceeded IRC */
  emergentCT: number | null;
}

/** Comparison result between two topologies */
export interface ComparisonResult {
  topology1: TopologyResult;
  topology2: TopologyResult;
}

export interface TopologyResult {
  type: TopologyType;
  /** Total resolution remaining after load application */
  totalResolutionRetained: number;
  /** Maximum cascade chain length observed */
  maxCascadeDepth: number;
  /** IDs of compressed nodes */
  compressedNodes: string[];
}

/** Options for creating a node with sensible defaults */
export interface CreateNodeOptions {
  id: string;
  label: string;
  category: NodeCategory;
  activationThreshold?: number;
  confidence?: number;
  source?: RegulationSource;
  updateability?: number;
}
