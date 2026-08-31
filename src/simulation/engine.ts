import type {
  RepresentationalNetwork,
  SimulationStep,
  CascadeEvent,
  NetworkMetrics,
} from '../types';
import { Network } from './network';
import { applyCentralityMetrics } from './centrality';
import { clampResolution } from './node';

/**
 * SimulationEngine: step-based representational network simulation with emergent CT.
 *
 * CT (Compression Threshold) is NOT a parameter. It is computed by discovering
 * the load level where the network's total simultaneity demand first exceeds IRC.
 * This makes CT a prediction of the model, not an assumption fed into it.
 *
 * The engine is fully deterministic: identical network, load sequence, and
 * parameters produce identical results every run.
 */
export class SimulationEngine {
  private network: Network | null = null;
  private originalNetworkData: RepresentationalNetwork | null = null;
  private stepCount: number = 0;
  private emergentCT: number | null = null;
  private maxCascadeDepth: number = 0;

  /**
   * Load a network for simulation. Computes centrality metrics on load.
   * Stores a copy of the original data for reset().
   */
  loadNetwork(data: RepresentationalNetwork): void {
    this.originalNetworkData = {
      nodes: data.nodes.map((n) => ({ ...n })),
      edges: data.edges.map((e) => ({ ...e })),
      irc: data.irc,
      currentLoad: data.currentLoad,
    };

    this.network = Network.deserialize(data);
    applyCentralityMetrics(this.network);
    this.stepCount = 0;
    this.emergentCT = null;
    this.maxCascadeDepth = 0;
  }

  /**
   * Apply load increment and execute one simulation step.
   * Increases global load by `amount`, then runs the step logic.
   */
  applyLoad(amount: number): SimulationStep {
    if (!this.network) {
      throw new Error('No network loaded. Call loadNetwork() first.');
    }
    const newLoad = this.network.getCurrentLoad() + amount;
    this.network.setCurrentLoad(newLoad);
    return this.step();
  }

  /**
   * Execute one simulation step at the current load level.
   *
   * Algorithm:
   * 1. Compute simultaneity demand per node: max(0, currentLoad - activationThreshold)
   * 2. Sum total simultaneity demand across all nodes
   * 3. If total demand > IRC and emergent CT not yet recorded, record current load as CT
   * 4. If total demand > IRC, apply resolution reduction to nodes ordered by structural consequence
   * 5. Propagate cascades from newly compressed nodes (resolution < 0.3)
   * 6. Compute and return step metrics
   */
  step(): SimulationStep {
    if (!this.network) {
      throw new Error('No network loaded. Call loadNetwork() first.');
    }

    this.stepCount++;
    const currentLoad = this.network.getCurrentLoad();
    const irc = this.network.getIRC();
    const nodes = this.network.getAllNodes();

    // 1. Compute simultaneity demand per node
    const totalDemand = nodes.reduce((sum, node) => {
      const demand = Math.max(0, currentLoad - node.activationThreshold);
      return sum + demand;
    }, 0);

    const nodesCompressed: string[] = [];
    const cascadeEvents: CascadeEvent[] = [];

    // 2. Check if demand exceeds IRC (CT emerges)
    if (totalDemand > irc) {
      // 3. Record emergent CT if this is the first time demand exceeds IRC
      if (this.emergentCT === null) {
        this.emergentCT = currentLoad;
      }

      // 4. Resolution reduction - structural consequence ordering
      // Excess demand determines how much resolution to reduce
      const excessDemand = totalDemand - irc;

      // Get nodes that are under pressure (contributing to simultaneity demand)
      const nodesUnderPressure = nodes
        .filter((n) => currentLoad > n.activationThreshold && n.resolution > 0)
        .sort((a, b) => {
          // Primary: lower descendant centrality compresses first
          if (a.descendantCentrality !== b.descendantCentrality) {
            return a.descendantCentrality - b.descendantCentrality;
          }
          // Secondary: lower activation threshold compresses first
          if (a.activationThreshold !== b.activationThreshold) {
            return a.activationThreshold - b.activationThreshold;
          }
          // Tertiary: alphabetical ID for determinism
          return a.id.localeCompare(b.id);
        });

      // Resolution loss per node:
      // Each node loses resolution proportional to how much its personal
      // demand exceeds what the network can support. Nodes with higher
      // centrality get a "defense bonus" - they resist compression longer.
      //
      // Formula: newResolution = 1.0 - (demand / (1 + defenseFactor * centrality))
      // where demand = max(0, currentLoad - activationThreshold)
      // and defenseFactor scales how much centrality protects a node.
      const defenseFactor = 0.3;

      for (const node of nodesUnderPressure) {
        const nodeDemand = Math.max(0, currentLoad - node.activationThreshold);
        const defense = 1 + defenseFactor * node.descendantCentrality;
        const effectivePressure = nodeDemand / defense;

        // Resolution drops from 1.0 based on effective pressure
        // Use min with current resolution to ensure monotonicity in incremental mode
        const computedResolution = clampResolution(1.0 - effectivePressure * 0.4);
        const newResolution = Math.min(node.resolution, computedResolution);
        const wasCompressed = node.isCompressed;

        this.network.updateNode({
          ...node,
          resolution: newResolution,
          isCompressed: newResolution < 0.3,
        });

        if (newResolution < 0.3 && !wasCompressed) {
          nodesCompressed.push(node.id);
        }
      }

      // 5. Cascade propagation from newly compressed nodes
      const cascaded = new Set<string>();
      const cascadeQueue: Array<{ sourceId: string; depth: number }> = nodesCompressed.map(
        (id) => ({ sourceId: id, depth: 1 })
      );

      while (cascadeQueue.length > 0) {
        const { sourceId, depth } = cascadeQueue.shift()!;

        if (depth > this.maxCascadeDepth) {
          this.maxCascadeDepth = depth;
        }

        // Get dependents (nodes that depend on the compressed source)
        const dependentEdges = this.network.getDependents(sourceId);

        for (const edge of dependentEdges) {
          const dependentNode = this.network.getNode(edge.targetId);
          if (!dependentNode || cascaded.has(edge.targetId)) continue;

          // Instability proportional to edge weight
          const instabilityAmount = edge.weight * 0.2;
          const newResolution = clampResolution(
            dependentNode.resolution - instabilityAmount
          );
          const wasCompressed = dependentNode.isCompressed;

          this.network.updateNode({
            ...dependentNode,
            resolution: newResolution,
            isCompressed: newResolution < 0.3,
          });

          cascadeEvents.push({
            sourceNodeId: sourceId,
            affectedNodeId: edge.targetId,
            resolutionLost: instabilityAmount,
          });

          // If this dependent also crossed the compression threshold, cascade further
          if (newResolution < 0.3 && !wasCompressed) {
            nodesCompressed.push(edge.targetId);
            cascaded.add(edge.targetId);
            cascadeQueue.push({ sourceId: edge.targetId, depth: depth + 1 });
          }
        }
      }
    }

    // 6. Compute aggregate metrics
    const allNodes = this.network.getAllNodes();
    const totalResolution = allNodes.reduce((sum, n) => sum + n.resolution, 0);

    return {
      stepNumber: this.stepCount,
      currentLoad,
      nodesCompressed,
      cascadeEvents,
      totalResolution,
      emergentCT: this.emergentCT,
    };
  }

  /**
   * Reset the engine to the originally loaded network state.
   * All simulation progress is discarded.
   */
  reset(): void {
    if (!this.originalNetworkData) {
      throw new Error('No network loaded. Call loadNetwork() first.');
    }
    this.network = Network.deserialize(this.originalNetworkData);
    applyCentralityMetrics(this.network);
    this.stepCount = 0;
    this.emergentCT = null;
    this.maxCascadeDepth = 0;
  }

  /**
   * Get aggregate metrics for the current network state.
   */
  getMetrics(): NetworkMetrics {
    if (!this.network) {
      throw new Error('No network loaded. Call loadNetwork() first.');
    }
    const nodes = this.network.getAllNodes();
    return {
      totalResolution: nodes.reduce((sum, n) => sum + n.resolution, 0),
      compressedNodeCount: nodes.filter((n) => n.isCompressed).length,
      maxCascadeDepth: this.maxCascadeDepth,
      emergentCT: this.emergentCT,
    };
  }

  /**
   * Get the emergent CT value. Returns null if load has never exceeded IRC.
   */
  getEmergentCT(): number | null {
    return this.emergentCT;
  }

  /**
   * Simulate the network at an absolute load level from scratch.
   * Resets to original state, then applies the given load in one step.
   * Returns the final network state as a RepresentationalNetwork for visualization.
   *
   * This enables "slider" mode: each slider position produces a fresh
   * deterministic computation without incremental accumulation.
   */
  simulateAtLoad(absoluteLoad: number): { step: SimulationStep; networkState: RepresentationalNetwork } {
    if (!this.originalNetworkData) {
      throw new Error('No network loaded. Call loadNetwork() first.');
    }

    // Reset to original
    this.network = Network.deserialize(this.originalNetworkData);
    applyCentralityMetrics(this.network);
    this.stepCount = 0;
    this.emergentCT = null;
    this.maxCascadeDepth = 0;

    // Set absolute load and step
    this.network.setCurrentLoad(absoluteLoad);
    const step = this.step();

    return {
      step,
      networkState: this.network.serialize(),
    };
  }
}
