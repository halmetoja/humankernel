import { Network } from './network';

/**
 * Compute descendant centrality for all nodes in the network.
 *
 * Descendant centrality = number of unique nodes reachable from a given node
 * by following dependency edges forward (source -> target).
 *
 * Answers: "How many other representations become unstable if this one is lost?"
 *
 * A leaf node (no dependents) has descendant centrality 0.
 */
export function computeDescendantCentrality(network: Network): Map<string, number> {
  const result = new Map<string, number>();

  for (const node of network.getAllNodes()) {
    const reachable = new Set<string>();
    const stack = [node.id];

    while (stack.length > 0) {
      const current = stack.pop()!;
      for (const edge of network.getDependents(current)) {
        if (!reachable.has(edge.targetId)) {
          reachable.add(edge.targetId);
          stack.push(edge.targetId);
        }
      }
    }

    result.set(node.id, reachable.size);
  }

  return result;
}

/**
 * Compute path centrality for all nodes in the network.
 *
 * Path centrality = total number of distinct source-to-sink dependency paths
 * that pass through a given node.
 *
 * Answers: "How many dependency chains does this node participate in?"
 *
 * A node can have high descendant centrality but low path centrality
 * (wide but shallow) or vice versa (narrow but deep, on many long chains).
 *
 * Uses dynamic programming on the DAG's topological order.
 */
export function computePathCentrality(network: Network): Map<string, number> {
  const nodes = network.getAllNodes();
  const nodeIds = nodes.map(n => n.id);

  // Topological sort (Kahn's algorithm)
  const inDegree = new Map<string, number>();
  for (const id of nodeIds) {
    inDegree.set(id, 0);
  }
  for (const edge of network.getAllEdges()) {
    inDegree.set(edge.targetId, (inDegree.get(edge.targetId) ?? 0) + 1);
  }

  const topoOrder: string[] = [];
  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }
  while (queue.length > 0) {
    const current = queue.shift()!;
    topoOrder.push(current);
    for (const edge of network.getDependents(current)) {
      const newDeg = (inDegree.get(edge.targetId) ?? 0) - 1;
      inDegree.set(edge.targetId, newDeg);
      if (newDeg === 0) queue.push(edge.targetId);
    }
  }

  // pathsFrom[id] = number of distinct paths starting from this node (including itself as length-0 path)
  // pathsTo[id] = number of distinct paths ending at this node (including itself)
  const pathsFrom = new Map<string, number>();
  const pathsTo = new Map<string, number>();

  // Compute pathsFrom: iterate in reverse topological order
  for (let i = topoOrder.length - 1; i >= 0; i--) {
    const id = topoOrder[i]!;
    let count = 1; // the node itself starts a path
    for (const edge of network.getDependents(id)) {
      count += pathsFrom.get(edge.targetId) ?? 1;
    }
    pathsFrom.set(id, count);
  }

  // Compute pathsTo: iterate in topological order
  for (const id of topoOrder) {
    let count = 1; // the node itself ends a path
    for (const edge of network.getAncestors(id)) {
      count += pathsTo.get(edge.sourceId) ?? 1;
    }
    pathsTo.set(id, count);
  }

  // Path centrality for node v = pathsTo[v] * pathsFrom[v] - 1
  // (subtract 1 to exclude the trivial path of just the node itself)
  const result = new Map<string, number>();
  for (const id of nodeIds) {
    const to = pathsTo.get(id) ?? 1;
    const from = pathsFrom.get(id) ?? 1;
    result.set(id, to * from - 1);
  }

  return result;
}

/**
 * Apply both centrality computations to the network, updating all nodes in place.
 */
export function applyCentralityMetrics(network: Network): void {
  const descendant = computeDescendantCentrality(network);
  const path = computePathCentrality(network);

  for (const node of network.getAllNodes()) {
    network.updateNode({
      ...node,
      descendantCentrality: descendant.get(node.id) ?? 0,
      pathCentrality: path.get(node.id) ?? 0,
    });
  }
}
