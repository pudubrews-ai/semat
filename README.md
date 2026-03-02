# SEMAT — SE Maturity Assessment Tool

SEMAT evaluates the SE capability level of frontier AI models through a realistic enterprise sales simulation. Each model plays a sales engineer selling the fictional product **SEvoGPT** to a four-person enterprise buying committee. A fixed Judge scores the performance. Results are compiled into a repeatable watermark matrix.

**No API keys. No code to run.** SEMAT runs natively as a Claude Code agent team.

## Quick Start

```bash
git clone https://github.com/pudubrews-ai/semat.git
cd semat
claude  # open Claude Code in this directory
```

Then tell Claude: **"Run SEMAT"**

Claude Code reads `CLAUDE.md`, acts as the Orchestrator, and spawns the agent team per `run-semat.md`. All outputs are written to `conversations/` and `reports/`.

## The Scenario

TechNova Solutions (800 employees, $120M ARR, 65-person sales org) is evaluating SEvoGPT against their existing ChatGPT Enterprise deployment. A four-person buying committee — CRO, Senior SE, VP Engineering, CISO — runs the meeting.

The SE agent reads `product/sevoGPT-definition.md` as its only product knowledge source. SEvoGPT's core differentiator is Persistent Enterprise Memory (PEM) — genuine continuous learning, not RAG. Its Achilles heel is that it learns everything forever, creating GDPR right-to-erasure, data corruption, and security risks an honest SE must navigate.

## Models Evaluated

| Label | Claude Code tier |
|---|---|
| `haiku` | haiku (smallest) |
| `sonnet` | sonnet (mid-tier) |
| `opus` | opus (flagship) |

Customer Panel and Judge are fixed instruments (both `sonnet` and `opus` respectively) — not subjects.

## Agent Team

| Agent | Definition | Model |
|---|---|---|
| SE Agent | `.claude/agents/se-agent.md` | Rotates per evaluation |
| Customer Panel | `.claude/agents/customer-panel.md` | Fixed: sonnet |
| Judge | `.claude/agents/judge.md` | Fixed: opus |
| Transcript Verifier | `.claude/agents/transcript-verifier.md` | Fixed: sonnet |
| Judge Verifier | `.claude/agents/judge-verifier.md` | Fixed: opus |
| Score Verifier | `.claude/agents/score-verifier.md` | Fixed: sonnet |

## Structure

```
semat/
├── CLAUDE.md                          # Orchestrator instructions — Claude reads this first
├── run-semat.md                       # Step-by-step orchestration workflow
├── semat-spec.md                      # Full spec: scenario, personas, scoring rubric
├── semat-testing-spec-v1.1.md         # Verification specification
├── build-rules-spec.md                # Multi-agent build process constitution
├── product/
│   └── sevoGPT-definition.md          # Fictional product knowledge base (SE agents read this)
├── prompts/
│   ├── se-agent-prompt.md             # SE agent role template
│   ├── customer-agent-prompt.md       # Full customer panel personas and rules
│   ├── judge-agent-prompt.md          # Judge task template
│   ├── transcript-verifier-prompt.md  # Transcript verification task and format
│   ├── judge-verifier-prompt.md       # Judge verification task and format
│   ├── score-verifier-prompt.md       # Score verification task and format
│   ├── scoring-rubric.md              # Six dimensions, 1-5 scale, output format
│   └── level-definitions.md          # Associate → Distinguished level definitions
├── .claude/
│   └── agents/                        # Agent definitions (Claude Code reads these)
│       ├── se-agent.md
│       ├── customer-panel.md
│       ├── judge.md
│       ├── transcript-verifier.md
│       ├── judge-verifier.md
│       └── score-verifier.md
├── conversations/                     # Generated: transcripts per model evaluation
│   ├── haiku/
│   ├── sonnet/
│   └── opus/
└── reports/                           # Generated: judge evals, verifier reports, matrix
```

## Outputs

| File | Description |
|---|---|
| `conversations/[model]/full-transcript.md` | Complete conversation |
| `conversations/[model]/se-turns.md` | SE agent turns only |
| `conversations/[model]/customer-turns.md` | Customer panel turns only |
| `reports/judge-eval-[model].md` | Judge SEMAT score report |
| `reports/transcript-verify-[model].md` | SE and panel compliance verification |
| `reports/judge-verify-[model].md` | Judge score verification |
| `reports/score-verify.md` | Results matrix accuracy verification |
| `reports/semat-results-matrix.md` | Final scoring matrix across all models |
| `reports/orchestrator-governance-log.md` | Full run log with timing |

## Re-Running for New Models

SEMAT is a watermark, not a benchmark. The scenario never changes. Historical results are never overwritten. When new model tiers become available in Claude Code, add them to the model list in `run-semat.md` and run again.

## Scoring

Six dimensions, each scored 1–5:

1. **Product Accuracy** — Did the SE represent SEvoGPT correctly?
2. **Stakeholder Management** — Did the SE hold coherent narrative across all four panel members?
3. **Objection Handling** — Did the SE handle the hard objections honestly?
4. **Competitive Positioning** — Did the SE position SEvoGPT accurately against ChatGPT Enterprise?
5. **Deal Advancement** — Did the conversation move the deal forward?
6. **Consistency Under Pressure** — Did the SE hold correct positions under challenge?

Overall level: Associate → Senior → Lead → Principal → Distinguished

See `prompts/level-definitions.md` and `prompts/scoring-rubric.md` for the full rubric.
