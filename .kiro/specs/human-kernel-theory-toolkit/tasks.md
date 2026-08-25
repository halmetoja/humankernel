# Implementation Plan

## Overview

This plan implements the Human Kernel Theory Toolkit v0.1 MVP: a TypeScript web application with a representational network simulation engine (emergent CT, two centrality metrics, cascade propagation), D3 force-directed visualization, side-by-side topology comparison, and a landing page that communicates SRF's core insight in 30 seconds.

Scope: 10 tasks. Future versions (v0.2 Representation Update, v0.3 Development/Process Isolation, v0.4 DSP/Recovery) are documented in the design but not implemented here.

## Tasks

- [ ] 1. Initialize project: create package.json (name: "human-kernel-theory-toolkit", dependencies pinned: vite, typescript, d3 v7, @types/d3, vitest, @vitest/coverage-v8, fast-check), tsconfig.json (strict mode, ES2022, DOM lib), vite.config.ts (GitHub Pages base path), vitest.config.ts, index.html with semantic structure, .gitignore, MIT LICENSE, and README.md documenting v0.1 scope, theory background, and setup instructions
- [ ] 2. Create `src/types.ts` with all core interfaces (RepresentationNode with confidence/source/updateability/descendantCentrality/pathCentrality, DependencyEdge, RepresentationalNetwork with IRC and currentLoad, TopologyType, SimulationStep with emergentCT, CascadeEvent, NetworkMetrics, ComparisonResult) and `src/simulation/node.ts` with createNode() factory (defaults: resolution 1.0, confidence 0.8, isCompressed false, validates resolution [0,1] and threshold >= 0)
- [ ] 3. Create `src/simulation/network.ts` with RepresentationalNetwork class (addNode, addEdge, getNode, getDependents, getAncestors, validateDAG, serialize to JSON, static deserialize) and `src/simulation/centrality.ts` with computeDescendantCentrality(network) returning unique reachable node count per node, and computePathCentrality(network) returning total dependency path count through each node
- [ ] 4. Create `src/simulation/engine.ts` with SimulationEngine class: loadNetwork(), applyLoad(amount), step() implementing emergent CT computation (sum node simultaneity demands, compare to IRC, CT = load where demand first exceeds IRC), structural-consequence ordering (lower descendant centrality compresses first), cascade propagation (resolution < 0.3 triggers dependent instability), getMetrics(), getEmergentCT(), reset(). Engine is fully deterministic.
- [ ] 5. Create `src/simulation/presets.ts` with createDistributedTopology() (12-15 nodes, max descendant centrality 3-4, redundant paths, SRF labels: "I exist as separate", "I have inherent worth", "I can be loved", "I can be criticized", "Others have independent minds", etc.) and createHubDependentTopology() (12-15 nodes, hub descendant centrality 8-12, serial dependencies through "I am validated" hub, same psychological content differently wired)
- [ ] 6. Write property-based tests in `tests/simulation/`: node.test.ts (resolution bounds, threshold validation), network.test.ts (DAG validation, round-trip serialization preserves all properties), centrality.test.ts (leaf nodes have descendant centrality 0, path centrality non-negative, centrality values consistent after serialization round-trip), engine.test.ts (determinism - identical inputs produce identical outputs, monotonicity - resolution never increases under increasing load, cascade direction - only source-to-dependent, ordering - lower centrality compresses first given equal thresholds, emergent CT consistency - below CT no compression occurs)
- [ ] 7. Create `src/visualization/colors.ts` (resolution-to-color gradient: green #4caf50 at 1.0, yellow #ffeb3b at 0.5, red #f44336 at 0.0, WCAG AA compliant) and `src/visualization/network-graph.ts` with NetworkGraphViz class using D3 force-directed layout: nodes sized by descendant centrality (8-24px radius), colored by resolution, edges with opacity by weight, smooth 300ms color transitions on resolution change, cascade pulse animation along edges, click-to-select info panel showing all node properties, keyboard navigation (Tab/Enter)
- [ ] 8. Create `src/visualization/comparison-view.ts` with ComparisonView class: renders two NetworkGraphViz instances side by side in flex container, labels "Distributed" and "Hub-Dependent", shared load slider/button applying identical load to both, synchronized animation, metrics panel below showing comparative results (total resolution retained, cascade depth, compressed nodes per topology)
- [ ] 9. Create `src/demo/narrative.ts` (generates running SRF commentary describing what is happening without prescribing outcomes) and `src/demo/landing.ts` orchestrating the landing page: epistemic header, "Same load. Different topology. Click Apply Load." message, ComparisonView with preset topologies loaded, Apply Load button triggering synchronized load application, narrative region updating during simulation, Reset button, and brief closing explanation. Create `src/utils/terminology.ts` with SRF terminology validation (prohibited terms check) and `src/utils/accessibility.ts` with ARIA helpers.
- [ ] 10. Create responsive CSS (dark theme, WCAG AA contrast, flex/grid layouts 768-1920px, node info panel styling, button/slider styling), wire `src/main.ts` entry point loading the landing page, create `.github/workflows/deploy.yml` (checkout, setup Node, npm ci, npm run test, npm run build, deploy dist/ to GitHub Pages), write `tests/terminology.test.ts` verifying all narrative output passes terminology compliance, run full test suite (vitest --run), fix failures, verify vite build produces functional output

## Task Dependency Graph

```json
{
  "waves": [
    [1],
    [2],
    [3],
    [4, 5],
    [6],
    [7],
    [8],
    [9],
    [10]
  ]
}
```

Key dependencies:
- Wave 1: Project scaffolding
- Wave 2: Types and node factory (foundation for everything)
- Wave 3: Network class and centrality (needed by engine and presets)
- Wave 4: Engine and presets (can be parallel, both depend on network/centrality)
- Wave 5: Property-based tests for all simulation logic
- Wave 6: Visualization primitives (D3 graph renderer)
- Wave 7: Comparison view (depends on graph renderer)
- Wave 8: Landing page, narrative, utilities (depends on comparison view)
- Wave 9: CSS, wiring, deployment, final tests

## Notes

- The simulation engine is a research tool: it computes outcomes, it does not confirm predictions
- CT is emergent (computed), not a user input parameter
- v0.1 assumes DAG. Cycles are not errors; they are a v0.2+ extension for feedback loop modeling
- Two centrality metrics (descendant and path) capture distinct psychological properties
- All user-facing text must comply with SRF terminology rules (Requirement 11)
- Property-based tests use fast-check for generating arbitrary valid network configurations
- Healing/topological change is always presented as OPEN (DIH)
- The simulator must be capable of surprising the researcher

## Future Versions (Documented, Not Implemented)

### v0.2: Representation Update / Digital Twin / Salience and Authority
- predictionError field on RepresentationNode
- updateRepresentation(nodeId, newInfo) engine method
- Updateability-driven revision logic
- **salience** field (0-1): how strongly a representation attracts attention, independent of evidence or truth. High salience does not imply truth.
- **authority/weight** field (0-1): how much a representation controls inference and action, independent of resolution. A low-resolution model can have high authority.
- Self-other epistemic asymmetry: configurable authority weighting between self-model and other-model representations (self-sacrifice pattern = low self-authority; other-sacrifice pattern = low other-authority under load)
- Salience-memory reconstruction feedback loop: biased salience -> biased encoding -> selective remembering -> defensively coherent narrative -> stronger prior -> same salience reinforced
- Self-maintaining feedback loops: rigid prior -> threat-biased salience -> confirmation-biased interpretation -> defensive action -> relational conflict -> confirms prior
- **Five-stage signal processing**: detection -> salience -> meaning assignment -> self-relevance -> epistemic evaluation. Each stage independently modeled. Truth (stage 5) cannot be inferred from importance, meaning, or relevance.
- **selfRelevanceWeight** field (0-1): how strongly a signal is represented as concerning the self. Separate from salience.
- **Prior-driven salience feedback**: priors train attention toward confirmatory coincidences; non-confirming events receive low salience and fade. Salience-mediated selection and confirmation loop.
- Non-specificity: self-relevance weighting not specific to any diagnosis; can occur in ordinary superstition, grief, stress, substance use, and other contexts.

### v0.3: Development / Process Isolation
- Full boot sequence: External Regulation -> Representation Formation -> Self/Other Models -> Differentiation -> Process Isolation -> Simultaneity -> Integration -> Autonomy
- Developmental progression SVG visualization
- DRIH preset with signal-class-specific low thresholds

### v0.4: DSP / Recovery
- relaxLoad(amount) and recover(steps) in engine interface
- Recovery rate as separate parameter from compression rate
- Hysteresis modeling (recovery may not restore original baseline)
- Full DSP timeline with Chart.js
- Externalization latency (REL) visualization
- Runtime modification modeling: external regulators (substances, admiration, control, reassurance) change the interpretive state without changing external reality

### v0.5: Developmental Attractor Competition Model
- Agent-based developmental simulation (child agent + caregiver agent(s) + event generator)
- Temporal episode loop over developmental time with reinforcement learning updates
- Attractor competition: self-compression and other-compression as the two defensive branches (attractors, not types). Integration is the preceding developmental alternative or later exit when enabling conditions change - not a third branch within the bifurcation
- Emergent topology: representational network develops from repeated interactions, not pre-given
- **Blame-responsibility routing network** (formal substrate of the Blame-Responsibility Market): models how guilt, blame, global badness, and responsibility route through a relational network. Properties: available carriers, transfer cost, regulatory yield, power, liquidity, concentration, inflation, conversion.
- **Conditional caregiver switching**: child learns "correct behavior activates good caregiver, wrong behavior activates bad caregiver." Creates illusion of control. Not uniquely narcissistic; may contribute to perfectionism, pleasing, hypervigilance, compulsive responsibility.
- **ACC/UBA/RRC** as operational caregiver parameters: ACC (tolerate protest without collapse/retaliation), UBA (accept global blame to restore calm), RRC (differentiate and redistribute responsibility without humiliation). Healthy profile: ACC high, UBA low, RRC high.
- Self-maintaining feedback loop detection: when does defensive action create the world it defends against?
- Child parameters: affect_reactivity, threat_sensitivity, attachment_dependency, shame_sensitivity, dominance_tendency, inhibitory_control, initial_integration_capacity, recovery_rate, representation_updateability
- Caregiver parameters: attunement, contingent_soothing, affective_containment_ACC, blame_assumption_UBA, responsibility_redistribution_RRC, boundary_consistency, retaliation_probability, withdrawal_probability, repair_reliability
- Anti-circularity: no hard-coded outcomes; attractors must emerge from local learning rules; simulation must produce null results or unexpected outcomes when warranted
- Key question: Do distinct attractors emerge from shared local rules without being explicitly encoded?
- Complements v0.1: v0.1 shows what a GIVEN topology does under load (static); v0.5 shows how topology DEVELOPS through repeated interaction (dynamic)
- Developmental bifurcation modeled as competing attractor states; branches are attractors, not permanent types; same person may use different routes in different power/relational contexts
