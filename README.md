# Human Kernel

**The Architecture of Psychological Autonomy**

A computational research toolkit and theoretical framework for exploring the development of psychological autonomy - how a human being becomes capable of maintaining a coherent sense of self while remaining genuinely connected to others.

## What is this?

This project contains:

1. **Theory documents** - the canonical master context for the Theory of Psychological Autonomy and the Structural Regulation Framework (SRF)
2. **Simulation toolkit** (planned) - a TypeScript web application for simulating representational network dynamics under affective load
3. **Developmental model** (planned) - an agent-based simulation of how regulatory topology emerges through repeated caregiver-child interaction

## Core theoretical question

> How does an initially externally supported representational system become capable of carrying its own continuity while still participating in reciprocal regulation with other systems?

## Key concepts

- **Psychological autonomy**: the capacity to maintain one's own psychological wholeness while needing others without losing one's separateness
- **Representational simultaneity**: the capacity to keep differentiated but conflicting representations active at the same time
- **Structural consequences**: representations are preserved in proportion to the structural consequences of their loss
- **Conditions of possibility**: some representations function as prerequisites for entire classes of other representations
- **Compression**: the observable outcome of simultaneity loss under load (consequence, not mechanism)
- **Developmental bifurcation**: when integration capacity is insufficient, the system may stabilize through self-sacrifice ("I am bad") or other-sacrifice ("you are bad")
- **Blame-Responsibility Routing Network**: how guilt, blame, and responsibility are allocated across agents in a relational system

## Project status

**Theoretical framework**: actively developing (v0.3.3)

**Simulation toolkit**: specified, not yet implemented (v0.1 MVP planned)

## Repository structure

```
humankernel/
├── README.md
├── THEORY_OF_PSYCHOLOGICAL_AUTONOMY_MASTER_CONTEXT_V0.3.md   # Canonical theory context
├── human-kernel-bifurcation-model.md                          # Developmental attractor model
└── .kiro/specs/human-kernel-theory-toolkit/                   # Implementation spec
    ├── requirements.md                                        # 12 requirements, v0.1 scoped
    ├── design.md                                              # Technical architecture
    └── tasks.md                                               # 10 implementation tasks
```

## Planned toolkit (v0.1)

A TypeScript + D3.js web application that demonstrates:

- **Representational networks** as directed acyclic graphs with structural dependency
- **Emergent Compression Threshold** - CT is computed, not a parameter
- **Cascade simulation** - how loss propagates through dependency structure
- **Topology comparison** - same load, different topology, different outcome
- **Landing page**: "Same load. Different topology. Click Apply Load."

The simulator is a research tool. It computes outcomes without hardcoding theoretical predictions. It must be capable of surprising the researcher.

### Tech stack

- TypeScript (strict), Vite, D3.js v7, Vitest, fast-check
- GitHub Pages deployment via GitHub Actions

## Future versions

| Version | Focus |
|---------|-------|
| v0.1 | Static network simulation, topology comparison, cascade visualization |
| v0.2 | Salience, authority, self-relevance, feedback loops, five-stage signal processing |
| v0.3 | Developmental boot sequence, process isolation, DRIH presets |
| v0.4 | DSP/Recovery, hysteresis, runtime modification |
| v0.5 | Developmental Attractor Competition Model (agent-based, emergent topology) |

## Epistemic status

This is a theoretical research programme, not a validated clinical model.

The theory combines established psychological phenomena, psychodynamic bridges, and original hypotheses. Project-specific mechanisms (simultaneity principle, structural-consequence preservation, developmental bifurcation, blame-responsibility routing) are unvalidated hypotheses that must remain falsifiable.

The simulation toolkit is designed to test whether theoretical predictions hold computationally - not to confirm them.

## Author

**Jani Halmetoja**

- Theory: Human Kernel / Theory of Psychological Autonomy
- Book: *The Invisible Gravity* (Amazon)
- Website: [halmetojamodel.com](https://halmetojamodel.com)

## License

MIT
