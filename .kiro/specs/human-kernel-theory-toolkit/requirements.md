# Requirements Document

## Introduction

A GitHub-publishable interactive toolkit for exploring the Human Kernel / Structural Regulation Framework (SRF) theory of psychological autonomy. The v0.1 release provides a focused MVP: a representational network simulator with two topology presets, emergent Compression Threshold computation, cascade visualization, and a landing page that communicates the core theoretical insight in 30 seconds.

The toolkit is a research tool, not a demonstration tool. Simulation outcomes are not predetermined. The engine computes what happens given topology and parameters. Theoretical predictions (e.g., "distributed topology retains more resolution") are research hypotheses to be tested by the simulator, not assertions built into it.

The SRF theory identifies seven distinct representational properties that must not be collapsed: resolution, weight/authority, salience, evidence, confidence, truth, and updateability. High salience does not imply truth; a low-resolution representation can have high authority; a person's self-model may be richly described yet automatically lose epistemic weight when another person disagrees. The v0.1 simulator models resolution, confidence, source, and updateability. Salience and authority/weight are planned for v0.2 as independent variables that enable modeling self-other epistemic asymmetry and salience-memory feedback loops.

## Glossary

- **Toolkit**: The web application comprising network visualization, simulation engine, and landing page
- **Visualization_Engine**: The component responsible for rendering network graphs with resolution coloring and cascade animations
- **Simulation_Engine**: The component responsible for running representational network simulations under load, computing emergent CT, and propagating cascades
- **Network_Model**: The interactive landing page demonstration showing topology-dependent vulnerability
- **Representational_Network**: A directed acyclic graph (v0.1) where nodes are regulatory representations and edges are structural dependencies
- **RepresentationNode**: A single regulatory representation with resolution, confidence, source, updateability, centrality metrics, and category (v0.1); salience and authority planned for v0.2
- **DependencyEdge**: A directed edge indicating that the target node's stability depends on the source node
- **Affective_Load**: A scalar value representing the current level of psychological activation pressure on the network
- **Simultaneity**: The capacity to keep differentiated but potentially conflicting representations active at the same time
- **Compression**: The observable consequence of simultaneity loss, in which distinctions, alternatives, temporal depth, or independent subjectivity are lost
- **IRC**: Internal Regulation Capacity - the network's holding threshold for how many contradictory representations can coexist simultaneously
- **CT**: Compression Threshold - the emergent activation level where simultaneity begins to fail, computed (not user-input) from network load exceeding IRC capacity
- **CC**: Compression Curve - the shape describing how rapidly representations collapse after CT is exceeded
- **Descendant_Centrality**: The number of unique dependent nodes reachable from a given node through dependency edges
- **Path_Centrality**: The total number or weight of dependency paths that pass through a given node
- **Distributed_Topology**: A network where no single node's loss threatens the coherence of the whole system (resilient architecture)
- **Hub_Dependent_Topology**: A network where one or few nodes carry extreme structural centrality, making the system fragile to their loss
- **Structural_Consequence**: The predicted cascade produced by losing a representation - how many other representations become unstable
- **Keystone_Representation**: A node whose loss or reversal produces disproportionate network disruption
- **DSP**: Dynamic Stability Profile - the full regulatory trajectory including baseline, activation, compression, peak, recovery, and new baseline
- **DRIH**: Developmental Resolution Injury Hypothesis - adverse developmental conditions leaving representational domains unable to sustain differentiated processing under load
- **DIH**: Developmental Irreversibility Hypothesis - the open question of whether some structures can only form during developmental windows
- **Salience**: How strongly a signal or representation attracts attention and feels significant. Distinct from evidence, truth, and resolution. High salience does not imply truth.
- **Authority_Weight**: How much a representation controls inference and action. A low-resolution representation can carry high authority; a richly detailed model can carry low epistemic weight.
- **Epistemic_Authority**: The degree to which a person's own model vs. another person's model determines inference and action. Self-sacrifice patterns show low self-authority; other-sacrifice patterns show low other-authority under load.
- **Blame_Responsibility_Routing_Network**: The formal construct beneath the Blame-Responsibility Market metaphor. Models how guilt, blame, global badness, and responsibility are allocated across agents in a relational network.
- **Blame_Responsibility_Market**: The project's compact metaphor for a relational network in which contradiction, badness, blame, guilt, and responsibility are repeatedly allocated. Formal substrate is the Blame-Responsibility Routing Network.
- **ACC**: Affective Containment Capacity - caregiver's capacity to tolerate the child's anger, accusation, or distress without retaliating, collapsing, abandoning the relationship, or forcing immediate relief
- **UBA**: Undifferentiated Blame Assumption - caregiver's tendency to accept global or inaccurate blame and surrender boundaries to restore calm
- **RRC**: Responsibility Redistribution Capacity - caregiver's capacity to acknowledge their real share, reject false global badness, return the child's share without humiliation, and support repair
- **Conditional_Caregiver_Switching**: The developmental hypothesis that a child may learn "right behavior produces the good caregiver; wrong behavior produces the bad caregiver," creating an illusion of control over attachment security
- **Runtime_Modification**: The principle that external regulators (substances, admiration, control, reassurance) can change the interpretive state in which reality is weighted without changing external reality itself
- **Meaning_Assignment**: The interpretive stage where a detected signal is given semantic content - what the event is interpreted as meaning. Distinct from salience (how strongly it attracts attention) and self-relevance (whether it concerns me).
- **Self_Relevance_Weighting**: The degree to which a meaning-assigned signal is represented as concerning the self, the self's relationships, or the self's life. High self-relevance does not imply truth or evidence. In some vulnerable states, self-relevant threat/admiration/rejection signals may receive disproportionate self-relevance weighting.
- **Five_Stage_Signal_Processing**: The canonical SRF distinction between (1) signal detection, (2) salience, (3) meaning assignment, (4) self-relevance, and (5) epistemic evaluation. Truth value depends on stage 5, not on stages 2-4. Felt importance and personal relevance do not produce truth.

## Requirements

### Requirement 1: Project Structure and Build System

**User Story:** As a developer, I want a well-structured TypeScript project with modern tooling, so that I can build, test, and deploy the v0.1 toolkit to GitHub Pages.

#### Acceptance Criteria

1. THE Toolkit SHALL use TypeScript in strict mode as the primary language with Vite as the build tool
2. THE Toolkit SHALL include a README.md explaining the project purpose, theory background, setup instructions, and v0.1 scope
3. THE Toolkit SHALL be deployable as a static site to GitHub Pages via GitHub Actions
4. THE Toolkit SHALL include a LICENSE file with a permissive open-source license
5. THE Toolkit SHALL include a package.json with all dependencies pinned to exact versions
6. THE Toolkit SHALL use Vitest for testing and fast-check for property-based tests

### Requirement 2: Representation Node Model

**User Story:** As a researcher, I want a rich node model capturing the regulatory properties of each representation, so that the simulation can compute meaningful dynamics.

Note: SRF identifies seven distinct representational properties (resolution, weight/authority, salience, evidence, confidence, truth, updateability). The v0.1 node model implements the subset required for topology-dependent vulnerability simulation: resolution, confidence, source, and updateability. Salience and authority are planned as independent variables for v0.2, enabling self-other epistemic asymmetry modeling.

#### Acceptance Criteria

1. THE Simulation_Engine SHALL model each RepresentationNode with the following properties: id, label, resolution (0-1), confidence (certainty of this representation), source (internal, external, or mixed), updateability (how easily new information revises this), descendant centrality, path centrality, activation threshold, isCompressed flag, and category (ontological, identity, relational, functional, or peripheral)
2. THE Simulation_Engine SHALL compute descendant centrality as the number of unique dependent nodes reachable from a given node
3. THE Simulation_Engine SHALL compute path centrality as the total number of dependency paths that pass through a given node
4. WHEN a RepresentationNode is created, THE Simulation_Engine SHALL initialize resolution to 1.0, confidence to a specified default, and isCompressed to false
5. THE Simulation_Engine SHALL validate that resolution remains within [0, 1] and activation threshold is non-negative

### Requirement 3: Representational Network (DAG)

**User Story:** As a researcher, I want the network to be a well-defined directed acyclic graph with queryable structure, so that centrality and cascade computations are deterministic.

#### Acceptance Criteria

1. THE Simulation_Engine SHALL model the Representational_Network as a directed acyclic graph where edges point from dependency source to dependent target
2. THE Simulation_Engine SHALL provide operations to query dependents, ancestors, and both centrality metrics for any node
3. THE Simulation_Engine SHALL support serialization to JSON and deserialization back to a network with identical structure and computed properties
4. THE Simulation_Engine SHALL document that v0.1 assumes a DAG for computational simplicity, and that cyclic regulation (feedback loops) is a planned v0.2+ extension enabling modeling of self-reinforcing patterns
5. THE Simulation_Engine SHALL NOT treat cycles as errors or invalid psychological networks in documentation or user-facing text

### Requirement 4: IRC and Emergent Compression Threshold

**User Story:** As a researcher, I want CT to emerge from the simulation rather than being a user-input parameter, so that the model generates predictions rather than confirming assumptions.

#### Acceptance Criteria

1. THE Simulation_Engine SHALL accept IRC as a network-level capacity parameter representing how many contradictory representations can coexist simultaneously
2. THE Simulation_Engine SHALL compute each node's contribution to the network's simultaneity demand based on its current activation relative to its threshold
3. WHEN total simultaneity demand across the network exceeds the network's IRC, THE Simulation_Engine SHALL begin reducing resolution of the least structurally central nodes first
4. THE Simulation_Engine SHALL identify the emergent CT as the load level where resolution loss first occurs in the network
5. THE Simulation_Engine SHALL expose the computed CT value as an output of the simulation, not as an input parameter

### Requirement 5: Load Application and Cascade Simulation

**User Story:** As a researcher, I want to apply load to the network and observe structural-consequence-ordered compression and cascade propagation, so that I can study how topology determines vulnerability patterns.

#### Acceptance Criteria

1. WHEN affective load is applied, THE Simulation_Engine SHALL order node compression by structural consequence: nodes with lower descendant centrality compress before nodes with higher descendant centrality (given equal activation thresholds)
2. WHEN a node's resolution drops below a critical threshold (0.3), THE Simulation_Engine SHALL propagate instability to nodes that depend on it (cascade effect)
3. THE Simulation_Engine SHALL propagate cascades only in the dependency direction (source to dependent), never against it
4. THE Simulation_Engine SHALL support step-by-step execution so the user can observe the compression sequence incrementally
5. THE Simulation_Engine SHALL be fully deterministic: identical network, load sequence, and parameters produce identical results every run
6. THE Simulation_Engine SHALL compute and expose aggregate metrics: total network resolution, number of compressed nodes, and maximum cascade depth

### Requirement 6: Preset Topologies

**User Story:** As a theory explorer, I want preset distributed and hub-dependent topologies using SRF-accurate node labels, so that I can immediately compare how topology affects vulnerability.

#### Acceptance Criteria

1. THE Simulation_Engine SHALL provide a distributed topology preset with 12-15 nodes, maximum descendant centrality of 3-4, and redundant dependency paths
2. THE Simulation_Engine SHALL provide a hub-dependent topology preset with 12-15 nodes, one hub node with descendant centrality of 8-12, and serial dependencies through the hub
3. THE Simulation_Engine SHALL use psychologically meaningful node labels from SRF theory (e.g., "I exist as separate", "I can be loved", "I have worth") in all presets
4. THE Simulation_Engine SHALL ensure both presets have matched node counts to enable fair comparison

### Requirement 7: Topology Comparison (Research Framing)

**User Story:** As a researcher, I want to compare how the same load event affects different topologies, so that I can investigate the theoretical prediction that topology determines vulnerability.

#### Acceptance Criteria

1. THE Simulation_Engine SHALL support side-by-side simulation of two networks receiving identical affective load sequences
2. WHEN both simulations complete, THE Simulation_Engine SHALL display comparative metrics: total resolution retained, cascade depth, and which representations were compressed in each topology
3. THE Simulation_Engine SHALL enable comparison of what happens in each topology without predetermining which topology performs better
4. THE Simulation_Engine SHALL frame comparison results as observations, not as confirmations of theoretical predictions

### Requirement 8: D3 Network Visualization

**User Story:** As a theory explorer, I want an interactive force-directed graph visualization colored by resolution state, so that I can see compression and cascades unfold spatially.

#### Acceptance Criteria

1. THE Visualization_Engine SHALL render the representational network as a D3 force-directed graph where nodes are sized by descendant centrality and colored by resolution level
2. THE Visualization_Engine SHALL use a green-yellow-red color gradient mapping resolution 1.0 (full) to 0.0 (compressed)
3. WHEN affective load is applied, THE Visualization_Engine SHALL animate resolution changes with smooth color transitions
4. WHEN a cascade event occurs, THE Visualization_Engine SHALL animate a propagation pulse along dependency edges from source to affected nodes
5. WHEN a node is selected, THE Visualization_Engine SHALL display node properties: label, resolution, confidence, descendant centrality, path centrality, and category
6. THE Visualization_Engine SHALL use WCAG AA compliant color contrast for all text and interactive elements

### Requirement 9: Side-by-Side Comparison View

**User Story:** As a theory explorer, I want to see two networks side by side responding to the same load, so that topology-dependent differences are immediately visible.

#### Acceptance Criteria

1. THE Visualization_Engine SHALL render two network graphs side by side with synchronized load application
2. THE Visualization_Engine SHALL label one network "Distributed" and the other "Hub-Dependent"
3. WHEN the user applies load, THE Visualization_Engine SHALL animate both networks simultaneously so differences in compression timing and cascade depth are visible
4. THE Visualization_Engine SHALL display comparative metrics below or beside the graphs after load application

### Requirement 10: Landing Page

**User Story:** As a first-time visitor, I want to understand the core theoretical insight within 30 seconds through an interactive demonstration.

#### Acceptance Criteria

1. THE Network_Model SHALL present a landing page with an epistemic explanation of what the visitor is about to see
2. THE Network_Model SHALL display the message: "Same load. Different topology. Click Apply Load."
3. WHEN the user clicks Apply Load, THE Network_Model SHALL show the distributed network flexing (gradual, localized compression) while the hub-dependent network's hub collapses and cascade propagates through dependent nodes
4. THE Network_Model SHALL display a running narrative in SRF terminology explaining what is happening during the simulation
5. THE Network_Model SHALL provide a reset control to restore both networks to initial state
6. THE Network_Model SHALL communicate the core insight: topology determines psychological vulnerability, not the content of what a person believes

### Requirement 11: Terminology Compliance

**User Story:** As the theory author, I want all user-facing text to follow SRF terminology rules precisely, so that the toolkit does not introduce conceptual errors.

#### Acceptance Criteria

1. THE Toolkit SHALL use "highly compressed dichotomous processing" instead of the word "binary" when describing psychological states
2. THE Toolkit SHALL use "minimally differentiated" or "categorical" instead of "primitive"
3. THE Toolkit SHALL use "continuity of being" instead of "existence" when describing ontological stakes
4. THE Toolkit SHALL describe IRC as a holding threshold, not as energy, fuel, or resource
5. THE Toolkit SHALL describe compression as a consequence of simultaneity failure, not as a mechanism
6. THE Toolkit SHALL use "simultaneity" rather than "complexity" as the correct term for the capacity to hold contradictory representations
7. THE Toolkit SHALL never use em dash characters in user-facing text
8. THE Toolkit SHALL present healing and topological change as an OPEN question (DIH), not as an assumed outcome

### Requirement 12: Accessibility and Responsive Design

**User Story:** As a user on different devices, I want the toolkit to be usable on desktop and tablet screens with keyboard navigation and screen reader support.

#### Acceptance Criteria

1. THE Toolkit SHALL render correctly on viewport widths from 768px to 1920px
2. THE Toolkit SHALL provide keyboard navigation for all interactive controls
3. THE Toolkit SHALL use sufficient color contrast (WCAG AA minimum) for all text and interactive elements
4. THE Toolkit SHALL provide text alternatives for all visualization states
5. IF a visualization cannot be rendered, THEN THE Toolkit SHALL display a fallback static description

## Future Versions (Roadmap, Not Implemented in v0.1)

### v0.2: Representation Update / Digital Twin / Salience and Authority
- Prediction error computation per node
- Updateability-driven revision when new information arrives
- Digital twin simulation: model another person's representational network
- **Salience** as an independent node property (0-1): how strongly a representation attracts attention and feels significant, independent of evidence or truth
- **Authority/weight** as an independent node property (0-1): how much a representation controls inference and action, independent of resolution
- Self-other epistemic asymmetry modeling: configurable authority weighting between self-model and other-model representations
- Salience-memory reconstruction feedback loop: biased salience produces biased encoding, selective remembering, defensively coherent narrative, stronger prior, reinforcing the same salience distribution
- Self-maintaining feedback loops: rigid prior leads to threat-biased salience, which produces confirmation-biased interpretation, defensive action, relational conflict, and data that appears to confirm the original prior
- **Five-stage signal processing model**: signal detection -> salience -> meaning assignment -> self-relevance -> epistemic evaluation. Each stage modeled independently. Truth value (stage 5) must not be inferred from felt importance (stage 2), assigned meaning (stage 3), or personal relevance (stage 4).
- **Self-relevance weighting**: separate from salience. A signal can be salient without being self-relevant, or self-relevant without high salience. In vulnerable states, self-relevant threat/admiration signals may receive disproportionate weight.
- **Prior-driven salience feedback**: priors such as "the world sends me signs" can train attention toward confirmatory coincidences while non-confirming events fade. Modeled as salience-mediated selection and confirmation loop.

### v0.3: Development / Process Isolation
- Full developmental boot sequence: External Regulation, Representation Formation, Self/Other Models, Differentiation, Process Isolation, Simultaneity, Integration, Autonomy
- Developmental progression visualization
- DRIH topology preset with signal-class-specific injury

### v0.4: DSP / Recovery
- `relaxLoad(amount)` and `recover(steps)` in engine interface
- Recovery rate as separate parameter from compression rate
- Hysteresis modeling: recovery may not restore to original baseline
- Full DSP timeline visualization with phase coloring
- Externalization latency (REL) marker
- Runtime modification modeling: how external regulators change interpretive state without changing external reality

### v0.5: Developmental Attractor Competition Model
- Agent-based developmental simulation: child agent, caregiver agent(s), event generator
- Temporal learning over developmental episodes (not static topology)
- Attractor competition: self-compression and other-compression as the two defensive branches. Integration is the preceding developmental alternative or later exit - not a third branch within the bifurcation
- Emergent topology: representational network structure develops from repeated interactions rather than being pre-given
- **Blame-responsibility routing network** (formal substrate of the Blame-Responsibility Market): models how guilt, blame, global badness, and responsibility route through a relational network. Properties: available carriers, transfer cost, regulatory yield, power (who can refuse blame), liquidity, concentration (permanent scapegoat risk), inflation (larger accusations needed for same relief), conversion (global blame to differentiated responsibility)
- **Conditional caregiver switching** mechanism: child learns "correct behavior activates good caregiver, wrong behavior activates bad caregiver," creating illusion of control. Dual-world model preserved because it offers agency over attachment security.
- **ACC/UBA/RRC** as operational caregiver parameters: Affective Containment Capacity (tolerate protest without collapse/retaliation), Undifferentiated Blame Assumption (accept global/false blame to restore calm), Responsibility Redistribution Capacity (differentiate and redistribute responsibility without humiliation). Healthy profile: ACC high, UBA low, RRC high.
- Child parameters: affect_reactivity, threat_sensitivity, attachment_dependency, shame_sensitivity, dominance_tendency, inhibitory_control, initial_integration_capacity, recovery_rate, representation_updateability
- Caregiver parameters: attunement, contingent_soothing, affective_containment_ACC, blame_assumption_UBA, responsibility_redistribution_RRC, boundary_consistency, retaliation_probability, withdrawal_probability, repair_reliability
- Anti-circularity: attractors must emerge from local learning rules without being explicitly encoded; simulation must be capable of producing null results or unexpected outcomes
- Key research question: Do distinct attractors emerge from shared local rules without being hard-coded?
- Relationship to v0.1: v0.1 shows what happens to a GIVEN topology under load (static); v0.5 shows how topology DEVELOPS through repeated interaction (dynamic)
- The developmental bifurcation has exactly two defensive branches (self-sacrifice and other-sacrifice) modeled as competing attractor states whose basins depend on temperament, caregiver response distribution, reinforcement history, and structural consequence costs. Branches are attractors, not types.
