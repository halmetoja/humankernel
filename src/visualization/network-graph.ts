/**
 * NetworkGraphViz: D3 force-directed graph renderer for representational networks.
 *
 * Features:
 * - Nodes sized by descendant centrality (8-24px radius)
 * - Nodes colored by resolution using green-yellow-red gradient
 * - Edges rendered with opacity proportional to weight
 * - Smooth 300ms color transitions on resolution changes
 * - Cascade pulse animation along edges
 * - Click-to-select info panel showing all node properties
 * - Keyboard navigation (Tab to move between nodes, Enter to select)
 *
 * WCAG AA: Color is never the sole means of conveying information.
 * Resolution state is also communicated via aria-label, text labels, and node size.
 */

import * as d3 from 'd3';
import type {
  RepresentationalNetwork,
  RepresentationNode,
  DependencyEdge,
  CascadeEvent,
} from '../types';
import { resolutionToColor, resolutionStateLabel } from './colors';

/** Callback type for node selection events */
export type NodeSelectCallback = (node: RepresentationNode | null) => void;

/** Configuration constants */
const MIN_NODE_RADIUS = 8;
const MAX_NODE_RADIUS = 24;
const TRANSITION_DURATION = 300;
const CASCADE_PULSE_DURATION = 600;
const LINK_MIN_OPACITY = 0.2;
const LINK_MAX_OPACITY = 0.8;

/** Internal node type for D3 simulation */
interface SimNode extends d3.SimulationNodeDatum {
  data: RepresentationNode;
}

/** Internal link type for D3 simulation */
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  data: DependencyEdge;
}

/**
 * Map descendant centrality to node radius.
 * Uses linear interpolation between min and max radius.
 */
function centralityToRadius(centrality: number, maxCentrality: number): number {
  if (maxCentrality <= 0) return MIN_NODE_RADIUS;
  const t = Math.min(centrality / maxCentrality, 1);
  return MIN_NODE_RADIUS + t * (MAX_NODE_RADIUS - MIN_NODE_RADIUS);
}

/**
 * NetworkGraphViz class.
 * Renders an interactive D3 force-directed graph of a representational network.
 */
export class NetworkGraphViz {
  private container: HTMLElement | null = null;
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private simulation: d3.Simulation<SimNode, SimLink> | null = null;
  private nodeGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
  private linkGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
  private infoPanel: HTMLElement | null = null;

  private simNodes: SimNode[] = [];
  private simLinks: SimLink[] = [];
  private nodeSelectCallbacks: NodeSelectCallback[] = [];
  private selectedNodeId: string | null = null;
  private focusedIndex: number = -1;

  /**
   * Render the network into a container element.
   * Creates the SVG, sets up force simulation, and draws nodes/edges.
   */
  render(container: HTMLElement, network: RepresentationalNetwork): void {
    this.container = container;
    container.innerHTML = '';

    // Create wrapper with appropriate ARIA attributes
    const wrapper = document.createElement('div');
    wrapper.setAttribute('role', 'figure');
    wrapper.setAttribute('aria-label', 'Representational network graph visualization');
    wrapper.classList.add('network-graph-wrapper');
    container.appendChild(wrapper);

    // Create SVG
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    this.svg = d3
      .select(wrapper)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', `Network graph with ${network.nodes.length} nodes and ${network.edges.length} edges`);

    // Define arrow marker for edges
    this.svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'var(--text-secondary, #a0a0b0)');

    // Create groups for links and nodes (links behind nodes)
    this.linkGroup = this.svg.append('g').attr('class', 'links');
    this.nodeGroup = this.svg.append('g').attr('class', 'nodes');

    // Create info panel
    this.infoPanel = document.createElement('div');
    this.infoPanel.classList.add('node-info-panel');
    this.infoPanel.setAttribute('role', 'region');
    this.infoPanel.setAttribute('aria-label', 'Selected node properties');
    this.infoPanel.setAttribute('aria-live', 'polite');
    wrapper.appendChild(this.infoPanel);

    // Build simulation data
    this.buildSimulationData(network);

    // Create force simulation
    this.simulation = d3
      .forceSimulation<SimNode>(this.simNodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(this.simLinks)
          .id((d) => d.data.id)
          .distance(80)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<SimNode>().radius((d) => this.getNodeRadius(d) + 4));

    // Draw edges
    this.drawLinks();

    // Draw nodes
    this.drawNodes();

    // Simulation tick handler
    this.simulation.on('tick', () => this.tick());

    // Keyboard navigation on the SVG
    this.svg.node()?.setAttribute('tabindex', '0');
    this.svg.node()?.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  /**
   * Update the visualization with new network state.
   * Smoothly transitions node colors and sizes.
   */
  update(network: RepresentationalNetwork): void {
    if (!this.svg || !this.nodeGroup || !this.linkGroup) return;

    // Update node data
    const maxCentrality = Math.max(...network.nodes.map((n) => n.descendantCentrality), 1);

    for (const simNode of this.simNodes) {
      const updatedNode = network.nodes.find((n) => n.id === simNode.data.id);
      if (updatedNode) {
        simNode.data = updatedNode;
      }
    }

    // Transition node colors, sizes, and compression effects
    this.nodeGroup
      .selectAll<SVGCircleElement, SimNode>('circle.node-circle')
      .data(this.simNodes, (d) => d.data.id)
      .transition()
      .duration(TRANSITION_DURATION)
      .attr('fill', (d) => resolutionToColor(d.data.resolution))
      .attr('r', (d) => {
        // Compressed nodes shrink dramatically
        if (d.data.isCompressed) {
          return Math.max(4, centralityToRadius(d.data.descendantCentrality, maxCentrality) * 0.4);
        }
        return centralityToRadius(d.data.descendantCentrality, maxCentrality);
      })
      .attr('stroke', (d) => d.data.isCompressed ? '#f44336' : 'var(--border, #2a2a4a)')
      .attr('stroke-width', (d) => d.data.isCompressed ? 3 : 2)
      .attr('opacity', (d) => d.data.isCompressed ? 0.6 : 1.0);

    // Update node labels to show COMPRESSED state
    this.nodeGroup
      .selectAll<SVGTextElement, SimNode>('text.node-label')
      .data(this.simNodes, (d) => d.data.id)
      .text((d) => d.data.isCompressed ? '\u2716 ' + d.data.label : d.data.label)
      .attr('fill', (d) => d.data.isCompressed ? '#f44336' : 'var(--text-secondary, #a0a0b0)');

    // Update ARIA labels
    this.nodeGroup
      .selectAll<SVGGElement, SimNode>('g.node')
      .data(this.simNodes, (d) => d.data.id)
      .attr('aria-label', (d) =>
        `${d.data.label}: ${resolutionStateLabel(d.data.resolution)}, resolution ${(d.data.resolution * 100).toFixed(0)}%`
      );

    // Update info panel if a node is selected
    if (this.selectedNodeId) {
      const selectedNode = this.simNodes.find((n) => n.data.id === this.selectedNodeId);
      if (selectedNode) {
        this.showInfoPanel(selectedNode.data);
      }
    }
  }

  /**
   * Register a callback for node selection events.
   */
  onNodeSelect(callback: NodeSelectCallback): void {
    this.nodeSelectCallbacks.push(callback);
  }

  /**
   * Animate cascade events along edges.
   * Shows a propagation pulse from source to affected nodes.
   */
  animateCascade(events: CascadeEvent[]): void {
    if (!this.linkGroup || !this.svg) return;

    for (const event of events) {
      // Find the matching link
      const link = this.linkGroup
        .selectAll<SVGLineElement, SimLink>('line.link')
        .filter(
          (d) =>
            d.data.sourceId === event.sourceNodeId &&
            d.data.targetId === event.affectedNodeId
        );

      if (!link.empty()) {
        // Pulse animation: briefly increase opacity and stroke width
        link
          .transition()
          .duration(CASCADE_PULSE_DURATION / 3)
          .attr('stroke', '#f44336')
          .attr('stroke-width', 3)
          .attr('stroke-opacity', 1)
          .transition()
          .duration(CASCADE_PULSE_DURATION / 3)
          .attr('stroke-width', 4)
          .attr('stroke-opacity', 0.9)
          .transition()
          .duration(CASCADE_PULSE_DURATION / 3)
          .attr('stroke', 'var(--text-secondary, #a0a0b0)')
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', (d: SimLink) =>
            LINK_MIN_OPACITY + d.data.weight * (LINK_MAX_OPACITY - LINK_MIN_OPACITY)
          );
      }
    }
  }

  /**
   * Destroy the visualization and clean up resources.
   */
  destroy(): void {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.simNodes = [];
    this.simLinks = [];
    this.selectedNodeId = null;
    this.focusedIndex = -1;
  }

  // --- Private methods ---

  private buildSimulationData(network: RepresentationalNetwork): void {
    this.simNodes = network.nodes.map((node) => ({ data: node }));

    const nodeMap = new Map(this.simNodes.map((n) => [n.data.id, n]));
    this.simLinks = network.edges
      .filter((e) => nodeMap.has(e.sourceId) && nodeMap.has(e.targetId))
      .map((edge) => ({
        source: nodeMap.get(edge.sourceId)!,
        target: nodeMap.get(edge.targetId)!,
        data: edge,
      }));
  }

  private getNodeRadius(d: SimNode): number {
    const maxCentrality = Math.max(...this.simNodes.map((n) => n.data.descendantCentrality), 1);
    return centralityToRadius(d.data.descendantCentrality, maxCentrality);
  }

  private drawLinks(): void {
    if (!this.linkGroup) return;

    this.linkGroup
      .selectAll('line.link')
      .data(this.simLinks, (d: unknown) => {
        const link = d as SimLink;
        return `${link.data.sourceId}-${link.data.targetId}`;
      })
      .join('line')
      .attr('class', 'link')
      .attr('stroke', 'var(--text-secondary, #a0a0b0)')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', (d) =>
        LINK_MIN_OPACITY + d.data.weight * (LINK_MAX_OPACITY - LINK_MIN_OPACITY)
      )
      .attr('marker-end', 'url(#arrowhead)');
  }

  private drawNodes(): void {
    if (!this.nodeGroup) return;

    const maxCentrality = Math.max(...this.simNodes.map((n) => n.data.descendantCentrality), 1);

    const nodeGroups = this.nodeGroup
      .selectAll<SVGGElement, SimNode>('g.node')
      .data(this.simNodes, (d) => d.data.id)
      .join('g')
      .attr('class', 'node')
      .attr('role', 'button')
      .attr('tabindex', '0')
      .attr('aria-label', (d) =>
        `${d.data.label}: ${resolutionStateLabel(d.data.resolution)}, resolution ${(d.data.resolution * 100).toFixed(0)}%`
      )
      .on('click', (_event, d) => this.selectNode(d))
      .on('keydown', (event: KeyboardEvent, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.selectNode(d);
        }
      })
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on('start', (event, d) => this.dragStarted(event, d))
          .on('drag', (event, d) => this.dragged(event, d))
          .on('end', (event, d) => this.dragEnded(event, d))
      );

    // Node circle
    nodeGroups
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d) => centralityToRadius(d.data.descendantCentrality, maxCentrality))
      .attr('fill', (d) => resolutionToColor(d.data.resolution))
      .attr('stroke', 'var(--border, #2a2a4a)')
      .attr('stroke-width', 2)
      .style('transition', `fill ${TRANSITION_DURATION}ms ease`);

    // Node label (short version for graph)
    nodeGroups
      .append('text')
      .attr('class', 'node-label')
      .attr('dy', (d) => centralityToRadius(d.data.descendantCentrality, maxCentrality) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-secondary, #a0a0b0)')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none')
      .text((d) => {
        // Truncate long labels for display
        const label = d.data.label;
        return label.length > 20 ? label.slice(0, 18) + '...' : label;
      });
  }

  private tick(): void {
    if (!this.linkGroup || !this.nodeGroup) return;

    this.linkGroup
      .selectAll<SVGLineElement, SimLink>('line.link')
      .attr('x1', (d) => (d.source as SimNode).x ?? 0)
      .attr('y1', (d) => (d.source as SimNode).y ?? 0)
      .attr('x2', (d) => (d.target as SimNode).x ?? 0)
      .attr('y2', (d) => (d.target as SimNode).y ?? 0);

    this.nodeGroup
      .selectAll<SVGGElement, SimNode>('g.node')
      .attr('transform', (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`);
  }

  private selectNode(simNode: SimNode): void {
    const previousId = this.selectedNodeId;
    this.selectedNodeId = simNode.data.id;

    // Update visual selection state
    if (this.nodeGroup) {
      this.nodeGroup
        .selectAll<SVGCircleElement, SimNode>('circle.node-circle')
        .attr('stroke', (d) =>
          d.data.id === this.selectedNodeId
            ? 'var(--text-primary, #eaeaea)'
            : 'var(--border, #2a2a4a)'
        )
        .attr('stroke-width', (d) => (d.data.id === this.selectedNodeId ? 3 : 2));
    }

    // Show info panel
    this.showInfoPanel(simNode.data);

    // Notify callbacks
    if (previousId !== simNode.data.id) {
      for (const cb of this.nodeSelectCallbacks) {
        cb(simNode.data);
      }
    }
  }

  private showInfoPanel(node: RepresentationNode): void {
    if (!this.infoPanel) return;

    this.infoPanel.innerHTML = `
      <h3 class="info-panel-title">${this.escapeHtml(node.label)}</h3>
      <dl class="info-panel-props">
        <dt>Resolution</dt>
        <dd>${(node.resolution * 100).toFixed(1)}% (${resolutionStateLabel(node.resolution)})</dd>
        <dt>Confidence</dt>
        <dd>${(node.confidence * 100).toFixed(1)}%</dd>
        <dt>Source</dt>
        <dd>${node.source}</dd>
        <dt>Updateability</dt>
        <dd>${(node.updateability * 100).toFixed(1)}%</dd>
        <dt>Descendant centrality</dt>
        <dd>${node.descendantCentrality}</dd>
        <dt>Path centrality</dt>
        <dd>${node.pathCentrality}</dd>
        <dt>Activation threshold</dt>
        <dd>${node.activationThreshold.toFixed(2)}</dd>
        <dt>Category</dt>
        <dd>${node.category}</dd>
        <dt>Compressed</dt>
        <dd>${node.isCompressed ? 'Yes' : 'No'}</dd>
      </dl>
    `;
    this.infoPanel.style.display = 'block';
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (this.simNodes.length === 0) return;

    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        this.focusedIndex =
          this.focusedIndex <= 0 ? this.simNodes.length - 1 : this.focusedIndex - 1;
      } else {
        this.focusedIndex = (this.focusedIndex + 1) % this.simNodes.length;
      }
      this.focusNode(this.focusedIndex);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.focusedIndex >= 0 && this.focusedIndex < this.simNodes.length) {
        this.selectNode(this.simNodes[this.focusedIndex]!);
      }
    } else if (event.key === 'Escape') {
      this.clearSelection();
    }
  }

  private focusNode(index: number): void {
    if (!this.nodeGroup) return;

    // Remove previous focus indicator
    this.nodeGroup.selectAll('circle.node-circle').attr('stroke-dasharray', null);

    // Add focus indicator to current node
    const nodeElements = this.nodeGroup.selectAll<SVGGElement, SimNode>('g.node');
    const nodes = nodeElements.nodes();
    if (index >= 0 && index < nodes.length) {
      const node = nodes[index];
      if (node) {
        d3.select(node).select('circle.node-circle').attr('stroke-dasharray', '4,2');
        (node as unknown as HTMLElement).focus();
      }
    }
  }

  private clearSelection(): void {
    this.selectedNodeId = null;
    if (this.nodeGroup) {
      this.nodeGroup
        .selectAll<SVGCircleElement, SimNode>('circle.node-circle')
        .attr('stroke', 'var(--border, #2a2a4a)')
        .attr('stroke-width', 2);
    }
    if (this.infoPanel) {
      this.infoPanel.style.display = 'none';
      this.infoPanel.innerHTML = '';
    }
    for (const cb of this.nodeSelectCallbacks) {
      cb(null);
    }
  }

  private dragStarted(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, d: SimNode): void {
    if (!event.active) this.simulation?.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, d: SimNode): void {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragEnded(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>, d: SimNode): void {
    if (!event.active) this.simulation?.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
