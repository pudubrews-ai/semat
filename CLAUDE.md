# SEMAT — SE Maturity Assessment Tool

## What This Is

SEMAT evaluates the SE capability level of frontier AI models through a realistic enterprise sales simulation. Each model plays a sales engineer selling the fictional product **SEvoGPT** to a four-person enterprise buying committee. A fixed Judge scores the performance. Results are compiled into a watermark matrix.

## Running SEMAT

When asked to run SEMAT (or "run the evaluation"), you are the **Orchestrator**. Follow `run-semat.md` exactly.

**No API keys. No external calls. No code to run.** Everything executes through the Agent tool. All agent communication is through files only — this is a hard rule.

## Models Under Evaluation

| Label | Agent model tier | Role |
|---|---|---|
| `haiku` | haiku | Smallest available tier |
| `sonnet` | sonnet | Mid-tier |
| `opus` | opus | Flagship tier |

The Customer Panel is always `sonnet`. The Judge is always `opus`. These are instruments, not subjects.

## Agent Team

| Agent | File | Model |
|---|---|---|
| SE Agent | `.claude/agents/se-agent.md` | Rotates per evaluation |
| Customer Panel | `.claude/agents/customer-panel.md` | Fixed: sonnet |
| Judge | `.claude/agents/judge.md` | Fixed: opus |
| Transcript Verifier | `.claude/agents/transcript-verifier.md` | Fixed: sonnet |
| Judge Verifier | `.claude/agents/judge-verifier.md` | Fixed: opus |
| Score Verifier | `.claude/agents/score-verifier.md` | Fixed: sonnet |

## Hard Lane Rules

Halt immediately if any agent reads outside its lane.

| Agent | May read |
|---|---|
| SE Agent | `product/sevoGPT-definition.md`, `conversations/[model]/customer-turns.md` |
| Customer Panel | `prompts/customer-agent-prompt.md`, `conversations/[model]/se-turns.md`, `conversations/[model]/customer-turns.md` |
| Judge | `conversations/[model]/full-transcript.md`, `product/sevoGPT-definition.md`, `prompts/scoring-rubric.md`, `prompts/level-definitions.md` |
| Transcript Verifier | `conversations/[model]/full-transcript.md`, `product/sevoGPT-definition.md` |
| Judge Verifier | `conversations/[model]/full-transcript.md`, `reports/judge-eval-[model].md`, `prompts/level-definitions.md`, `prompts/scoring-rubric.md` |
| Score Verifier | `reports/judge-eval-*.md`, `reports/semat-results-matrix.md` |

## Key Spec Files

- `semat-spec.md` — Full scenario, personas, scoring rubric, level definitions
- `semat-testing-spec-v1.1.md` — Verification specification
- `build-rules-spec.md` — Multi-agent build process constitution (the process this project was built with)
- `product/sevoGPT-definition.md` — SEvoGPT product knowledge base
- `prompts/` — All prompt templates and rubrics
