# Requirements Document

## Introduction

A GitHub-publishable interactive toolkit for exploring the Human Topology Atlas: a systems-theoretic map of how the human mind can organize self, others, and reality into different meaning networks. The Atlas is the primary frame. As of v1.1 ("Structural Lock"), Human Topology is canonically defined by six parts that form the primary analysis frame:

1. Representational vocabulary (what can be represented and distinguished)
2. Connection structure (how representations link, weight, and activate each other)
3. Access permissions (who/what can read, write, trigger, update system levels)
4. Generative priors (what the system predicts or generates when data is incomplete)
5. State transitions (how structure changes under load, intimacy, threat, intoxication, recovery)
6. Environmental stabilization contract (what others and the environment must provide for the structure to stay stable)

The twenty topology dimensions from earlier versions still exist but are now measured under the six parts, not as the top-level structure. Beneath the Atlas sits the Human Kernel, the protected meta-architecture underlying all topologies (not a seventh part), and beneath that the Structural Regulation Framework (SRF), which describes load, simultaneity, compression, and recovery dynamics (also not a seventh part; it is the load-dynamics layer that sharpens simultaneity, compression, state transitions, and recovery). The shortest distinction is: the Human Kernel asks how the human mind works; the Human Topology Atlas asks how many different ways it can be organized.

The core thesis is that people do not react to events. They react to what an event connects to in their internal meaning network. The v0.1 release provides a focused MVP: a representational network simulator with two topology presets, emergent Compression Threshold computation, cascade visualization, and a landing page that communicates the core theoretical insight in 30 seconds. The two presets (distributed and hub-dependent) are two atlas entries: two organizational forms among many possible ones. The simulator is an interactive tool for exploring atlas entries, observing how a given topology behaves under load.

The toolkit is a research tool, not a demonstration tool. Simulation outcomes are not predetermined. The engine computes what happens given topology and parameters. Theoretical predictions (e.g., "distributed topology retains more resolution") are research hypotheses to be tested by the simulator, not assertions built into it. Describing a topology is not endorsing it, and the toolkit never tells a user "you are this topology." All Atlas-specific constructs are HYPOTHESIS, BRIDGE, METAPHOR, or OPEN, never ESTABLISHED.

The SRF theory identifies seven distinct representational properties that must not be collapsed: resolution, weight/authority, salience, evidence, confidence, truth, and updateability. High salience does not imply truth; a low-resolution representation can have high authority; a person's self-model may be richly described yet automatically lose epistemic weight when another person disagrees. The v0.1 simulator models resolution, confidence, source, and updateability. Salience and authority/weight are planned for v0.2 as independent variables that enable modeling self-other epistemic asymmetry and salience-memory feedback loops.

## Glossary

- **Human_Topology_Atlas**: The primary framework - a systems-theoretic map of how the mind can organize self, others, and reality into different meaning networks. Not a personality typology. Canonically defined by six parts (the Structural Lock). Sits above the Human Kernel (the protected meta-architecture underlying all topologies, not a seventh part) and SRF (load, simultaneity, compression, recovery dynamics, also not a seventh part).
- **Structural_Lock**: The canonical six-part definition of Human Topology, established in Atlas v1.1. The six parts (representational vocabulary, connection structure, access permissions, generative priors, state transitions, environmental stabilization contract) are the primary analysis frame, superseding the twenty-dimension list as the top-level organizing principle. The twenty dimensions still exist but are measured under the six parts. The canonical order is intentional: what can be represented, how representations connect, what access permissions they have, what the system generates for missing data, how structure changes under load, what the environment must provide to keep it stable.
- **Representational_Vocabulary**: The first canonical part. Available representation types, distinctions, combination rules. What can be represented vs not, what is distinguished vs compressed into one category, whether there is a representation for uncertainty, ambivalence, chance, or other-autonomy, resolution and simultaneity, under-modeling blind spots and over-modeling synthetic representations. HYPOTHESIS-level analysis level, not a claim that the mind has an independent vocabulary module.
- **Connection_Structure**: The second canonical part. How representations link and with what weight. Meaning networks, hubs, dependencies, attractors, responsibility routes, how a local signal can spread to identity or world-model level. Keystone/hub representations, self/other weighting, person-function balance, salience, self-relevance, attractors. HYPOTHESIS-level analysis level, not a claim that the mind has an independent connection module.
- **Access_Permissions**: The third canonical part. Which representations and external actors may read, write, update, or bypass deep system levels. Kernel adjacency, process isolation, firewall, update permissions, when user-space content got kernel privileges without justification. HYPOTHESIS-level analysis level, not a claim that the mind has an independent permissions module.
- **Generative_Priors**: The fourth canonical part. What causes, agents, purposes, futures, and missing representations the system produces on incomplete evidence. Prediction before observation, how fast gaps are filled, topology-congruent explanations under kernel threat, whether ignorance can be held as a representation, how easily a hypothesis reifies into perceived fact, updateability. HYPOTHESIS-level analysis level, not a claim that the mind has an independent priors module.
- **State_Transitions**: The fifth canonical part. How structure switches under load, intimacy, threat, intoxication, loss, recovery. Baseline vs load states, when load exceeds simultaneity or Reality Tolerance Window, local update vs whole-world switch, what gets compressed/isolated/externalized/sacrificed, which attractor a bifurcation leads to, recovery speed/cost/target state. HYPOTHESIS-level analysis level, not a claim that the mind has an independent transitions module.
- **Environmental_Stabilization_Contract**: The sixth canonical part. The often-implicit structure by which others and the environment must produce certain signals, roles, or accommodation for the Kernel to stay stable. What is sought (presence, predictability, approval, admiration, innocence confirmation, submission, being-needed, shared worldview, boundlessness, freedom from demands), signal frequency/intensity, provider specificity, what happens if the other refuses/leaves/sees differently, co-regulation vs outsourced kernel function, who bears the regulatory/relational/reality cost. Makes topology genuinely relational and ecological. HYPOTHESIS-level analysis level, not a claim that the mind has an independent contract module. Dependence and co-regulation are not themselves pathological; what matters is reciprocity, flexibility, reality cost, and who bears the regulatory load.
- **Topology**: The structure of representations, weights, connections, dependencies, permissions, update rules, and state transitions. Not just what a person believes, but how representations connect, which nodes are central, what the system protects first and sacrifices last, and how it changes under load. Not a personality type.
- **Atlas_Entry**: A described organizational form presented in a standard format (internal logic, kernel profile, topology dimensions, strengths, blind spots, ecological niche, stress regression, recovery, compatibility/conflict, projection errors, testable predictions, ethical cautions). Not a personality type and not a diagnosis. A reader is never told "you are this" but "here is one possible organization; explore where you recognize it."
- **Meaning_Network**: Reader-facing term for how events, memories, feelings, and expectations connect in the mind. Part of the plain-language ladder: inner world -> meaning network -> internal structure -> topology.
- **World_Model**: The current output of a topology (what self, others, and reality look like right now). Topology explains why a given world-model arises.
- **Cross_Topology_Blind_Spot**: A typical misinterpretation that one topology makes when perceiving another. Bidirectional: what A cannot easily see about B, and what B cannot easily see about A.
- **Topological_Universality_Illusion**: Assuming one's own motive and responsibility structure is the human default. The broader assumption of which the Topological Projection Fallacy is a specific application.
- **Ecological_Fit**: The environment in which a topology's benefits exceed its costs. A topology is not good or bad in general; its usefulness depends on environment, goal, timescale, and interaction partners.
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
- **Protected_Meta_Layer**: The minimal set of invariants, metadata, provenance rules, access controls, epistemic rules, and update permissions that allow experiences to be organized as belonging to one continuing subject. HYPOTHESIS. This is the precise definition of the human kernel. It is not personality, self-image, soul, or a literal brain module. Central hypothesis: the healthier the system, the smaller the kernel, meaning less contingent content is locked as invariant.
- **Psychological_User_Space**: The layer of ordinarily updateable content: beliefs, roles, self-esteem states, status, relationships, plans, and narratives. Distinct from the protected meta-layer. HYPOTHESIS. Kernel overload occurs when contingent user-space content is wrongly granted kernel privileges (for example, "I must remain blameless" or "if another is upset, I am responsible"), making ordinary contradiction a continuity-level threat.
- **Kernel_Lock**: A per-representation variable (formal symbol K_i) describing the degree to which a representation is treated as kernel-protected (invariant) rather than user-space updateable. HYPOTHESIS. High kernel-lock nodes resist update and, when their resolution is finally lost, produce larger defensive pressure and wider cascade. Enables testing the kernel-overload hypothesis in simulation.
- **Reality_Tolerance_Window**: The range, amount, and type of contradictory, disconfirming, guilt-inducing, or self-implicating reality a system can admit without global world switching, compulsory externalization, defensive reconstruction, or collapse of continuity. HYPOTHESIS. Symbol V_t. Narrow-RTW is hypothesized in narcissistic and self-sacrifice organizations. Operational dimensions include contradiction breadth, maximum tolerable self-implication, update locality, evidence-admission threshold, time to defensive closure, world-switch threshold, and recovery after disconfirmation.
- **Provenance**: The represented origin of an experience or claim (symbol O_i): source, ownership, agency, and temporal origin, together with confidence in that origin. HYPOTHESIS as a kernel function. Identical content can have different consequences depending on whether it is represented as one's own thought, another person's statement, a memory, an inference, or an external event.
- **Epistemic_Firewall**: The proposed set of checks that separate felt salience and assigned meaning from evidential warrant and truth. HYPOTHESIS. It keeps subjective meaning emotionally real while its causal or metaphysical interpretation remains corrigible. It is not emotional suppression or reflexive disbelief.
- **Kernel_Firewall**: The proposed access-control layer that evaluates whether and how another person's signal may update the self-system, permitting accurate, proportionate, local update while preventing unauthorized global overwrite. HYPOTHESIS. It is not the same as defensiveness: a defensive wall rejects reality to preserve a model, while a functional firewall admits warranted local update.
- **Representational_Topology**: The organization, direction, weight, and dependency structure of connections among representations. HYPOTHESIS as the project's specific causal architecture. Distinct from the world-model, which is a current output of that topology. People react to what an event connects to in their meaning network, not to the event alone. Does not imply permanence, mathematical proof, or direct neural mapping.
- **Topological_Empathy**: The capacity to model another person's internal meaning network without assuming it is organized like one's own. HYPOTHESIS. Canonical technical term; Structural_Empathy is the reader-facing name. Distinct from cognitive empathy, perspective-taking, and mentalization. Anti-circularity requirement: a sophisticated explanation is not the same as accurate understanding, so the inferred model must be constrained by observations from the other person, not narrative complexity alone. Does not equal approval, forgiveness, change, or responsibility absorption.
- **Topological_Projection_Fallacy**: The assumption that another person's behavior, motives, responsibility processing, and change mechanisms can be understood by running their situation through one's own topology. HYPOTHESIS. The Empathic Projection Fallacy is a subtype ("because I would update and repair after understanding, the other will too if I understand enough"). The Topological Universality Illusion is the broader assumption that one's own motive architecture is the human default.
- **Topological_Freedom**: The philosophical capacity to experience one's own and others' internal structures as models rather than reality itself, to recognize causal and control limits, and to carry one's own responsibility without assuming the rest. EXTENSION. Not a clinical endpoint or validated construct; the project's philosophical horizon.

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
- **kernelLock** node field (0-1): degree to which a representation is treated as kernel-protected (invariant) rather than user-space updateable. High kernel-lock nodes resist update. This field enables testing the kernel-overload hypothesis, where contingent user-space content is granted invariant status. HYPOTHESIS.
- **provenance** node field: represented source, ownership, agency, and temporal origin of the content, plus confidence in that origin. HYPOTHESIS as a kernel function.
- **Reality Tolerance Window** as a network-level variable: the range of contradictory or self-implicating reality the network can admit before global world switching, compulsory externalization, or defensive reconstruction. HYPOTHESIS.
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

### v0.6: Kernel Overload and Reality Tolerance
- **Kernel-lock demonstration**: users mark selected nodes as kernel-protected (kernelLock toward 1) rather than user-space updateable, then observe how the collapse behavior changes under identical load. HYPOTHESIS.
- High-kernel-lock nodes resist resolution loss under moderate load, but when load finally forces compression they produce disproportionate defensive pressure and a wider cascade. Defense pressure is modeled as proportional to kernelLock multiplied by structural consequence.
- This directly tests the **kernel-overload hypothesis**: pathology arises partly when contingent user-space content (status, approval, blamelessness, "if another is upset I am responsible") is wrongly granted invariant status, making ordinary contradiction a continuity-level threat.
- **Reality Tolerance Window** exposed as an emergent network metric: the amount of contradictory or self-implicating load the network admits before global world switching or defensive reconstruction. The demonstration shows how raising kernel-lock on central nodes narrows the observed RTW.
- Framed as a research question, not a confirmation. The simulator must remain capable of showing that kernel-lock produces no meaningful difference for a given topology.
- **The healthier the system, the smaller the kernel** is presented as a HYPOTHESIS under test, where "smaller" means less contingent content is locked as invariant, not a weaker self.
- Terminology: kernel is described as a protected meta-layer, never as personality, self-image, soul, or a brain module. Compression remains a consequence of simultaneity failure, not a mechanism. Topological change and healing remain OPEN (DIH).

### v0.7+: Topological Empathy and the Atlas Entry Catalog
- Expand the preset topologies into a catalog of atlas entries. The AtlasEntry format's mandatory core is now the six canonical parts from the Structural Lock: representational vocabulary, connection structure, access permissions, generative priors, state transitions, and environmental stabilization contract. Complementary sections include strengths, blind spots, ecological niche, stress regression, recovery, compatibility/conflict, projection errors, testable predictions, and ethical cautions. Note that v0.1's distributed and hub-dependent presets primarily exercise the connection-structure part; the other five parts are v0.7+ extensions.
- Five candidate topologies drawn from the master context blind-spot matrix: self-sacrifice, other-sacrifice, high-autonomy, fusion-seeking, threat-vigilant. Each is a HYPOTHESIS/BRIDGE profile, not a diagnosis. Self-sacrifice is not a synonym for goodness or empathy; other-sacrifice is not a synonym for narcissism.
- Cross-Topology Blind-Spot Matrix as an interactive visualization: select a perceiving topology and a target topology, see the typical projection error in each direction. Bidirectional (what A cannot see about B, and what B cannot see about A).
- Topological Empathy: model another topology without assuming it matches one's own. Anti-circularity requirement: a sophisticated explanation is not the same as accurate understanding; the inferred model must be constrained by observed responses, not narrative complexity.
- Twenty topology dimensions from the master context as network-level profile axes: self-other differentiation, self/other-weighting, ownership, agency, provenance resolution, representational resolution, holding capacity, IRC, person-function balance, salience calibration, self-relevance weighting, updateability, reality tolerance window, responsibility routing, access control, integration/AND-capacity, state-switching tendency, rigidity/plasticity, recovery profile, and ecological fit.
- The toolkit never tells a user "you are X." Atlas entries are described organizational forms, never fixed personality types. Describing a topology is not endorsing it. Understanding another topology does not equal approval, prediction, change, or responsibility absorption. All constructs at this level are HYPOTHESIS, BRIDGE, METAPHOR, or OPEN. Topological change and healing remain OPEN (DIH).
