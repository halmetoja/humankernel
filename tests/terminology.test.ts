import { describe, it, expect } from 'vitest';
import { TerminologyChecker } from '../src/utils/terminology';
import { NarrativeEngine } from '../src/demo/narrative';
import type { SimulationStep, CascadeEvent } from '../src/types';

describe('Terminology compliance of narrative output', () => {
  const checker = new TerminologyChecker();

  function assertCompliant(texts: string[]): void {
    for (const text of texts) {
      const violations = checker.validate(text);
      expect(violations, `Terminology violation in: "${text}"`).toEqual([]);
    }
  }

  describe('describeInitial()', () => {
    it('passes terminology compliance', () => {
      const engine = new NarrativeEngine();
      const entries = engine.describeInitial();
      assertCompliant(entries.map((e) => e.text));
    });
  });

  describe('describe() single topology', () => {
    it('passes terminology compliance for basic load step', () => {
      const engine = new NarrativeEngine();
      const step: SimulationStep = {
        stepNumber: 1,
        currentLoad: 2.0,
        nodesCompressed: [],
        cascadeEvents: [],
        totalResolution: 10.0,
        emergentCT: null,
      };

      const entries = engine.describe(step, 'Distributed');
      assertCompliant(entries.map((e) => e.text));
    });

    it('passes terminology compliance when CT emerges', () => {
      const engine = new NarrativeEngine();
      const step: SimulationStep = {
        stepNumber: 1,
        currentLoad: 3.5,
        nodesCompressed: [],
        cascadeEvents: [],
        totalResolution: 10.0,
        emergentCT: 3.5,
      };

      const entries = engine.describe(step, 'Hub-Dependent');
      assertCompliant(entries.map((e) => e.text));
    });

    it('passes terminology compliance when nodes compress', () => {
      const engine = new NarrativeEngine();
      // First step to establish previous resolution
      engine.describe(
        {
          stepNumber: 1,
          currentLoad: 2.0,
          nodesCompressed: [],
          cascadeEvents: [],
          totalResolution: 10.0,
          emergentCT: null,
        },
        'Distributed'
      );

      const step: SimulationStep = {
        stepNumber: 2,
        currentLoad: 4.0,
        nodesCompressed: ['I can be loved', 'Others have independent minds'],
        cascadeEvents: [],
        totalResolution: 8.5,
        emergentCT: 3.0,
      };

      const entries = engine.describe(step, 'Distributed');
      assertCompliant(entries.map((e) => e.text));
    });

    it('passes terminology compliance during cascades', () => {
      const engine = new NarrativeEngine();
      // First step
      engine.describe(
        {
          stepNumber: 1,
          currentLoad: 2.0,
          nodesCompressed: [],
          cascadeEvents: [],
          totalResolution: 10.0,
          emergentCT: null,
        },
        'Hub-Dependent'
      );

      const cascadeEvents: CascadeEvent[] = [
        {
          sourceNodeId: 'I am validated',
          affectedNodeId: 'I can be loved',
          resolutionLost: 0.4,
        },
        {
          sourceNodeId: 'I am validated',
          affectedNodeId: 'I have worth',
          resolutionLost: 0.3,
        },
      ];

      const step: SimulationStep = {
        stepNumber: 2,
        currentLoad: 5.0,
        nodesCompressed: ['I am validated'],
        cascadeEvents,
        totalResolution: 6.0,
        emergentCT: 3.5,
      };

      const entries = engine.describe(step, 'Hub-Dependent');
      assertCompliant(entries.map((e) => e.text));
    });

    it('passes terminology compliance with single cascade event', () => {
      const engine = new NarrativeEngine();
      engine.describe(
        {
          stepNumber: 1,
          currentLoad: 2.0,
          nodesCompressed: [],
          cascadeEvents: [],
          totalResolution: 10.0,
          emergentCT: null,
        },
        'Distributed'
      );

      const step: SimulationStep = {
        stepNumber: 2,
        currentLoad: 4.5,
        nodesCompressed: ['I exist as separate'],
        cascadeEvents: [
          {
            sourceNodeId: 'I exist as separate',
            affectedNodeId: 'I can fail safely',
            resolutionLost: 0.25,
          },
        ],
        totalResolution: 7.5,
        emergentCT: 3.0,
      };

      const entries = engine.describe(step, 'Distributed');
      assertCompliant(entries.map((e) => e.text));
    });
  });

  describe('describeComparison()', () => {
    it('passes terminology compliance with no compressions', () => {
      const engine = new NarrativeEngine();
      const distributedStep: SimulationStep = {
        stepNumber: 1,
        currentLoad: 2.0,
        nodesCompressed: [],
        cascadeEvents: [],
        totalResolution: 12.0,
        emergentCT: null,
      };
      const hubStep: SimulationStep = {
        stepNumber: 1,
        currentLoad: 2.0,
        nodesCompressed: [],
        cascadeEvents: [],
        totalResolution: 12.0,
        emergentCT: null,
      };

      const entries = engine.describeComparison(distributedStep, hubStep);
      assertCompliant(entries.map((e) => e.text));
    });

    it('passes terminology compliance when hub compresses', () => {
      const engine = new NarrativeEngine();
      const distributedStep: SimulationStep = {
        stepNumber: 2,
        currentLoad: 4.0,
        nodesCompressed: [],
        cascadeEvents: [],
        totalResolution: 11.5,
        emergentCT: 3.5,
      };
      const hubStep: SimulationStep = {
        stepNumber: 2,
        currentLoad: 4.0,
        nodesCompressed: ['I am validated', 'I can be loved'],
        cascadeEvents: [
          {
            sourceNodeId: 'I am validated',
            affectedNodeId: 'I can be loved',
            resolutionLost: 0.4,
          },
        ],
        totalResolution: 8.0,
        emergentCT: 3.0,
      };

      const entries = engine.describeComparison(distributedStep, hubStep);
      assertCompliant(entries.map((e) => e.text));
    });

    it('passes terminology compliance when distributed retains more resolution', () => {
      const engine = new NarrativeEngine();
      const distributedStep: SimulationStep = {
        stepNumber: 3,
        currentLoad: 5.0,
        nodesCompressed: ['I can fail safely'],
        cascadeEvents: [],
        totalResolution: 10.0,
        emergentCT: 4.0,
      };
      const hubStep: SimulationStep = {
        stepNumber: 3,
        currentLoad: 5.0,
        nodesCompressed: ['I am validated', 'I can be loved', 'I have worth'],
        cascadeEvents: [
          {
            sourceNodeId: 'I am validated',
            affectedNodeId: 'I can be loved',
            resolutionLost: 0.5,
          },
          {
            sourceNodeId: 'I am validated',
            affectedNodeId: 'I have worth',
            resolutionLost: 0.4,
          },
        ],
        totalResolution: 6.5,
        emergentCT: 3.0,
      };

      const entries = engine.describeComparison(distributedStep, hubStep);
      assertCompliant(entries.map((e) => e.text));
    });

    it('passes terminology compliance when hub retains more resolution', () => {
      const engine = new NarrativeEngine();
      // Edge case: hub-dependent retains more (possible with certain configurations)
      const distributedStep: SimulationStep = {
        stepNumber: 2,
        currentLoad: 3.0,
        nodesCompressed: ['I can fail safely', 'Criticism is survivable'],
        cascadeEvents: [
          {
            sourceNodeId: 'I can fail safely',
            affectedNodeId: 'Criticism is survivable',
            resolutionLost: 0.3,
          },
        ],
        totalResolution: 7.0,
        emergentCT: 2.5,
      };
      const hubStep: SimulationStep = {
        stepNumber: 2,
        currentLoad: 3.0,
        nodesCompressed: [],
        cascadeEvents: [],
        totalResolution: 11.0,
        emergentCT: null,
      };

      const entries = engine.describeComparison(distributedStep, hubStep);
      assertCompliant(entries.map((e) => e.text));
    });

    it('passes terminology compliance with CT exceeded but no compression yet', () => {
      const engine = new NarrativeEngine();
      const distributedStep: SimulationStep = {
        stepNumber: 1,
        currentLoad: 3.5,
        nodesCompressed: [],
        cascadeEvents: [],
        totalResolution: 12.0,
        emergentCT: 3.5,
      };
      const hubStep: SimulationStep = {
        stepNumber: 1,
        currentLoad: 3.5,
        nodesCompressed: [],
        cascadeEvents: [],
        totalResolution: 12.0,
        emergentCT: 3.5,
      };

      const entries = engine.describeComparison(distributedStep, hubStep);
      assertCompliant(entries.map((e) => e.text));
    });
  });
});
