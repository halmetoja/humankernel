# Design Document

## Overview

The Human Kernel Theory Toolkit v0.1 is a TypeScript web application built with Vite, using D3.js for interactive network visualization and a custom simulation engine for representational network dynamics. The v0.1 scope delivers: a representational network engine with emergent CT computation, two preset topologies, cascade simulation, D3 force-directed visualization, side-by-side comparison view, and a landing page that communicates the core SRF insight in 30 seconds.

The simulator is a research tool. It computes outcomes from topology and parameters without hardcoding theoretical predictions. CT emerges from the simulation. Comparison results are observations, not confirmations.

## Framework Positioning

The toolkit sits within a three-layer hierarchy:

```text
HUMAN TOPOLOGY ATLAS   (primary frame: a map of the mind's possible organizations)
        |
HUMAN KERNEL           (the protected meta-architecture underlying all topologies)
        |
STRUCTURAL REGULATION FRAMEWORK / SRF  (load, simultaneity, compression, recovery dynamics)
```

The shortest distinction: the Human Kernel asks how the human mind works; the Human Topology Atlas asks how many different ways it can be organized. The core thesis is that people do not react to events but to what an event connects to in their internal meaning network.

### The Structural Lock: Six Canonical Parts (Atlas v1.1)

As of Atlas v1.1, Human Topology is canonically defined by six parts. These six parts are the primary analysis frame, superseding the twenty-dimension list as the top-level organizing principle. The twenty dimensions still exist but are now measured under the six parts.

The canonical formula:

```text
Human Topology =
  representational vocabulary              (what can be represented and distinguished)
+ connection structure                     (how representations link, weight, and activate each other)
+ access permissions                       (who/what can read, write, trigger, update system levels)
+ generative priors                        (what the system predicts or generates when data is incomplete)
+ state transitions                        (how structure changes under load, intimacy, threat, intoxication, recovery)
+ environmental stabilization contract     (what others and the environment must provide for the structure to stay stable)
```

The canonical order is intentional:

```text
What can be represented?
  -> How do representations connect?
  -> What access permissions do they have?
  -> What does the system generate for missing data?
  -> How does structure change under load?
  -> What must the environment do to keep it stable?
```

The six parts are the primary frame. Human Kernel and SRF are the layers beneath, not additional parts. The Human Kernel is NOT a seventh part: it is the protected meta-architecture beneath all six. SRF is NOT a seventh part: it is the load-dynamics layer that sharpens simultaneity, compression, state transitions, and recovery. The six parts are analysis levels, not six independent mind modules. The environmental stabilization contract makes topology genuinely relational and ecological: topology describes not only internal structure but the environmental contract on which the structure's stability depends. Dependence and co-regulation are not themselves pathological; what matters is reciprocity, flexibility, reality cost, and who bears the regulatory load.

#### Where v0.1 Sits Within the Six Parts

The v0.1 engine primarily models the **connection-structure** part: nodes, edges, centrality, and cascade capture how representations link, which nodes are central, and how a local signal spreads through the network. The other five parts map to later versions.

| Canonical part (Structural Lock) | Toolkit version implementing or extending it |
|---|---|
| Connection structure | v0.1 (nodes, edges, centrality, cascade) |
| Representational vocabulary | v0.2 (salience, authority, provenance, resolution as independent node properties) |
| Generative priors | v0.2 (prediction error, salience-driven priors, five-stage signal processing) |
| Access permissions | v0.2 (kernel-lock, provenance) and v0.6 (kernel overload, firewall, update permissions) |
| State transitions | v0.4 (recovery, DSP timeline, hysteresis, runtime modification) |
| Environmental stabilization contract | v0.5 (developmental model of how the contract forms; caregiver ACC/UBA/RRC; blame-responsibility routing) |
| All six parts (full atlas entries) | v0.7+ (AtlasEntry mandatory core is the six canonical parts) |

The v0.2 salience/authority/provenance work extends the representational-vocabulary part (what can be represented and with what weight) together with the generative-priors part (what the system predicts on incomplete evidence). The v0.2 kernel-lock/access work and the v0.6 kernel-overload work extend the access-permissions part. The v0.4 recovery/DSP work extends the state-transitions part. The v0.5 developmental model extends the environmental-stabilization-contract part by showing how that contract forms through repeated interaction. The v0.7+ full atlas entries carry all six parts as the mandatory core.

The Human Kernel is a protected meta-architecture, never personality, self-image, soul, or a brain module. A topology is not a personality type. v0.1's distributed and hub-dependent presets are two atlas entries: two organizational forms among many possible ones. The v0.1 engine shows what a given topology does under load; it does not classify people. Compression remains a consequence of simultaneity failure, not a mechanism.

## Architecture

### Technology Stack

- **Language**: TypeScript (strict mode, ES2022)
- **Build**: Vite 6.x with vanilla TS template
- **Visualization**: D3.js v7 for force-directed network graphs
- **Testing**: Vitest + fast-check for property-based tests
- **Styling**: CSS with custom properties, dark theme
- **Deployment**: GitHub Pages via GitHub Actions

### Project Structure

```
humankernel/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── README.md
├── LICENSE
├── human-kernel-bifurcation-model.md
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── main.ts
│   ├── types.ts
│   ├── simulation/
│   │   ├── node.ts
│   │   ├── network.ts
│   │   ├── centrality.ts
│   │   ├── engine.ts
│   │   └── presets.ts
│   ├── visualization/
│   │   ├── network-graph.ts
│   │   ├── colors.ts
│   │   └── comparison-view.ts
│   ├── demo/
│   │   ├── landing.ts
│   │   └── narrative.ts
│   └── utils/
│       ├── terminology.ts
│       └── accessibility.ts
├── public/
│   └── assets/
│       └── fallback/
├── tests/
│   ├── simulation/
│   │   ├── node.test.ts
│   │   ├── network.test.ts
│   │   ├── centrality.test.ts
│   │   ├── engine.test.ts
│   │   └── presets.test.ts
│   └── terminology.test.ts
└── .kiro/
    └── specs/
        └── human-kernel-theory-toolkit/
            ├── .config.kiro
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## Data Models

### Seven-Variable Representational Framework

SRF v0.3 identifies seven distinct properties of any representation. These must not be collapsed:

1. **Resolution**: how much complexity the representation preserves
2. **Weight/Authority**: how much this representation controls inference and action
3. **Salience**: how strongly this attracts attention and feels significant
4. **Evidence**: how much data supports the interpretation
5. **Confidence**: how certain the system is
6. **Truth**: how accurately the model corresponds to reality
7. **Updateability**: how easily new information revises the representation

The v0.1 simulator implements resolution, confidence, source, updateability, and structural centrality (descendant + path). This is sufficient for topology-dependent vulnerability simulation. Salience and authority/weight are independent variables planned for v0.2, where they enable modeling of self-other epistemic asymmetry and salience-memory reconstruction feedback loops.

SRF v0.4.0 extends the representational framework beyond the original seven variables (resolution, weight/authority, salience, evidence, confidence, truth, updateability) with two further per-representation properties: **kernel-lock** (K_i, the degree to which a representation is treated as invariant rather than user-space updateable) and **provenance** (O_i, the represented source, ownership, agency, and temporal origin of the content). Both are HYPOTHESIS-level and planned for v0.2+, where kernel-lock in particular enables testing the kernel-overload hypothesis in simulation. The kernel itself is a protected meta-layer of invariants, metadata, provenance, access control, epistemic rules, and update permissions, not a personality, self-image, soul, or brain module.

SRF v0.3.3 additionally distinguishes a five-stage signal processing architecture: (1) signal detection, (2) salience, (3) meaning assignment, (4) self-relevance weighting, (5) epistemic evaluation. Truth value depends on stage 5, not on felt importance (stage 2), assigned meaning (stage 3), or personal relevance (stage 4). This layered model is relevant to v0.2+ where salience and self-relevance become independent simulation variables.

### Two Complementary Layers: Node-Level and Network-Level

The framework operates at two complementary layers. The seven/nine-variable representational framework (resolution, authority/weight, salience, evidence, confidence, truth, updateability, plus the v0.2+ additions kernel-lock and provenance) sits at the **node level**, describing properties of a single representation. The twenty topology dimensions from the Human Topology Atlas (self-other differentiation, self/other-weighting, ownership, agency, provenance resolution, representational resolution, holding capacity, IRC, person-function balance, salience calibration, self-relevance weighting, updateability, reality tolerance window, responsibility routing, access control, integration/AND-capacity, state-switching tendency, rigidity/plasticity, recovery profile, ecological fit) sit at the **network/profile level**, describing the organization of the topology as a whole. These are complementary layers, not competing schemes: node properties describe individual representations, while topology dimensions characterize an atlas entry. The network-level profile is planned for v0.7+ (see Atlas Entry Catalog below).

### Core Types (`src/types.ts`)

```typescript
/** A node in the representational network */
export interface RepresentationNode {
  id: string;
  label: string;
  /** Current resolution level: 0 = fully compressed, 1 = full resolution */
  resolution: number;
  /** Certainty of this representation (0-1) */
  confidence: number;
  /** Where regulation originates */
  source: 'internal' | 'external' | 'mixed';
  /** How easily new information revises this representation (0-1) */
  updateability: number;
  /** Number of unique dependent nodes reachable */
  descendantCentrality: number;
  /** Total number of dependency paths through this node */
  pathCentrality: number;
  /** Load level at which this node begins losing resolution */
  activationThreshold: number;
  /** Whether this node is currently in a compressed state */
  isCompressed: boolean;
  /** Semantic category */
  category: 'ontological' | 'identity' | 'relational' | 'functional' | 'peripheral';
  // --- Planned for v0.2 ---
  // salience: number;    // How strongly this attracts attention (0-1), independent of evidence/truth
  // authority: number;   // How much this controls inference and action (0-1), independent of resolution
}

/** A directed dependency edge: target depends on source */
export interface DependencyEdge {
  sourceId: string;
  targetId: string;
  /** Dependency weight: 0-1 indicating strength of dependency */
  weight: number;
}

/** The complete representational network */
export interface RepresentationalNetwork {
  nodes: RepresentationNode[];
  edges: DependencyEdge[];
  /** Network-level IRC (holding threshold): how many contradictory
      representations can coexist simultaneously */
  irc: number;
  /** Current global affective load */
  currentLoad: number;
}

/** Topology preset type */
export type TopologyType = 'distributed' | 'hub-dependent';

/** A single simulation step result */
export interface SimulationStep {
  stepNumber: number;
  currentLoad: number;
  nodesCompressed: string[];
  cascadeEvents: CascadeEvent[];
  totalResolution: number;
  emergentCT: number | null;
}

/** A cascade propagation event */
export interface CascadeEvent {
  sourceNodeId: string;
  affectedNodeId: string;
  resolutionLost: number;
}

/** Aggregate network metrics */
export interface NetworkMetrics {
  totalResolution: number;
  compressedNodeCount: number;
  maxCascadeDepth: number;
  emergentCT: number | null;
}

/** Comparison result between two topologies */
export interface ComparisonResult {
  topology1: {
    type: TopologyType;
    totalResolutionRetained: number;
    maxCascadeDepth: number;
    compressedNodes: string[];
  };
  topology2: {
    type: TopologyType;
    totalResolutionRetained: number;
    maxCascadeDepth: number;
    compressedNodes: string[];
  };
}
```

## Components and Interfaces

| Component | Responsibility | Interface |
|-----------|---------------|-----------|
| SimulationEngine | Run step-based network simulations with emergent CT | `loadNetwork()`, `applyLoad(amount)`, `step()`, `reset()`, `getMetrics()`, `getEmergentCT()` |
| RepresentationalNetwork | Store and query DAG network state | `addNode()`, `addEdge()`, `getNode(id)`, `getDependents(id)`, `getAncestors(id)`, `serialize()` |
| CentralityComputer | Compute both centrality metrics | `computeDescendantCentrality(network)`, `computePathCentrality(network)` |
| NetworkGraphViz | Render interactive D3 force-directed graph | `render(container, network)`, `update(network)`, `onNodeSelect(cb)`, `animateCascade(events)` |
| ComparisonView | Side-by-side dual network display | `render(container)`, `applyLoad(amount)`, `reset()`, `getResults()` |
| LandingDemo | Orchestrate the landing page experience | `init(container)`, `applyLoad()`, `reset()` |
| NarrativeEngine | Generate running SRF commentary | `describe(step): string`, `reset()` |
| TerminologyChecker | Validate text against SRF rules | `validate(text): string[]` |

## Component Design

### Simulation Engine (`src/simulation/engine.ts`)

The engine operates in discrete steps with emergent CT:

1. **Load Application**: Global affective load increases by a configurable increment
2. **Simultaneity Demand Computation**: Each node contributes to the network's simultaneity demand based on `currentLoad - node.activationThreshold` (clamped to >= 0). Total demand is the sum across all nodes.
3. **IRC Comparison**: When total simultaneity demand exceeds the network's IRC, the system begins losing simultaneity. The load level where this first occurs is the emergent CT.
4. **Resolution Reduction**: Nodes under pressure lose resolution. Ordering follows structural consequence: nodes with lower descendant centrality lose resolution first. Among nodes with equal descendant centrality, lower activation threshold means earlier compression.
5. **Cascade Propagation**: When a node drops below critical resolution (0.3), instability propagates to nodes that depend on it. Each dependent node's effective load increases.
6. **Metric Computation**: After each step, compute aggregate metrics including emergent CT.

```typescript
interface ISimulationEngine {
  loadNetwork(network: RepresentationalNetwork): void;
  applyLoad(amount: number): SimulationStep;
  step(): SimulationStep;
  reset(): void;
  getMetrics(): NetworkMetrics;
  getEmergentCT(): number | null;
}
```

Key design principle: CT is NOT a parameter. It is computed. The engine discovers at what load level the network's simultaneity demand first exceeds IRC. This makes CT a prediction of the model, not an assumption fed into it.

### Centrality Computation (`src/simulation/centrality.ts`)

Two distinct centrality metrics:

**Descendant Centrality**: Number of unique nodes reachable from a given node by following dependency edges forward. Computed via BFS/DFS from each node. A leaf node (no dependents) has descendant centrality 0.

**Path Centrality**: Total number of distinct dependency paths that pass through a given node. Computed by counting all source-to-sink paths in the DAG that include the node. This captures how many "routes of influence" a node sits on.

These are psychologically distinct:
- Descendant centrality answers: "How many other representations become unstable if this one is lost?"
- Path centrality answers: "How many dependency chains does this node participate in?"

### Preset Topologies (`src/simulation/presets.ts`)

**Distributed (Resilient)**:
- 12-15 nodes with multiple independent anchors
- Maximum descendant centrality: 3-4
- Redundant paths: most nodes have 2+ parents
- Node labels from SRF: "I exist as separate", "I have inherent worth", "I can be loved", "I can be criticized", "I can fail", "Others have independent minds", "My needs are acceptable", "I can tolerate uncertainty", etc.

**Hub-Dependent (Fragile)**:
- 12-15 nodes with one dominant hub
- Hub descendant centrality: 8-12
- Serial dependencies: most paths go through the hub
- Same node labels as distributed, but wired through a single critical hub

### Network Graph Visualization (`src/visualization/network-graph.ts`)

D3 force-directed layout:
- Node radius proportional to descendant centrality (min 8px, max 24px)
- Node fill color mapped to resolution: green (#4caf50) at 1.0, yellow (#ffeb3b) at 0.5, red (#f44336) at 0.0
- Edge lines with opacity proportional to weight
- Smooth color transitions (300ms) when resolution changes
- Cascade pulse animation along edges during cascade events
- Click-to-select info panel showing node properties
- Keyboard navigation (Tab + Enter)

### Comparison View (`src/visualization/comparison-view.ts`)

- Two NetworkGraphViz instances in flex container
- Labels: "Distributed" (left) and "Hub-Dependent" (right)
- Shared load control applying identical load to both
- Synchronized animation timing
- Metrics panel below with comparative results

### Landing Page (`src/demo/landing.ts`)

1. Epistemic header explaining SRF
2. "Same load. Different topology. Click Apply Load."
3. Two networks side by side (comparison view)
4. Apply Load button triggers synchronized load
5. Running narrative explains what is happening
6. Reset button restores initial state

### Narrative Engine (`src/demo/narrative.ts`)

Descriptive (what is happening), not prescriptive (what should happen). If the simulation produces unexpected results, the narrative describes those too.

### Terminology Compliance (`src/utils/terminology.ts`)

Validates text against SRF rules. Used in tests to verify all user-facing strings.

## Accessibility

- All interactive elements have `role`, `aria-label`, and keyboard handlers
- Node selection via keyboard (Tab + Enter)
- Color never sole means of conveying information
- Resolution state announced via aria-live region
- WCAG AA color contrast

## Deployment

GitHub Actions: on push to `main`, install deps, run tests, build, deploy to GitHub Pages.

## Testing Strategy

- Unit tests: Vitest for node, network, centrality
- Property-based tests: fast-check for simulation invariants
- Terminology tests: automated string compliance
- Integration tests: visualization render verification

## Correctness Properties

### Property 1: Descendant Centrality - Leaf Nodes
Leaf nodes always have descendant centrality 0. Non-leaf nodes >= 1.

### Property 2: Path Centrality Non-Negativity
Path centrality values are non-negative integers for all nodes.

### Property 3: Compression Ordering Follows Structural Consequence
Lower descendant centrality compresses before higher (given equal thresholds).

### Property 4: Cascade Propagation Respects Dependency Direction
Cascade only source-to-dependent, never against direction.

### Property 5: Emergent CT Consistency
Below emergent CT, no compression. At/above, at least one node compressed. Deterministic.

### Property 6: Topology Comparison as Research Question
Simulation reports what happens without asserting predetermined outcome.

### Property 7: Simulation Determinism
Identical inputs produce identical outputs. No randomness.

### Property 8: Round-Trip Network Serialization
`deserialize(serialize(network)) === network` for all valid networks.

### Property 9: Resolution Bounds
Resolution always in [0, 1].

### Property 10: Monotonicity Under Increasing Load
Total resolution never increases under monotonically increasing load.

## Future Design Extensions (Not Implemented in v0.1)

### v0.2: Representation Update / Salience and Authority
- `predictionError` field, `updateRepresentation(nodeId, newInfo)`, updateability-driven revision
- `salience` field (0-1): independent of evidence and truth. High salience does not imply truth.
- `authority` field (0-1): independent of resolution. A low-resolution representation can have high authority.
- `kernelLock` field (0-1): degree to which a representation is treated as kernel-protected (invariant) rather than user-space updateable. High kernel-lock nodes resist update. HYPOTHESIS. Groundwork for the v0.6 kernel-overload demonstration.
- `provenance` field: represented source, ownership, agency, and temporal origin of the content, plus confidence in that origin (O_i). HYPOTHESIS as a kernel function. Identical content can carry different consequences depending on whether it is represented as one's own thought, another person's statement, a memory, an inference, or an external event.
- Self-other epistemic asymmetry: configurable weighting between self-model and other-model authority. Self-sacrifice pattern (low self-authority); other-sacrifice pattern (low other-authority under load).
- Salience-memory reconstruction feedback loop: biased salience -> biased encoding/interpretation -> selective or distorted remembering -> defensively coherent narrative -> stronger prior -> same salience distribution reinforced
- Self-maintaining loop modeling: rigid prior -> threat-biased salience -> ambiguous event interpreted as insult/abandonment/opposition -> defensive action -> relationship conflict -> new data confirms prior
- Five-stage signal processing model: detection -> salience -> meaning assignment -> self-relevance -> epistemic evaluation. Each stage independently variable. Truth (stage 5) cannot be inferred from importance, meaning, or relevance alone.
- `selfRelevanceWeight` field (0-1): how strongly a signal or representation is represented as concerning the self. Separate from salience - a signal can be salient without being self-relevant.
- Prior-driven salience feedback: model how priors (e.g., "the world sends me signs") train attention toward confirmatory coincidences while non-confirming events receive low salience and fade. Implements salience-mediated selection and confirmation loop.
- Non-specificity constraint: self-relevance weighting patterns are not specific to any diagnosis. They can appear in ordinary superstition, grief, stress, sleep deprivation, substance use, and other contexts.

### v0.3: Development / Process Isolation
- Boot sequence modeling, developmental progression visualization, DRIH preset

### v0.4: DSP / Recovery
- `relaxLoad()`, `recover()`, recovery rate, hysteresis, full DSP timeline
- Runtime modification: external regulators (substances, admiration, control, reassurance) change the interpretive state without changing external reality. Same signals, different experienced world.

### v0.5: Developmental Attractor Competition Model

A fundamentally different architecture from v0.1's static network simulation. Where v0.1 answers "What happens to a given topology under load?", v0.5 answers "How does a topology develop through repeated interaction?"

#### Architecture: Agent-Based Developmental Simulation

Unlike v0.1 (single network, step-based load), v0.5 is a multi-agent temporal simulation:

- **Child Agent**: maintains internal representational state, learning history, and configuration values for each regulatory strategy (integration, self-compression, other-compression)
- **Caregiver Agent(s)**: respond to child behavior according to parameter distributions; responses are conditional on child state, relationship history, and caregiver load
- **Event Generator**: samples relational events with variable contradiction severity and ambiguity
- **Representational Network**: topology EMERGES from repeated interactions rather than being pre-given as a preset
- **Blame-Responsibility Routing Network**: models how guilt, blame, global badness, and responsibility route through the relational system. This is the formal substrate of the Blame-Responsibility Market.

#### Blame-Responsibility Routing Network

The Blame-Responsibility Market is formalized as a routing network with the following properties:

- **Available carriers**: who is willing or forced to become the bad node
- **Transfer cost**: what happens when blame moves toward self or other
- **Regulatory yield**: how much immediate distress relief the transfer produces
- **Power**: who can refuse blame and who cannot
- **Liquidity**: how easily badness moves between agents
- **Concentration**: whether one agent becomes the permanent scapegoat
- **Inflation**: whether increasingly large accusations are required for the same regulatory relief
- **Conversion**: whether global blame can become differentiated responsibility and repair

Four canonical market outcomes:
1. Child carries global badness (self-sacrifice can stabilize)
2. Caregiver accepts global badness and restores regulation (other-sacrifice can stabilize)
3. Nobody can carry badness (escalation, chaotic switching)
4. Global badness is replaced by differentiated responsibility (integration becomes learnable)

#### Conditional Caregiver Switching Mechanism

The child may learn a control rule: "correct behavior produces good caregiver; wrong behavior produces bad caregiver." This creates the illusion of control over an otherwise unpredictable attachment system.

Two routes to this inference:
1. **Real conditionality**: warmth/approval actually varies with compliance, performance, or image
2. **Apparent control**: caregiver state driven by hidden variables (stress, shame, fatigue), but child observes only "I acted; caregiver changed"

The dual-world model is preserved because it offers agency. Self-blame is painful but preferable to helplessness: "If I caused the bad caregiver, I may be able to restore the good caregiver by changing myself."

This mechanism is not uniquely narcissistic. It may contribute to perfectionism, pleasing, hypervigilance, anxious attachment, compulsive responsibility, control, or difficulty knowing one's own needs.

#### Self-Maintaining Feedback Loops

The simulation must model self-reinforcing cycles:

```text
rigid prior
  -> threat-biased salience
  -> ambiguous event interpreted as insult/abandonment/opposition
  -> defensive action
  -> relationship conflict
  -> new data appears to confirm the prior
  -> prior strengthens
```

These loops explain why defensive behavior creates the experienced world it protects against. The "hell" is self-maintaining: defensive action produces real relational consequences that appear to validate the original threat model.

#### Core Mechanism: Attractor Competition

When contradiction load exceeds effective simultaneity capacity, the system stabilizes through one of two compression routes:

- **Self-compression route**: "I am bad" preserves caregiver/attachment by compressing self-representation
- **Other-compression route**: "You are bad" preserves self-coherence by compressing other-representation
- **Integration**: the preceding developmental alternative (when sufficient simultaneity capacity exists) or a later exit from the bifurcation - not a third branch within the bifurcation itself

These are NOT pre-assigned types. They are competing attractor states whose basins of attraction depend on:

1. Temperament parameters (child agent configuration)
2. Caregiver response distribution (not single events, but statistical patterns)
3. Reinforcement history (which strategy reduced distress in previous episodes)
4. Structural consequence costs (what else destabilizes if a representation degrades)
5. Blame-responsibility routing payoffs (immediate regulatory yield per route)

#### Child Agent Parameters

| Variable | Meaning | Range |
|---|---|---|
| `affect_reactivity` | Magnitude of activation after contradiction | 0-1 |
| `threat_sensitivity` | Weight placed on danger cues | 0-1 |
| `attachment_dependency` | Cost of caregiver withdrawal | 0-1 |
| `shame_sensitivity` | Cost of negative self-implication | 0-1 |
| `dominance_tendency` | Accessibility of control/approach behavior | 0-1 |
| `inhibitory_control` | Capacity to inhibit immediate action | 0-1 |
| `initial_integration_capacity` | Baseline developmental simultaneity capacity | 0-1 |
| `recovery_rate` | Return toward baseline after arousal | 0-1 |
| `representation_updateability` | Responsiveness of models to new evidence | 0-1 |

#### Caregiver Agent Parameters

| Variable | Meaning | Range |
|---|---|---|
| `attunement` | Accuracy in reading child state | 0-1 |
| `contingent_soothing` | Probability/strength of co-regulation | 0-1 |
| `affective_containment_ACC` | Tolerance of protest without collapse/retaliation | 0-1 |
| `blame_assumption_UBA` | Tendency to accept global/false blame | 0-1 |
| `responsibility_redistribution_RRC` | Differentiated responsibility and repair skill | 0-1 |
| `boundary_consistency` | Maintenance of non-humiliating limits | 0-1 |
| `retaliation_probability` | Counterattack or humiliation after protest | 0-1 |
| `withdrawal_probability` | Attachment withdrawal after conflict | 0-1 |
| `repair_reliability` | Probability of reconnection and repair after rupture | 0-1 |

Healthy caregiver profile: ACC high, UBA low, RRC high. High ACC is not the same as accepting all blame. Low UBA is not defensiveness. High RRC allows responsibility to be accurate without making anyone disappear.

#### Episode Loop

```text
1. Sample relational event (severity, ambiguity)
2. Compute contradiction load and prediction error
3. Compute effective simultaneity margin:
   developmental_capacity + caregiver_scaffolding + learned_regulation
   - arousal_penalty - fatigue_and_context_load
4. Open or close probabilistic integration gate
5. Sample regulatory configuration from available set:
   gate open: {integration, self-compression, other-compression}
   gate closed: {self-compression, other-compression}
6. Generate regulatory behavior from configuration
7. Sample caregiver response conditionally (mediated by ACC/UBA/RRC)
8. Compute outcomes: relief, shame, attachment, prediction accuracy, agency
9. Update blame-responsibility routing weights based on regulatory yield
10. Update configuration values (reinforcement learning)
11. Update representational network topology locally
12. Check for self-maintaining feedback loop formation
13. Advance developmental time, repeat
```

#### Reinforcement Loops to Emerge

Other-sacrifice reinforcement:
```text
child externalizes blame -> caregiver accepts (high UBA) -> distress falls -> externalization strengthens
```

Self-sacrifice reinforcement:
```text
child protests -> caregiver retaliates/withdraws (low ACC) -> externalization dangerous -> child self-blames -> connection returns -> self-sacrifice strengthens
```

Integration reinforcement:
```text
rupture -> affect contained (high ACC) -> responsibility distributed (high RRC) -> neither globalized -> repair -> integration strengthens
```

#### Anti-Circularity Requirements

The simulation MUST NOT:

- Hard-code which strategy "wins" for any parameter combination
- Assign routes from diagnostic labels
- Make self-compression or other-compression inevitable by definition
- Encode specific topology outcomes as targets
- Count programmed route names as emergent evidence

The simulation MUST:

- Be capable of producing null results (no stable attractors emerge)
- Be capable of producing unexpected outcomes (outcomes not predicted by the theory)
- Generate topology from local learning rules only
- Distinguish structural rewriting from compensatory overlay learning
- Allow DIH alternatives to compete (rewriting vs. overlay vs. partial irreversibility)
- Model the guilt/blame market as an emergent routing pattern, not a pre-assigned structure

#### Key Research Question

> Do distinct self-compression and other-compression attractors emerge from shared local rules under different parameter and response distributions, without being explicitly encoded?

#### Output Metrics

- Strategy frequency and persistence per episode window
- Integration rate over developmental time
- Representational resolution trajectory
- Topology centrality and fragility (emergent)
- Hub formation (emergent vs. designed in v0.1)
- Attractor basin estimation
- Hysteresis measurement (intervention dose to leave attractor)
- Between-run variability under identical parameters
- Blame-routing concentration (does one agent become permanent scapegoat?)
- Feedback loop strength (self-maintaining cycle stability)
- Conditional switching rigidity (how fixed is the control-illusion rule?)

#### Relationship to v0.1

| Dimension | v0.1 (Static) | v0.5 (Developmental) |
|---|---|---|
| Input | Pre-given topology | Initial parameters only |
| Question | What does this topology do under pressure? | Why does this person have this topology? |
| Architecture | Single network + load steps | Multi-agent + episodes over time |
| Topology | Fixed (preset) | Emergent from interaction |
| Time | Steps within one load event | Developmental episodes |
| CT | Emergent from topology | Emergent from developmental history |
| Blame routing | Not modeled | Emergent from reinforcement |
| Feedback loops | Not modeled | Self-maintaining cycles can form |

Together they answer complementary questions: v0.5 explains how a topology forms; v0.1 shows what that topology does under acute pressure

### v0.6: Kernel Overload and Reality Tolerance

A demonstration built on the v0.2 `kernelLock` and `provenance` node fields. Where v0.1 shows how topology determines vulnerability, v0.6 shows how the kernel/user-space boundary determines vulnerability, holding topology fixed.

#### Node extension

Each node carries `kernelLock` (0-1):
- 0 means fully user-space updateable content (beliefs, roles, status, relationships)
- 1 means content treated as a kernel-level invariant (continuity, "I exist")

Kernel overload is modeled by raising `kernelLock` on contingent content that would ordinarily live in user space. Examples the demonstration can preset: an other-sacrifice profile that locks "I must remain blameless" or "I must remain superior"; a self-sacrifice profile that locks "if another is upset, I am responsible". These are HYPOTHESIS-level configurations, not diagnoses.

#### Engine behavior

The engine treats high-kernel-lock nodes as resisting resolution loss under moderate load. When load finally forces compression on a high-kernel-lock node, the defensive pressure it releases is larger, producing a wider cascade. Provisional model:

```text
defensePressure(node) = kernelLock(node) * structuralConsequence(node)
```

- Below the node's effective threshold: high kernel-lock nodes lose resolution more slowly than equivalent user-space nodes.
- At and above the threshold: the accumulated defensive pressure produces a larger cascade than a user-space node of the same structural consequence would.

Compression here remains a consequence of simultaneity failure, not a mechanism. Kernel-lock changes when and how forcefully that consequence appears; it does not make compression a primitive operation.

#### Reality Tolerance Window as an emergent metric

`getRealityToleranceWindow()` reports how much contradictory or self-implicating load the network admits before global world switching or defensive reconstruction begins. RTW is emergent, not an input. The demonstration shows that raising kernel-lock on central nodes narrows the observed RTW, providing a simulation-level test of the narrow-RTW hypothesis for narcissistic and self-sacrifice organizations.

Candidate operational dimensions to expose: contradiction breadth admitted, maximum tolerable self-implication, update locality, evidence-admission threshold, time to defensive closure, world-switch threshold, and recovery after disconfirmation.

#### Research framing and anti-circularity

- The kernel-overload hypothesis ("the healthier the system, the smaller the kernel") is under test, where "smaller" means less contingent content is locked as invariant, not a weaker self.
- The simulator must remain capable of showing that kernel-lock produces no meaningful difference for a given topology (a possible null result).
- No node's route or outcome is assigned from a diagnostic label. Kernel-lock is a configurable variable whose consequences are computed.

### v0.7+: Atlas Entry Catalog and Topological Empathy

Where v0.1 provides two atlas entries (distributed and hub-dependent) as raw topologies primarily exercising the connection-structure part, v0.7+ expands them into a full catalog of atlas entries, each carrying descriptive metadata whose mandatory core is the six canonical parts of the Structural Lock alongside its representational network. This connects to the v0.5 developmental model rather than the v0.1 static engine: where v0.5 has multiple agents interacting, v0.7 explores one agent modeling another agent's topology.

#### Atlas-entry data model

An atlas entry pairs a generated representational network with descriptive metadata. As of Atlas v1.1, the mandatory core of the entry format is the six canonical parts of the Structural Lock. The twenty topology dimensions are measured under these six parts (attached via `topologyDimensions` as a complementary detail record). The strengths, blind spots, ecological niche, recovery, compatibility/conflict, projection errors, testable predictions, and ethical cautions are complementary sections.

```typescript
export type EpistemicStatus = 'ESTABLISHED' | 'BRIDGE' | 'HYPOTHESIS' | 'METAPHOR' | 'OPEN';

/** The six canonical parts of the Structural Lock (Atlas v1.1).
    Each part may be a descriptive string or a structured sub-object. */

export interface RepresentationalVocabulary {
  /** Available representation types, distinctions, combination rules. What can
      be represented vs not, what is distinguished vs compressed into one
      category, whether uncertainty/ambivalence/chance/other-autonomy has a
      representation, resolution and simultaneity, under-modeling blind spots
      and over-modeling synthetic representations. */
  description: string;
  availableTypes?: string[];
  hasUncertaintyRepresentation?: boolean;
  hasOtherAutonomyRepresentation?: boolean;
  underModelingBlindSpots?: string[];
  overModelingSyntheticRepresentations?: string[];
}

export interface ConnectionStructure {
  /** How representations link and with what weight. Meaning networks, hubs,
      dependencies, attractors, responsibility routes, how a local signal can
      spread to identity/world-model level. Keystone/hub representations,
      self/other weighting, person-function balance, salience, self-relevance,
      attractors. This is the part the v0.1 engine primarily models. */
  description: string;
  keystoneRepresentations?: string[];
  selfOtherWeighting?: number;
  personFunctionBalance?: number;
  attractors?: string[];
}

export interface AccessPermissions {
  /** Which representations and external actors may read, write, update, or
      bypass deep system levels. Kernel adjacency, process isolation, firewall,
      update permissions, when user-space content got kernel privileges without
      justification. */
  description: string;
  kernelAdjacentNodes?: string[];
  firewallIntegrity?: number;
  unjustifiedKernelPrivileges?: string[];
}

export interface GenerativePriors {
  /** What causes, agents, purposes, futures, and missing representations the
      system produces on incomplete evidence. Prediction before observation,
      how fast gaps are filled, topology-congruent explanations under kernel
      threat, whether ignorance can be held as a representation, how easily a
      hypothesis reifies into perceived fact, updateability. */
  description: string;
  gapFillingSpeed?: number;
  canHoldIgnorance?: boolean;
  reificationTendency?: number;
  updateability?: number;
}

export interface StateTransitions {
  /** How structure switches under load, intimacy, threat, intoxication, loss,
      recovery. Baseline vs load states, when load exceeds simultaneity or
      Reality Tolerance Window, local update vs whole-world switch, what gets
      compressed/isolated/externalized/sacrificed, which attractor a
      bifurcation leads to, recovery speed/cost/target state. */
  description: string;
  baselineState?: string;
  loadStates?: string[];
  worldSwitchThreshold?: number;
  recoverySpeed?: number;
  recoveryCost?: number;
}

export interface EnvironmentalStabilizationContract {
  /** The often-implicit structure by which others and the environment must
      produce certain signals, roles, or accommodation for the Kernel to stay
      stable. What is sought, signal frequency/intensity, provider specificity,
      what happens if the other refuses/leaves/sees differently, co-regulation
      vs outsourced kernel function, who bears the regulatory/relational/reality
      cost. Makes topology genuinely relational and ecological. Dependence and
      co-regulation are not themselves pathological; what matters is
      reciprocity, flexibility, reality cost, and who bears the regulatory load. */
  description: string;
  whatIsSought?: string[];
  signalFrequency?: number;
  providerSpecificity?: number;
  consequencesIfRefused?: string;
  regulatoryCostBearer?: string;
}

export interface AtlasEntry {
  id: string;
  workingName: string;
  epistemicStatus: EpistemicStatus;   // never ESTABLISHED for Atlas-specific entries
  level: 'trait profile' | 'state topology' | 'developmental hypothesis' | 'relational dynamic';
  doesNotMean: string[];              // diagnoses and generalizations to avoid

  // --- Mandatory core: the six canonical parts (Structural Lock, Atlas v1.1) ---
  representationalVocabulary: RepresentationalVocabulary;
  connectionStructure: ConnectionStructure;
  accessPermissions: AccessPermissions;
  generativePriors: GenerativePriors;
  stateTransitions: StateTransitions;
  environmentalStabilizationContract: EnvironmentalStabilizationContract;

  // --- Twenty dimensions, measured under the six parts (complementary detail) ---
  topologyDimensions: TopologyDimensionProfile;

  // --- Complementary sections ---
  strengths: string[];
  blindSpots: string[];
  ecologicalNiche: string;
  recovery: string;
  compatibilityConflict: string;     // which topologies complement, which form exploitation/fusion/guilt routes
  projectionErrors: string[];        // the universal assumptions this topology projects onto others
  testablePredictions: string[];
  ethicalCautions: string[];
}
```

The `internalLogic`, `kernelProfile`, and `stressRegression` fields from earlier drafts are now absorbed into the six canonical parts: internal logic and kernel profile map onto access permissions and generative priors, and stress regression maps onto state transitions.

#### Topology dimension profile

The twenty topology dimensions are measured under the six canonical parts and attached at the network/profile level as a record of continuous (0-1) or categorical values. They are a complementary detail record, not the top-level structure (the six canonical parts are the mandatory core):

```typescript
export interface TopologyDimensionProfile {
  selfOtherDifferentiation: number;
  selfWeighting: number;
  otherWeighting: number;
  ownership: number;
  agency: number;
  provenanceResolution: number;
  representationalResolution: number;
  holdingCapacity: number;
  irc: number;
  personFunctionBalance: number;      // person-representation vs function-representation
  salienceCalibration: number;
  selfRelevanceWeighting: number;
  updateability: number;
  realityToleranceWindow: number;
  responsibilityRouting: number;      // absorb <-> externalize
  accessControl: number;
  integrationAndCapacity: number;
  stateSwitchingTendency: number;
  rigidityPlasticity: number;
  recoveryProfile: number;
  ecologicalFit: string;              // environment where benefits exceed costs
}
```

This profile is network-level and complementary to the node-level seven/nine-variable framework described in Data Models. The twenty dimensions distribute across the six canonical parts: for example, representational resolution and provenance resolution sit under representational vocabulary; self/other-weighting, person-function balance, salience calibration, self-relevance weighting, and responsibility routing sit under connection structure; access control sits under access permissions; updateability sits under generative priors; state-switching tendency, rigidity/plasticity, recovery profile, reality tolerance window, holding capacity, and IRC sit under state transitions; and ecological fit sits under the environmental stabilization contract.

#### Cross-Topology Blind-Spot Matrix component

A grid where selecting a perceiving-topology row and a target-topology column shows the typical projection error in that direction, sourced from an editable matrix data structure. The matrix is bidirectional: it forces the two-directional question of what A cannot easily see about B and what B cannot easily see about A. It does not resolve who is right. Compatibility between two topologies does not imply health; two topologies may fit because they reinforce each other's defenses or form a stable guilt-routing loop.

#### Preset atlas entries

Five preset entries drawn from the master context blind-spot matrix: self-sacrifice, other-sacrifice, high-autonomy, fusion-seeking, threat-vigilant. Each generates a representational network AND carries the descriptive entry metadata whose mandatory core is the six canonical parts. Each is a HYPOTHESIS/BRIDGE profile, not a diagnosis. Self-sacrifice is not a synonym for goodness or empathy; other-sacrifice is not a synonym for narcissism.

#### Topological empathy and anti-circularity

Where v0.5 has multiple agents interacting, v0.7 explores one agent modeling another agent's topology.

- **Topological Empathy** (canonical term; **Structural Empathy** for readers): an agent constructs an inferred model of another agent's meaning network without assuming it matches its own. HYPOTHESIS.
- **Anti-circularity requirement**: a sophisticated inferred model is not evidence of accurate understanding. The inferred topology must be constrained by observed responses from the other agent, not by narrative complexity. A prediction-gain metric (does the inferred model predict the other agent's state transitions better than projecting one's own topology?) guards against mistaking explanation for accuracy.
- **Topological Projection Fallacy**: modeling the other by running their situation through one's own topology. The Empathic Projection Fallacy ("because I would update and repair, the other will too if I understand enough") is a subtype. The Topological Universality Illusion treats one's own motive architecture as the human default.
- **Epistemic firewall and kernel firewall** as agent-level checks: the epistemic firewall separates felt salience and meaning from evidential warrant; the kernel firewall permits proportionate local update while preventing unauthorized global overwrite. Neither is defensiveness.
- **Topological Freedom** as the philosophical horizon (EXTENSION): experiencing one's own and others' internal structures as models rather than reality itself. Not a clinical endpoint or validated construct.

#### Anti-circularity note for atlas entries

Atlas entries are described organizational forms with strengths, blind spots, ecological niche, and stress regression, never fixed personality types. The toolkit never tells a user "you are X." Describing a topology is not endorsing it. Understanding another topology does not equal approval, prediction, change, or responsibility absorption. All Atlas-specific constructs are HYPOTHESIS, BRIDGE, METAPHOR, or OPEN, never ESTABLISHED. Topological change and healing remain OPEN (DIH).

All v0.7+ constructs are HYPOTHESIS or EXTENSION level. Topological change and recovery remain OPEN (DIH).
