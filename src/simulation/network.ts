import type {
  RepresentationalNetwork,
  RepresentationNode,
  DependencyEdge,
} from '../types';

/**
 * RepresentationalNetwork class.
 * Manages a directed acyclic graph of representations and dependencies.
 *
 * v0.1 assumes DAG. Cycles are not errors or invalid psychological networks -
 * they are a v0.2+ extension for modeling self-reinforcing patterns.
 */
export class Network {
  private nodes: Map<string, RepresentationNode> = new Map();
  private edges: DependencyEdge[] = [];
  /** Map from sourceId to list of edges (outgoing: nodes that depend on source) */
  private dependentsMap: Map<string, DependencyEdge[]> = new Map();
  /** Map from targetId to list of edges (incoming: nodes that this node depends on) */
  private ancestorsMap: Map<string, DependencyEdge[]> = new Map();

  private irc: number;
  private currentLoad: number;

  constructor(irc: number = 1.0, currentLoad: number = 0) {
    this.irc = irc;
    this.currentLoad = currentLoad;
  }

  getIRC(): number {
    return this.irc;
  }

  setIRC(value: number): void {
    this.irc = value;
  }

  getCurrentLoad(): number {
    return this.currentLoad;
  }

  setCurrentLoad(value: number): void {
    this.currentLoad = Math.max(0, value);
  }

  addNode(node: RepresentationNode): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`Node with id "${node.id}" already exists`);
    }
    this.nodes.set(node.id, node);
    this.dependentsMap.set(node.id, []);
    this.ancestorsMap.set(node.id, []);
  }

  addEdge(edge: DependencyEdge): void {
    if (!this.nodes.has(edge.sourceId)) {
      throw new Error(`Source node "${edge.sourceId}" does not exist`);
    }
    if (!this.nodes.has(edge.targetId)) {
      throw new Error(`Target node "${edge.targetId}" does not exist`);
    }
    if (edge.sourceId === edge.targetId) {
      throw new Error(`Self-loop not allowed: "${edge.sourceId}"`);
    }
    if (edge.weight < 0 || edge.weight > 1) {
      throw new RangeError(`Edge weight must be in [0, 1], got ${edge.weight}`);
    }

    this.edges.push(edge);
    this.dependentsMap.get(edge.sourceId)!.push(edge);
    this.ancestorsMap.get(edge.targetId)!.push(edge);
  }

  getNode(id: string): RepresentationNode | undefined {
    return this.nodes.get(id);
  }

  updateNode(node: RepresentationNode): void {
    if (!this.nodes.has(node.id)) {
      throw new Error(`Node "${node.id}" does not exist`);
    }
    this.nodes.set(node.id, node);
  }

  getAllNodes(): RepresentationNode[] {
    return Array.from(this.nodes.values());
  }

  getAllEdges(): DependencyEdge[] {
    return [...this.edges];
  }

  getNodeCount(): number {
    return this.nodes.size;
  }

  /**
   * Get direct dependents of a node (nodes that depend on this node).
   * These are edges where sourceId === id.
   */
  getDependents(id: string): DependencyEdge[] {
    return this.dependentsMap.get(id) ?? [];
  }

  /**
   * Get direct ancestors of a node (nodes that this node depends on).
   * These are edges where targetId === id.
   */
  getAncestors(id: string): DependencyEdge[] {
    return this.ancestorsMap.get(id) ?? [];
  }

  /**
   * Validate that the network is a DAG (no cycles).
   * Returns true if valid DAG, false if cycles exist.
   * Uses Kahn's algorithm (topological sort).
   */
  validateDAG(): boolean {
    const inDegree = new Map<string, number>();
    for (const [id] of this.nodes) {
      inDegree.set(id, 0);
    }
    for (const edge of this.edges) {
      inDegree.set(edge.targetId, (inDegree.get(edge.targetId) ?? 0) + 1);
    }

    const queue: string[] = [];
    for (const [id, degree] of inDegree) {
      if (degree === 0) queue.push(id);
    }

    let processed = 0;
    while (queue.length > 0) {
      const current = queue.shift()!;
      processed++;
      for (const edge of this.getDependents(current)) {
        const newDegree = (inDegree.get(edge.targetId) ?? 0) - 1;
        inDegree.set(edge.targetId, newDegree);
        if (newDegree === 0) queue.push(edge.targetId);
      }
    }

    return processed === this.nodes.size;
  }

  /**
   * Serialize the network to a plain object matching RepresentationalNetwork interface.
   */
  serialize(): RepresentationalNetwork {
    return {
      nodes: this.getAllNodes(),
      edges: this.getAllEdges(),
      irc: this.irc,
      currentLoad: this.currentLoad,
    };
  }

  /**
   * Deserialize from a plain RepresentationalNetwork object.
   */
  static deserialize(data: RepresentationalNetwork): Network {
    const network = new Network(data.irc, data.currentLoad);
    for (const node of data.nodes) {
      network.addNode({ ...node });
    }
    for (const edge of data.edges) {
      network.addEdge({ ...edge });
    }
    return network;
  }
}
