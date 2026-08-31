# Implementation Plan

## Overview

This plan implements the v0.1 MVP of a toolkit framed within the Human Topology Atlas (the primary frame: a map of the mind's possible organizations), which sits above the Human Kernel (the protected meta-architecture underlying all topologies) and SRF (load, simultaneity, compression, recovery dynamics). As of Atlas v1.1 ("Structural Lock"), Human Topology is canonically defined by six parts that form the primary analysis frame: representational vocabulary, connection structure, access permissions, generative priors, state transitions, and environmental stabilization contract. The twenty topology dimensions are now measured under these six parts. The v0.1 MVP primarily exercises the connection-structure part: a representational network simulation engine (emergent CT, two centrality metrics, cascade propagation), D3 force-directed visualization, side-by-side topology comparison, and a landing page that communicates the core insight in 30 seconds. The two presets (distributed and hub-dependent) are two atlas entries: two organizational forms among many possible ones. The other five canonical parts map to later versions (see the roadmap and design).

Scope: 10 tasks. Future versions (v0.2 Representation Update / Salience and Authority, v0.3 Development/Process Isolation, v0.4 DSP/Recovery, v0.5 Developmental Attractor Competition, v0.6 Kernel Overload and Reality Tolerance, v0.7+ Atlas Entry Catalog and Topological Empathy) are documented below and in the design but not implemented here.

## Tasks

- [ ] 1. Initialize project: create package.json (name: "human-kernel-theory-toolkit", dependencies pinned: vite, typescript, d3 v7, @types/d3, vitest, @vitest/coverage-v8, fast-check), tsconfig.json (strict mode, ES2022, DOM lib), vite.config.ts (GitHub Pages base path), vitest.config.ts, index.html with semantic structure, .gitignore, MIT LICENSE, and README.md documenting v0.1 scope, theory background, and setup instructions
- [ ] 2. Create `src/types.ts` with all core interfaces (RepresentationNode with confidence/source/updateability/descendantCentrality/pathCentrality, DependencyEdge, RepresentationalNetwork with IRC and currentLoad, TopologyType, SimulationStep with emergentCT, CascadeEvent, NetworkMetrics, ComparisonResult) and `src/simulation/node.ts` with createNode() factory (defaults: resolution 1.0, confidence 0.8, isCompressed false, validates resolution [0,1] and threshold >= 0)
- [ ] 3. Create `src/simulation/network.ts` with RepresentationalNetwork class (addNode, addEdge, getNode, getDependents, getAncestors, validateDAG, serialize to JSON, static deserialize) and `src/simulation/centrality.ts` with computeDescendantCentrality(network) returning unique reachable node count per node, and computePathCentrality(network) returning total dependency path count through each node
- [x] 4. Create `src/simulation/engine.ts` with SimulationEngine class: loadNetwork(), applyLoad(amount), step() implementing emergent CT computation (sum node simultaneity demands, compare to IRC, CT = load where demand first exceeds IRC), structural-consequence ordering (lower descendant centrality compresses first), cascade propagation (resolution < 0.3 triggers dependent instability), getMetrics(), getEmergentCT(), reset(). Engine is fully deterministic.
- [x] 5. Create `src/simulation/presets.ts` with createDistributedTopology() (12-15 nodes, max descendant centrality 3-4, redundant paths, SRF labels: "I exist as separate", "I have inherent worth", "I can be loved", "I can be criticized", "Others have independent minds", etc.) and createHubDependentTopology() (12-15 nodes, hub descendant centrality 8-12, serial dependencies through "I am validated" hub, same psychological content differently wired)
- [x] 6. Write property-based tests in `tests/simulation/`: node.test.ts (resolution bounds, threshold validation), network.test.ts (DAG validation, round-trip serialization preserves all properties), centrality.test.ts (leaf nodes have descendant centrality 0, path centrality non-negative, centrality values consistent after serialization round-trip), engine.test.ts (determinism - identical inputs produce identical outputs, monotonicity - resolution never increases under increasing load, cascade direction - only source-to-dependent, ordering - lower centrality compresses first given equal thresholds, emergent CT consistency - below CT no compression occurs)
- [x] 7. Create `src/visualization/colors.ts` (resolution-to-color gradient: green #4caf50 at 1.0, yellow #ffeb3b at 0.5, red #f44336 at 0.0, WCAG AA compliant) and `src/visualization/network-graph.ts` with NetworkGraphViz class using D3 force-directed layout: nodes sized by descendant centrality (8-24px radius), colored by resolution, edges with opacity by weight, smooth 300ms color transitions on resolution change, cascade pulse animation along edges, click-to-select info panel showing all node properties, keyboard navigation (Tab/Enter)
- [x] 8. Create `src/visualization/comparison-view.ts` with ComparisonView class: renders two NetworkGraphViz instances side by side in flex container, labels "Distributed" and "Hub-Dependent", shared load slider/button applying identical load to both, synchronized animation, metrics panel below showing comparative results (total resolution retained, cascade depth, compressed nodes per topology)
- [x] 9. Create `src/demo/narrative.ts` (generates running SRF commentary describing what is happening without prescribing outcomes) and `src/demo/landing.ts` orchestrating the landing page: epistemic header, "Same load. Different topology. Click Apply Load." message, ComparisonView with preset topologies loaded, Apply Load button triggering synchronized load application, narrative region updating during simulation, Reset button, and brief closing explanation. Create `src/utils/terminology.ts` with SRF terminology validation (prohibited terms check) and `src/utils/accessibility.ts` with ARIA helpers.
- [x] 10. Create responsive CSS (dark theme, WCAG AA contrast, flex/grid layouts 768-1920px, node info panel styling, button/slider styling), wire `src/main.ts` entry point loading the landing page, create `.github/workflows/deploy.yml` (checkout, setup Node, npm ci, npm run test, npm run build, deploy dist/ to GitHub Pages), write `tests/terminology.test.ts` verifying all narrative output passes terminology compliance, run full test suite (vitest --run), fix failures, verify vite build produces functional output

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
- **kernelLock** field (0-1): degree to which a representation is treated as kernel-protected (invariant) rather than user-space updateable. High kernel-lock nodes resist update. Groundwork for the v0.6 kernel-overload demonstration. HYPOTHESIS.
- **provenance** field: represented source, ownership, agency, and temporal origin of the content, plus confidence in that origin. HYPOTHESIS as a kernel function.
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

### v0.6: Kernel Overload and Reality Tolerance
- Builds on the v0.2 kernelLock and provenance node fields
- **Kernel-lock demonstration**: users mark selected nodes as kernel-protected (kernelLock toward 1) and observe how collapse behavior changes under identical load, holding topology fixed
- Engine treats high-kernel-lock nodes as resisting resolution loss under moderate load, then producing a larger cascade when finally compressed. Defense pressure proportional to kernelLock multiplied by structural consequence.
- Preset kernel-overload configurations: other-sacrifice profile locking "I must remain blameless/superior"; self-sacrifice profile locking "if another is upset, I am responsible". HYPOTHESIS-level, not diagnoses.
- **Reality Tolerance Window** exposed as an emergent network metric (getRealityToleranceWindow): how much contradictory or self-implicating load the network admits before global world switching or defensive reconstruction. Demonstrates that raising kernel-lock on central nodes narrows the observed RTW.
- Tests the **kernel-overload hypothesis**: pathology arises partly when contingent user-space content is granted invariant status. "The healthier the system, the smaller the kernel" is a HYPOTHESIS under test; "smaller" means less contingent content is locked as invariant, not a weaker self.
- Anti-circularity: the simulator must remain capable of showing kernel-lock makes no meaningful difference for a given topology (possible null result). No route or outcome assigned from diagnostic labels.
- Terminology: kernel is a protected meta-layer, never personality/self-image/soul/brain module. Compression remains a consequence, not a mechanism. Topological change remains OPEN (DIH).

### v0.7+: Atlas Entry Catalog and Topological Empathy
- Expand the two v0.1 preset topologies into a catalog of atlas entries. As of Atlas v1.1, the entry format's mandatory core is the six canonical parts of the Structural Lock (representational vocabulary, connection structure, access permissions, generative priors, state transitions, environmental stabilization contract), with strengths, blind spots, ecological niche, recovery, compatibility/conflict, projection errors, testable predictions, and ethical cautions as complementary sections. v0.1's presets primarily exercise the connection-structure part; the other five parts are v0.7+ extensions.
- **AtlasEntry data model**: TypeScript interface pairing a generated representational network with descriptive entry metadata. The mandatory core fields are the six canonical parts (representationalVocabulary, connectionStructure, accessPermissions, generativePriors, stateTransitions, environmentalStabilizationContract), each a structured sub-object or descriptive string. Plus id, workingName, epistemicStatus, level, doesNotMean, topologyDimensions (the twenty dimensions measured under the six parts), strengths, blindSpots, ecologicalNiche, recovery, compatibilityConflict, projectionErrors, testablePredictions, ethicalCautions. The former internalLogic, kernelProfile, and stressRegression fields are absorbed into the six canonical parts (access permissions, generative priors, and state transitions respectively).
- **Five preset atlas entries** from the master context blind-spot matrix: self-sacrifice, other-sacrifice, high-autonomy, fusion-seeking, threat-vigilant. Each generates a network AND carries descriptive metadata. HYPOTHESIS/BRIDGE profiles, not diagnoses. Self-sacrifice is not a synonym for goodness/empathy; other-sacrifice is not a synonym for narcissism.
- **Cross-Topology Blind-Spot Matrix**: interactive grid; select a perceiving topology and a target topology to see the typical projection error in each direction. Bidirectional (what A cannot see about B, and what B cannot see about A). Does not resolve who is right; compatibility does not imply health.
- **Twenty topology dimensions** as network-level profile axes (TopologyDimensionProfile): self-other differentiation, self/other-weighting, ownership, agency, provenance resolution, representational resolution, holding capacity, IRC, person-function balance, salience calibration, self-relevance weighting, updateability, reality tolerance window, responsibility routing, access control, integration/AND-capacity, state-switching tendency, rigidity/plasticity, recovery profile, ecological fit. Complementary to the node-level seven/nine-variable framework.
- **Topological Empathy** (canonical term; **Structural Empathy** for readers): infer another agent's meaning network without assuming it matches one's own. HYPOTHESIS. Distinct from cognitive empathy, perspective-taking, and mentalization.
- Anti-circularity: a sophisticated inferred model is not accurate understanding. Inferred topology must be constrained by observed responses, not narrative complexity. Prediction-gain metric guards against mistaking explanation for accuracy.
- **Topological Projection Fallacy** (running the other through one's own topology), Empathic Projection Fallacy subtype, and Topological Universality Illusion
- **Epistemic firewall** (separate felt salience/meaning from evidential warrant) and **kernel firewall** (proportionate local update without global overwrite) as agent-level checks; neither is defensiveness
- **Topological Freedom** (EXTENSION): experiencing internal structures as models rather than reality itself. Philosophical horizon, not a clinical endpoint.
- The toolkit never tells a user "you are X." Atlas entries are described organizational forms, never fixed personality types. Describing a topology is not endorsing it. All constructs at this level are HYPOTHESIS, BRIDGE, METAPHOR, or OPEN. Topological change and healing remain OPEN (DIH).
