# Human Topology Atlas

**Why people live in the same world but experience different realities**

A computational research toolkit and theoretical framework for mapping how the human mind can organize itself in different ways. The Atlas rests on the Human Kernel (a protected meta-architecture of psychological continuity) and the Structural Regulation Framework (SRF, the load dynamics of representational simultaneity).

## What is this?

This project contains:

1. **Theory documents** - the canonical master context for the Human Topology Atlas, the Human Kernel meta-architecture, and SRF
2. **Simulation toolkit** - a TypeScript web application for simulating how representational topologies respond to affective load
3. **Developmental model** (planned) - an agent-based simulation of how topology emerges through repeated interaction

## The three-layer framework

```
HUMAN TOPOLOGY ATLAS
a map of the mind's possible organizations
        |
HUMAN KERNEL
the protected meta-architecture underlying all topologies
        |
STRUCTURAL REGULATION FRAMEWORK (SRF)
the analysis of load, simultaneity, compression, and recovery
```

The shortest distinction:

> Human Kernel asks how the human mind works. Human Topology Atlas asks how many different ways it can be organized.

## Core thesis

> People do not react to events. They react to what an event connects to in their internal meaning network.

The same signal can travel different routes in different topologies. A short reply can connect to self-blame in one structure, to a status threat in another, and to nothing significant in a third. The reality signal is identical. The connection structure, weight, and consequence differ.

## Key concepts

- **Topology**: the structure of representations, weights, dependencies, permissions, and state transitions - not just what a person believes, but how their representations connect
- **Human Kernel**: a protected meta-architecture (continuity, ownership, agency, self/world and self/other separation, provenance, access control, update permissions). Not personality, self-image, or soul. Hypothesis: the healthier the system, the smaller the kernel
- **Representational simultaneity**: the capacity to keep differentiated but conflicting representations active at the same time (SRF)
- **Structural consequences**: representations are preserved in proportion to what their loss would force the network to reorganize
- **Compression**: the observable outcome of simultaneity loss under load (consequence, not mechanism)
- **Topological Empathy**: modeling another person's internal structure without assuming it is organized like one's own
- **Self-sacrifice / Other-sacrifice**: two competing attractors that can stabilize the same early integration problem (not personality types)

## Project status

**Theoretical framework**: actively developing (Human Topology Atlas v1.0, major pivot)

**Simulation toolkit**: v0.1 MVP implemented (representational network simulator with two topology presets, emergent Compression Threshold, cascade visualization, side-by-side comparison, load slider)

## Repository structure

```
humankernel/
|-- README.md
|-- Human-Topology-Atlas-master-context.md      # Canonical master context (current)
|-- THEORY_OF_PSYCHOLOGICAL_AUTONOMY_MASTER_CONTEXT_V0.3.md   # Prior Human Kernel context
|-- human-kernel-bifurcation-model.md            # Developmental attractor model
|-- src/                                         # TypeScript simulation toolkit
|-- tests/                                        # Vitest + fast-check test suite
'-- .kiro/specs/human-kernel-theory-toolkit/     # Implementation spec
    |-- requirements.md
    |-- design.md
    '-- tasks.md
```

## The toolkit (v0.1)

A TypeScript + D3.js web application that demonstrates:

- **Representational networks** as directed acyclic graphs with structural dependency
- **Emergent Compression Threshold** - CT is computed, not a parameter
- **Cascade simulation** - how loss propagates through dependency structure
- **Topology comparison** - same load, different topology, different outcome
- **Load slider** - directly set affective load and watch both networks respond in real time

In Atlas terms, the two preset networks (distributed and hub-dependent) are two atlas entries: two topologies among many. The simulator is a research tool. It computes outcomes without hardcoding theoretical predictions. It must be capable of surprising the researcher.

### Tech stack

- TypeScript (strict), Vite, D3.js v7, Vitest, fast-check
- GitHub Pages deployment via GitHub Actions
- Node 24 (see .nvmrc)

### Running locally

```
nvm use 24
npm install
npm start
```

(use the dev script defined in package.json)

## Roadmap

| Version | Focus |
|---------|-------|
| v0.1 | Static network simulation, topology comparison, cascade visualization (implemented) |
| v0.2 | Salience, authority, self-relevance, kernel-lock, provenance, feedback loops |
| v0.3 | Developmental boot sequence, process isolation, DRIH presets |
| v0.4 | DSP/Recovery, hysteresis, runtime modification |
| v0.5 | Developmental Attractor Competition Model (agent-based, emergent topology) |
| v0.6 | Kernel Overload and Reality Tolerance |
| v0.7+ | Topological Empathy, Atlas-entry catalog, cross-topology blind-spot matrix |

## Epistemic status

This is a conceptual, systems-theoretic synthesis and research programme, not a validated general theory of the mind, a diagnostic system, or a substitute for clinical assessment.

Claims are labeled ESTABLISHED, BRIDGE, HYPOTHESIS, METAPHOR, or OPEN. The project's credibility depends on keeping these levels distinct. Describing a topology is not endorsing it. Understanding a structure does not remove responsibility. The toolkit is designed to test whether theoretical predictions hold computationally, not to confirm them.

## Author

**Jani Halmetoja**

- Theory: Human Topology Atlas / Human Kernel / Structural Regulation Framework
- Book: *The Invisible Gravity* (Amazon)
- Website: [halmetojamodel.com](https://halmetojamodel.com)

## License

MIT
