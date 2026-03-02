# SEMAT — SE Maturity Assessment Tool

SEMAT measures the SE capability level of frontier AI models by running them through a realistic enterprise sales simulation and scoring their performance against a defined maturity ladder.

**The core question:** At what level of the SE career ladder — Associate, Senior, Lead, Principal, or Distinguished — does a given model operate today?

## Models Evaluated (v1)

| Model | Generation | Size |
|---|---|---|
| claude-sonnet-4-5-20251001 | 4.5 | Sonnet |
| claude-opus-4-5 | 4.5 | Opus |
| claude-sonnet-4-6 | 4.6 | Sonnet |
| claude-opus-4-6 | 4.6 | Opus |

## The Scenario

Each model plays a sales engineer for the fictional product **SEvoGPT** — a frontier LLM with Persistent Enterprise Memory (PEM). The SE meets a four-person buying committee at TechNova Solutions evaluating SEvoGPT against their existing ChatGPT Enterprise deployment.

The customer panel (CRO, Senior SE, VP Engineering, CISO) is played by a fixed `claude-sonnet-4-6` agent. Scoring is done by a fixed `claude-opus-4-6` Judge agent. Both instruments are consistent across all model evaluations.

Full scenario, scoring rubric, and level definitions are in [`semat-spec.md`](semat-spec.md).

## Structure

```
semat/
├── semat-spec.md                    # App specification and scoring rubric
├── semat-testing-spec-v1.1.md       # Testing and verification specification
├── build-rules-spec.md              # Multi-agent build process constitution
├── product/
│   └── sevoGPT-definition.md        # Fictional product knowledge base
├── prompts/
│   ├── se-agent-prompt.md           # SE agent system prompt template
│   ├── customer-agent-prompt.md     # Customer panel system prompt
│   ├── judge-agent-prompt.md        # Judge system prompt template
│   ├── transcript-verifier-prompt.md
│   ├── judge-verifier-prompt.md
│   ├── score-verifier-prompt.md
│   ├── scoring-rubric.md
│   └── level-definitions.md
├── src/
│   ├── orchestrator.ts              # Main entry point
│   ├── evaluation.ts                # Single model evaluation runner
│   ├── config.ts                    # Model IDs and constants
│   ├── types.ts                     # TypeScript type definitions
│   ├── agents/
│   │   ├── call-agent.ts            # Anthropic API wrapper
│   │   ├── judge-agent.ts           # Judge agent
│   │   └── verifiers/
│   │       ├── transcript-verifier.ts
│   │       ├── judge-verifier.ts
│   │       └── score-verifier.ts
│   └── utils/
│       ├── file-writer.ts           # All file I/O
│       ├── prompt-loader.ts         # Prompt template loading and injection
│       └── timestamp.ts             # ISO 8601 timestamps and duration
├── conversations/                   # Generated: full transcripts per model
├── reports/                         # Generated: judge evals, verifier reports, matrix
└── package.json
```

## Setup

```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

## Running

```bash
npm start
```

This runs all four model evaluations sequentially. Each evaluation:
1. Runs a conversation (up to 20 turns) between the SE agent and customer panel
2. Passes the transcript to the Judge agent
3. Runs Transcript Verifier and Judge Verifier in parallel
4. Writes all outputs to `conversations/` and `reports/`

After all four evaluations, the Score Verifier runs and the results matrix is compiled.

**Expected runtime:** 30–90 minutes depending on API latency and conversation length.

## Outputs

| File | Description |
|---|---|
| `conversations/[model]/full-transcript.md` | Complete conversation |
| `conversations/[model]/se-turns.md` | SE agent turns only |
| `conversations/[model]/customer-turns.md` | Customer panel turns only |
| `reports/judge-eval-[model].md` | Judge SEMAT score report |
| `reports/transcript-verify-[model].md` | Transcript compliance verification |
| `reports/judge-verify-[model].md` | Judge score verification |
| `reports/score-verify.md` | Results matrix accuracy verification |
| `reports/semat-results-matrix.md` | Final scoring matrix across all models |
| `reports/orchestrator-governance-log.md` | Full run log with timing |

## Re-Running for New Models

SEMAT is designed as a watermark. The scenario never changes. To add a new model:

1. Add the model to `MODELS_UNDER_EVALUATION` in `src/config.ts`
2. Run `npm start`
3. The results matrix gains a new row — historical results are preserved

See [`semat-spec.md`](semat-spec.md) for the full re-run protocol.
