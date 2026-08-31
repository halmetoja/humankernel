/**
 * ComparisonView: side-by-side topology comparison with a direct load slider.
 *
 * The slider sets an absolute load level. Both networks are computed fresh
 * at each slider position - no incremental accumulation, fully reversible.
 * Dragging left reduces load, dragging right increases it.
 *
 * The hub-dependent network's critical hub is visually marked so the user
 * can see when it crosses its compression threshold.
 */

import type {
  ComparisonResult,
  RepresentationalNetwork,
} from '../types';
import { NetworkGraphViz } from './network-graph';
import { SimulationEngine } from '../simulation/engine';
import { createDistributedTopology, createHubDependentTopology } from '../simulation/presets';

const LOAD_MIN = 0;
const LOAD_MAX = 5.0;
const LOAD_STEP = 0.05;

export class ComparisonView {
  private container: HTMLElement | null = null;

  private distributedViz: NetworkGraphViz = new NetworkGraphViz();
  private hubDependentViz: NetworkGraphViz = new NetworkGraphViz();

  private distributedEngine: SimulationEngine = new SimulationEngine();
  private hubDependentEngine: SimulationEngine = new SimulationEngine();

  private distributedData: RepresentationalNetwork;
  private hubDependentData: RepresentationalNetwork;

  private metricsPanel: HTMLElement | null = null;
  private loadSlider: HTMLInputElement | null = null;
  private loadValueLabel: HTMLElement | null = null;
  private currentLoad: number = 0;

  constructor() {
    this.distributedData = createDistributedTopology();
    this.hubDependentData = createHubDependentTopology();
  }

  render(container: HTMLElement): void {
    this.container = container;
    container.innerHTML = '';

    const wrapper = document.createElement('section');
    wrapper.classList.add('comparison-view');
    wrapper.setAttribute('aria-label', 'Topology comparison');
    container.appendChild(wrapper);

    // Graphs side by side
    const graphsContainer = document.createElement('div');
    graphsContainer.classList.add('comparison-graphs');
    wrapper.appendChild(graphsContainer);

    const distributedPanel = this.createGraphPanel('Distributed', 'distributed-graph');
    const hubPanel = this.createGraphPanel('Hub-Dependent', 'hub-dependent-graph');
    graphsContainer.appendChild(distributedPanel);
    graphsContainer.appendChild(hubPanel);

    // Load slider (direct, no apply button)
    const controls = this.createControls();
    wrapper.appendChild(controls);

    // Metrics
    this.metricsPanel = document.createElement('div');
    this.metricsPanel.classList.add('comparison-metrics');
    this.metricsPanel.setAttribute('aria-live', 'polite');
    this.metricsPanel.setAttribute('role', 'region');
    this.metricsPanel.setAttribute('aria-label', 'Simulation metrics');
    wrapper.appendChild(this.metricsPanel);

    // Load engines
    this.distributedEngine.loadNetwork(this.distributedData);
    this.hubDependentEngine.loadNetwork(this.hubDependentData);

    // Initial render
    const distGraphEl = distributedPanel.querySelector('.graph-container') as HTMLElement;
    const hubGraphEl = hubPanel.querySelector('.graph-container') as HTMLElement;

    this.distributedViz.render(distGraphEl, this.distributedData);
    this.hubDependentViz.render(hubGraphEl, this.hubDependentData);

    this.updateMetrics();
  }

  /**
   * Apply load directly (for programmatic use from LandingDemo).
   */
  applyLoad(amount: number): void {
    this.currentLoad = amount;
    if (this.loadSlider) {
      this.loadSlider.value = String(amount);
    }
    this.simulateAndUpdate(amount);
  }

  reset(): void {
    this.currentLoad = 0;
    if (this.loadSlider) {
      this.loadSlider.value = '0';
    }
    if (this.loadValueLabel) {
      this.loadValueLabel.textContent = '0.0';
    }
    this.simulateAndUpdate(0);
  }

  getResults(): ComparisonResult {
    const dMetrics = this.distributedEngine.getMetrics();
    const hMetrics = this.hubDependentEngine.getMetrics();
    return {
      topology1: {
        type: 'distributed',
        totalResolutionRetained: dMetrics.totalResolution,
        maxCascadeDepth: dMetrics.maxCascadeDepth,
        compressedNodes: [],
      },
      topology2: {
        type: 'hub-dependent',
        totalResolutionRetained: hMetrics.totalResolution,
        maxCascadeDepth: hMetrics.maxCascadeDepth,
        compressedNodes: [],
      },
    };
  }

  destroy(): void {
    this.distributedViz.destroy();
    this.hubDependentViz.destroy();
    if (this.container) this.container.innerHTML = '';
    this.container = null;
  }

  // --- Private ---

  private simulateAndUpdate(absoluteLoad: number): void {
    const distResult = this.distributedEngine.simulateAtLoad(absoluteLoad);
    const hubResult = this.hubDependentEngine.simulateAtLoad(absoluteLoad);

    this.distributedViz.update(distResult.networkState);
    this.hubDependentViz.update(hubResult.networkState);

    if (distResult.step.cascadeEvents.length > 0) {
      this.distributedViz.animateCascade(distResult.step.cascadeEvents);
    }
    if (hubResult.step.cascadeEvents.length > 0) {
      this.hubDependentViz.animateCascade(hubResult.step.cascadeEvents);
    }

    this.updateMetrics();
  }

  private createGraphPanel(label: string, id: string): HTMLElement {
    const panel = document.createElement('div');
    panel.classList.add('graph-panel');
    panel.id = id;

    const heading = document.createElement('h3');
    heading.classList.add('graph-panel-label');
    heading.textContent = label;
    panel.appendChild(heading);

    const graphContainer = document.createElement('div');
    graphContainer.classList.add('graph-container');
    panel.appendChild(graphContainer);

    return panel;
  }

  private createControls(): HTMLElement {
    const controls = document.createElement('div');
    controls.classList.add('comparison-controls');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Load control');

    const sliderGroup = document.createElement('div');
    sliderGroup.classList.add('slider-group');

    const label = document.createElement('label');
    label.setAttribute('for', 'load-slider');
    label.textContent = 'Affective load: ';
    sliderGroup.appendChild(label);

    this.loadSlider = document.createElement('input');
    this.loadSlider.type = 'range';
    this.loadSlider.id = 'load-slider';
    this.loadSlider.min = String(LOAD_MIN);
    this.loadSlider.max = String(LOAD_MAX);
    this.loadSlider.step = String(LOAD_STEP);
    this.loadSlider.value = '0';
    this.loadSlider.setAttribute('aria-label', 'Affective load level');
    sliderGroup.appendChild(this.loadSlider);

    this.loadValueLabel = document.createElement('span');
    this.loadValueLabel.classList.add('load-value-label');
    this.loadValueLabel.textContent = '0.0';
    sliderGroup.appendChild(this.loadValueLabel);

    // Real-time update on slider input
    this.loadSlider.addEventListener('input', () => {
      const value = parseFloat(this.loadSlider!.value);
      this.currentLoad = value;
      if (this.loadValueLabel) {
        this.loadValueLabel.textContent = value.toFixed(1);
      }
      this.simulateAndUpdate(value);
    });

    controls.appendChild(sliderGroup);

    // Reset button only
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.classList.add('btn', 'btn-reset');
    resetBtn.textContent = 'Reset';
    resetBtn.setAttribute('aria-label', 'Reset to zero load');
    resetBtn.addEventListener('click', () => this.reset());
    controls.appendChild(resetBtn);

    return controls;
  }

  private updateMetrics(): void {
    if (!this.metricsPanel) return;

    const dMetrics = this.distributedEngine.getMetrics();
    const hMetrics = this.hubDependentEngine.getMetrics();

    const dTotal = this.distributedData.nodes.length;
    const hTotal = this.hubDependentData.nodes.length;

    this.metricsPanel.innerHTML = `
      <div class="metrics-row">
        <div class="metric-col">
          <span class="metric-label">Distributed</span>
          <span class="metric-value">Resolution: ${dMetrics.totalResolution.toFixed(1)}/${dTotal.toFixed(1)}</span>
          <span class="metric-value">Compressed: ${dMetrics.compressedNodeCount}/${dTotal}</span>
          <span class="metric-value">Cascade depth: ${dMetrics.maxCascadeDepth}</span>
          ${dMetrics.emergentCT !== null ? `<span class="metric-value">CT: ${dMetrics.emergentCT.toFixed(2)}</span>` : ''}
        </div>
        <div class="metric-col">
          <span class="metric-label">Hub-Dependent</span>
          <span class="metric-value">Resolution: ${hMetrics.totalResolution.toFixed(1)}/${hTotal.toFixed(1)}</span>
          <span class="metric-value">Compressed: ${hMetrics.compressedNodeCount}/${hTotal}</span>
          <span class="metric-value">Cascade depth: ${hMetrics.maxCascadeDepth}</span>
          ${hMetrics.emergentCT !== null ? `<span class="metric-value">CT: ${hMetrics.emergentCT.toFixed(2)}</span>` : ''}
        </div>
      </div>
    `;
  }
}
