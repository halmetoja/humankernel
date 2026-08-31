/**
 * NarrativeEngine: generates separate left/right narratives
 * for the distributed and hub-dependent topologies.
 */

import type { SimulationStep } from '../types';

export interface NarrativeEntry {
  text: string;
  level: 'info' | 'observation' | 'significant';
}

export interface SplitNarrative {
  distributed: NarrativeEntry[];
  hubDependent: NarrativeEntry[];
}

export class NarrativeEngine {
  private ctAnnouncedHub = false;
  private cascadeAnnounced = false;

  describeInitialSplit(): SplitNarrative {
    return {
      distributed: [
        { text: 'Multiple anchors support the network. No single point of failure.', level: 'info' },
      ],
      hubDependent: [
        { text: 'Most representations depend on a single hub. If the hub fails, everything connected to it is at risk.', level: 'info' },
      ],
    };
  }

  describeComparisonSplit(
    distributedStep: SimulationStep,
    hubStep: SimulationStep
  ): SplitNarrative {
    const load = distributedStep.currentLoad;
    const distributed: NarrativeEntry[] = [];
    const hubDependent: NarrativeEntry[] = [];

    if (load === 0) {
      return this.describeInitialSplit();
    }

    // --- Distributed ---
    if (distributedStep.nodesCompressed.length === 0) {
      distributed.push({
        text: 'Holding. Redundant paths distribute the pressure across multiple anchors.',
        level: 'info',
      });
    } else if (distributedStep.nodesCompressed.length <= 3) {
      distributed.push({
        text: `${distributedStep.nodesCompressed.length} peripheral representations lost resolution. Core structure intact.`,
        level: 'observation',
      });
    } else {
      distributed.push({
        text: `${distributedStep.nodesCompressed.length} representations compressed. Load is shared - no cascading collapse.`,
        level: 'observation',
      });
    }

    if (distributedStep.cascadeEvents.length > 0) {
      distributed.push({
        text: `Minor cascade: ${distributedStep.cascadeEvents.length} dependent representations affected. Redundancy limits propagation.`,
        level: 'observation',
      });
    }

    // --- Hub-dependent ---
    const hubCompressed = hubStep.nodesCompressed.length;
    const hasCascade = hubStep.cascadeEvents.length > 0;
    const massCollapse = hubCompressed > 5;

    if (hubCompressed === 0) {
      hubDependent.push({
        text: 'Holding. The hub is still above its threshold.',
        level: 'info',
      });
    } else if (!massCollapse && !hasCascade) {
      hubDependent.push({
        text: `${hubCompressed} peripheral representations sacrificed. The system protects the hub at the cost of everything less central.`,
        level: 'observation',
      });
    } else if (massCollapse && !this.cascadeAnnounced) {
      this.cascadeAnnounced = true;
      hubDependent.push({
        text: 'The hub has been reached. When the central representation that everything depends on loses resolution, the entire dependent structure collapses.',
        level: 'significant',
      });
      if (hasCascade) {
        hubDependent.push({
          text: `Cascade: ${hubStep.cascadeEvents.length} representations lost their structural foundation.`,
          level: 'significant',
        });
      }
    } else {
      hubDependent.push({
        text: `${hubCompressed} representations compressed. Serial dependencies transmit instability through the network.`,
        level: 'observation',
      });
      if (hasCascade) {
        hubDependent.push({
          text: `Cascade continues: ${hubStep.cascadeEvents.length} further representations destabilized.`,
          level: 'significant',
        });
      }
    }

    return { distributed, hubDependent };
  }

  // Legacy compatibility
  describeInitial(): NarrativeEntry[] {
    const split = this.describeInitialSplit();
    return [...split.distributed, ...split.hubDependent];
  }

  describeComparison(d: SimulationStep, h: SimulationStep): NarrativeEntry[] {
    const split = this.describeComparisonSplit(d, h);
    return [...split.distributed, ...split.hubDependent];
  }

  describe(step: SimulationStep, _label: string): NarrativeEntry[] {
    return this.describeComparison(step, step);
  }

  reset(): void {
    this.ctAnnouncedHub = false;
    this.cascadeAnnounced = false;
  }
}
