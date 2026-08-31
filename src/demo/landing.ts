/**
 * LandingDemo: orchestrates the full landing page experience.
 *
 * Layout:
 * 1. Epistemic header explaining what the visitor will see
 * 2. "Same load. Different topology. Click Apply Load." prompt
 * 3. ComparisonView (contains side-by-side graphs + controls + metrics)
 * 4. Narrative region showing SRF commentary during simulation
 * 5. Closing explanation communicating the core insight
 *
 * The LandingDemo USES ComparisonView for the visualization and controls.
 * It adds the framing content, narrative updates, and insight communication
 * around it.
 *
 * Keyboard accessible, WCAG AA compliant.
 */

import { ComparisonView } from '../visualization/comparison-view';
import { NarrativeEngine } from './narrative';
import type { NarrativeEntry, SplitNarrative } from './narrative';
import { SimulationEngine } from '../simulation/engine';
import {
  createDistributedTopology,
  createHubDependentTopology,
} from '../simulation/presets';
import { createLiveRegion, setAriaLabel } from '../utils/accessibility';

/**
 * LandingDemo class.
 * Creates the full landing page and wires up the narrative engine
 * to respond to simulation events.
 */
export class LandingDemo {
  private container: HTMLElement | null = null;
  private comparisonView: ComparisonView = new ComparisonView();
  private narrativeEngine: NarrativeEngine = new NarrativeEngine();
  private narrativeRegion: HTMLElement | null = null;
  private narrativeLeft: HTMLElement | null = null;
  private narrativeRight: HTMLElement | null = null;

  // Separate engine instances for narrative tracking
  private distributedEngine: SimulationEngine = new SimulationEngine();
  private hubDependentEngine: SimulationEngine = new SimulationEngine();

  /**
   * Initialize and render the landing page into a container element.
   */
  init(container: HTMLElement): void {
    this.container = container;
    container.innerHTML = '';

    // Main landmark
    const main = document.createElement('main');
    main.classList.add('landing-demo');
    setAriaLabel(main, 'Human Kernel Theory interactive demonstration');
    container.appendChild(main);

    // 1. Epistemic header
    main.appendChild(this.createEpistemicHeader());

    // 2. Prompt message
    main.appendChild(this.createPrompt());

    // 3. ComparisonView (handles graphs, slider, buttons, metrics)
    const comparisonContainer = document.createElement('div');
    comparisonContainer.classList.add('comparison-container');
    main.appendChild(comparisonContainer);
    this.comparisonView.render(comparisonContainer);

    // 4. Narrative region (split: left for distributed, right for hub-dependent)
    this.narrativeRegion = this.createNarrativeRegion();
    main.appendChild(this.narrativeRegion);

    // Show initial narrative
    const initial = this.narrativeEngine.describeInitialSplit();
    this.renderSplitNarrative(initial);

    // 5. Closing explanation
    main.appendChild(this.createClosingExplanation());

    // Wire up engines for narrative tracking
    this.distributedEngine.loadNetwork(createDistributedTopology());
    this.hubDependentEngine.loadNetwork(createHubDependentTopology());

    // Wire slider changes to narrative updates
    this.wireSliderToNarrative(comparisonContainer);
  }

  /**
   * Programmatically set load level and update narrative.
   */
  applyLoad(amount?: number): void {
    const loadAmount = amount ?? 1.0;

    // Apply to comparison view (handles visualization)
    this.comparisonView.applyLoad(loadAmount);

    // Apply to tracking engines (for narrative generation)
    const distResult = this.distributedEngine.simulateAtLoad(loadAmount);
    const hubResult = this.hubDependentEngine.simulateAtLoad(loadAmount);

    // Generate and display narrative
    const entries = this.narrativeEngine.describeComparison(
      distResult.step,
      hubResult.step
    );
    this.renderNarrativeEntries(entries);
  }

  /**
   * Reset the demo to initial state.
   */
  reset(): void {
    this.comparisonView.reset();
    this.narrativeEngine.reset();
    this.distributedEngine.reset();
    this.hubDependentEngine.reset();

    // Clear narrative and show initial
    if (this.narrativeRegion) {
      this.narrativeRegion.innerHTML = '';
    }
    this.renderNarrativeEntries(this.narrativeEngine.describeInitial());
  }

  /**
   * Destroy the landing demo and clean up resources.
   */
  destroy(): void {
    this.comparisonView.destroy();
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.container = null;
    this.narrativeRegion = null;
  }

  // --- Private methods ---

  /**
   * Create the epistemic header section.
   * Explains what the visitor is about to see in SRF terms.
   */
  private createEpistemicHeader(): HTMLElement {
    const header = document.createElement('header');
    header.classList.add('epistemic-header');

    const h1 = document.createElement('h1');
    h1.textContent = 'Representational Network Simulation';
    header.appendChild(h1);

    const explanation = document.createElement('div');
    explanation.classList.add('epistemic-explanation');
    explanation.innerHTML = `
      <p>
        You are looking at two representational networks. Each contains the same
        psychological content: beliefs, self-representations, and relational
        expectations that a person holds about themselves and others.
      </p>
      <p>
        The content is identical. The structure is different. One network
        distributes structural support across multiple anchors. The other routes
        most support through a single critical hub.
      </p>
      <p>
        When affective load increases (stress, relational conflict, threat), the
        network must maintain simultaneity: the capacity to hold contradictory or
        complex representations active at the same time. If load exceeds the
        network's holding threshold, representations begin losing resolution.
        This is compression: the consequence of simultaneity failure.
      </p>
      <p>
        What follows is a simulation. The outcome depends on the topology, not on
        predetermined conclusions.
      </p>
    `;
    header.appendChild(explanation);

    return header;
  }

  /**
   * Create the prompt message.
   */
  private createPrompt(): HTMLElement {
    const prompt = document.createElement('p');
    prompt.classList.add('demo-prompt');
    prompt.setAttribute('role', 'status');
    prompt.textContent = 'Same load. Different topology. Click Apply Load.';
    return prompt;
  }

  /**
   * Create the narrative region (aria-live for screen reader announcements).
   */
  private createNarrativeRegion(): HTMLElement {
    const section = document.createElement('section');
    section.classList.add('narrative-region');
    setAriaLabel(section, 'Simulation narrative');

    const heading = document.createElement('h2');
    heading.textContent = 'What is happening';
    section.appendChild(heading);

    const splitContainer = document.createElement('div');
    splitContainer.classList.add('narrative-split');

    // Left: distributed
    const leftCol = document.createElement('div');
    leftCol.classList.add('narrative-col');
    const leftLabel = document.createElement('h4');
    leftLabel.textContent = 'Distributed';
    leftLabel.classList.add('narrative-col-label');
    leftCol.appendChild(leftLabel);
    this.narrativeLeft = document.createElement('div');
    this.narrativeLeft.classList.add('narrative-content');
    this.narrativeLeft.setAttribute('aria-live', 'polite');
    leftCol.appendChild(this.narrativeLeft);
    splitContainer.appendChild(leftCol);

    // Right: hub-dependent
    const rightCol = document.createElement('div');
    rightCol.classList.add('narrative-col');
    const rightLabel = document.createElement('h4');
    rightLabel.textContent = 'Hub-Dependent';
    rightLabel.classList.add('narrative-col-label');
    rightCol.appendChild(rightLabel);
    this.narrativeRight = document.createElement('div');
    this.narrativeRight.classList.add('narrative-content');
    this.narrativeRight.setAttribute('aria-live', 'polite');
    rightCol.appendChild(this.narrativeRight);
    splitContainer.appendChild(rightCol);

    section.appendChild(splitContainer);
    return section;
  }

  /**
   * Create the closing explanation section.
   * Communicates the core insight without asserting it as a confirmed truth.
   */
  private createClosingExplanation(): HTMLElement {
    const section = document.createElement('section');
    section.classList.add('closing-explanation');

    const heading = document.createElement('h2');
    heading.textContent = 'The structural insight';
    section.appendChild(heading);

    const text = document.createElement('div');
    text.classList.add('closing-text');
    text.innerHTML = `
      <p>
        The simulation demonstrates a structural hypothesis: psychological
        vulnerability may be determined not by <em>what</em> a person believes,
        but by <em>how</em> their representations are structurally connected.
      </p>
      <p>
        Two people can hold the same representations ("I can be loved," "I can
        fail," "Others have independent minds") yet respond entirely differently
        to the same affective load, depending on whether those representations
        are distributed across redundant structural supports or funneled through
        a single critical hub.
      </p>
      <p>
        This is the Structural Regulation Framework's core claim: topology
        determines vulnerability. Whether topology can change through later
        experience remains an open developmental question.
      </p>
    `;
    section.appendChild(text);

    return section;
  }

  /**
   * Render narrative entries into the narrative region.
   */
  private renderSplitNarrative(split: SplitNarrative): void {
    if (this.narrativeLeft) {
      this.narrativeLeft.innerHTML = '';
      for (const entry of split.distributed) {
        const p = document.createElement('p');
        p.classList.add('narrative-entry', 'narrative-' + entry.level);
        p.textContent = entry.text;
        this.narrativeLeft.appendChild(p);
      }
    }
    if (this.narrativeRight) {
      this.narrativeRight.innerHTML = '';
      for (const entry of split.hubDependent) {
        const p = document.createElement('p');
        p.classList.add('narrative-entry', 'narrative-' + entry.level);
        p.textContent = entry.text;
        this.narrativeRight.appendChild(p);
      }
    }
  }

  private renderNarrativeEntries(entries: NarrativeEntry[]): void {
    if (!this.narrativeRegion) return;

    const content = this.narrativeRegion.querySelector('.narrative-content');
    if (!content) return;

    for (const entry of entries) {
      const p = document.createElement('p');
      p.classList.add('narrative-entry', `narrative-${entry.level}`);
      p.textContent = entry.text;
      content.appendChild(p);
    }

    // Scroll to latest entry
    content.scrollTop = content.scrollHeight;
  }

  /**
   * Wire the slider to narrative updates. Each slider change triggers
   * a fresh simulation and narrative update.
   */
  private wireSliderToNarrative(comparisonContainer: HTMLElement): void {
    // Use event delegation on container to catch slider input events
    // even if the slider is nested inside ComparisonView's wrapper
    comparisonContainer.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.id !== 'load-slider') return;
      const slider = target;
      {
        const loadValue = parseFloat(slider.value);

        // Simulate at absolute load for narrative
        const distResult = this.distributedEngine.simulateAtLoad(loadValue);
        const hubResult = this.hubDependentEngine.simulateAtLoad(loadValue);

        // Clear previous narrative and show current state
        const content = this.narrativeRegion?.querySelector('.narrative-content');
        if (content) {
          content.innerHTML = '';
        }

        if (loadValue === 0) {
          this.narrativeEngine.reset();
          this.renderSplitNarrative(this.narrativeEngine.describeInitialSplit());
        } else {
          this.narrativeEngine.reset();
          const split = this.narrativeEngine.describeComparisonSplit(
            distResult.step,
            hubResult.step
          );
          this.renderSplitNarrative(split);
        }
      }
    });

    // Reset button
    const resetBtn = comparisonContainer.querySelector('.btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.narrativeEngine.reset();
        this.distributedEngine.reset();
        this.hubDependentEngine.reset();

        const content = this.narrativeRegion?.querySelector('.narrative-content');
        if (content) {
          content.innerHTML = '';
        }
        this.renderSplitNarrative(this.narrativeEngine.describeInitialSplit());
      });
    }
  }
}
