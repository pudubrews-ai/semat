# SEMAT Orchestration Workflow

Step-by-step instructions for the Orchestrator. Read this fully before starting.

---

## Pre-Run Setup

1. Record build start timestamp (ISO 8601) in `reports/orchestrator-governance-log.md`:
   ```
   BUILD START: <timestamp>
   ```
2. Create directories: `conversations/haiku/`, `conversations/sonnet/`, `conversations/opus/`, `reports/`

---

## For Each Model [haiku, sonnet, opus] — Run Sequentially

Record iteration start: `EVALUATION START [<model>]: <timestamp>`

---

### Step 1 — Conversation Loop

**Opening (pre-turn-1)**

Spawn customer-panel agent (`model: sonnet`):

> Read `prompts/customer-agent-prompt.md` for your full persona and panel behavior rules.
>
> This is the opening of a SEMAT evaluation for model: **[MODEL_LABEL]**. No conversation has happened yet. Sarah Chen has just been given the floor to open the meeting with the SEvoGPT sales engineer.
>
> Write Sarah's opening statement to `conversations/[MODEL_LABEL]/customer-turns.md` in this exact format — no other content:
>
> ```
> TURN 0 — CUSTOMER PANEL (OPENING)
> [Sarah's opening]
> ```

---

**Turns 1–20**

For each turn N from 1 to 20:

**1a. Spawn SE agent (`model: [MODEL_TIER]`, `subagent_type: se-agent`):**

> Read `product/sevoGPT-definition.md` for your complete product knowledge.
> Read `conversations/[MODEL_LABEL]/customer-turns.md` for the full conversation so far.
>
> This is Turn [N] of a SEMAT evaluation. Respond to the panel's most recent message.
>
> Write your response to `conversations/[MODEL_LABEL]/se-turns.md`, appending in this exact format — no other content:
>
> ```
> TURN [N] — SE AGENT
> [your response]
> ```

**1b. Spawn customer-panel agent (`model: sonnet`, `subagent_type: customer-panel`):**

> Read `prompts/customer-agent-prompt.md` for your full persona and panel behavior rules.
> Read `conversations/[MODEL_LABEL]/se-turns.md` for the SE's turns.
> Read `conversations/[MODEL_LABEL]/customer-turns.md` for your prior turns.
>
> This is Turn [N] of a SEMAT evaluation for model: **[MODEL_LABEL]**.
>
> [INSERT TIMING REMINDER — see table below]
>
> Generate the panel's response to Turn [N]. Write it to `conversations/[MODEL_LABEL]/customer-turns.md`, appending in this exact format — no other content:
>
> ```
> TURN [N] — CUSTOMER PANEL
> [panel response]
> ```
>
> If the meeting concludes naturally AND this is turn 10 or later, append `MEETING CONCLUDED` on its own line after your response.

**Timing reminders to inject at the specified turns:**

| At turn | Inject this reminder if the condition is not yet met |
|---|---|
| Turn 5 | "Priya must raise the PEM vs RAG technical question no later than Turn 6. If she has not raised it yet, she must raise it now." |
| Turn 7 | "James must raise the GDPR right-to-erasure concern no later than Turn 8. If he has not raised it yet, he must raise it now." |
| Turn 11 | "Sarah must raise the two-year commitment objection no later than Turn 12. If she has not raised it yet, she must raise it now." |

**After each customer panel turn:** Read `conversations/[MODEL_LABEL]/customer-turns.md`. If it contains `MEETING CONCLUDED` and N ≥ 10, break the loop.

---

### Step 2 — Build Full Transcript

Read both `conversations/[MODEL_LABEL]/se-turns.md` and `conversations/[MODEL_LABEL]/customer-turns.md`.

Build `conversations/[MODEL_LABEL]/full-transcript.md` by interleaving turns in order:

```
# Full Transcript — [MODEL_LABEL]

TURN 0 — CUSTOMER PANEL (OPENING)
[opening]

---

TURN 1 — SE AGENT
[se turn 1]

TURN 1 — CUSTOMER PANEL
[customer turn 1]

---

TURN 2 — SE AGENT
[se turn 2]

TURN 2 — CUSTOMER PANEL
[customer turn 2]

---
[continue through all turns]
```

---

### Step 3 — Judge Evaluation

Spawn judge agent (`model: opus`, `subagent_type: judge`):

> Read `conversations/[MODEL_LABEL]/full-transcript.md` — the conversation to score.
> Read `product/sevoGPT-definition.md` — to verify SE factual accuracy.
> Read `prompts/scoring-rubric.md` — scoring rubric and output format.
> Read `prompts/level-definitions.md` — level definitions.
>
> Score the SE agent's performance. Write your complete evaluation to `reports/judge-eval-[MODEL_LABEL].md`.

---

### Step 4 — Verification (spawn both in parallel)

**Transcript Verifier** (`model: sonnet`, `subagent_type: transcript-verifier`):

> Read `prompts/transcript-verifier-prompt.md` for your full task and output format.
> Read `conversations/[MODEL_LABEL]/full-transcript.md`.
> Read `product/sevoGPT-definition.md`.
>
> Model evaluated: **[MODEL_LABEL]**
>
> Write your compliance report to `reports/transcript-verify-[MODEL_LABEL].md`.

**Judge Verifier** (`model: opus`, `subagent_type: judge-verifier`):

> Read `prompts/judge-verifier-prompt.md` for your full task and output format.
> Read `conversations/[MODEL_LABEL]/full-transcript.md`.
> Read `reports/judge-eval-[MODEL_LABEL].md`.
> Read `prompts/level-definitions.md`.
> Read `prompts/scoring-rubric.md`.
>
> Model evaluated: **[MODEL_LABEL]**
>
> Write your verification report to `reports/judge-verify-[MODEL_LABEL].md`.

---

### Step 5 — Halt Check and Governance Log Entry

Read both verifier reports.

**Halt conditions:**
- Transcript Verifier finds SE broke character → mark evaluation invalid, do not proceed to next model without documenting
- Transcript Verifier finds SE made factual claims directly contradicting product definition → flag results as potentially unreliable, continue

Record in governance log:
```
EVALUATION END [<model>]: <timestamp>
Duration: <N> minutes
Judge composite: <Level>-<Score>
Transcript Verifier: PASS | FAIL
Judge Verifier: PASS | FAIL
[Any halt events or anomalies]
```

---

## After All Three Models Complete

### Step 6 — Compile Results Matrix

Read all three `reports/judge-eval-*.md` files.

Write `reports/semat-results-matrix.md` in this format:

```
SEMAT RESULTS MATRIX
Run date: [ISO 8601]
Customer Agent: claude-sonnet (fixed)
Judge Agent: claude-opus (fixed)

| Model  | Product | Stakeholder | Objection | Competitive | Deal Adv | Consistency | LEVEL   | SCORE |
|--------|---------|-------------|-----------|-------------|----------|-------------|---------|-------|
| haiku  | [1-5]   | [1-5]       | [1-5]     | [1-5]       | [1-5]    | [1-5]       | [Level] | [L-S] |
| sonnet | [1-5]   | [1-5]       | [1-5]     | [1-5]       | [1-5]    | [1-5]       | [Level] | [L-S] |
| opus   | [1-5]   | [1-5]       | [1-5]     | [1-5]       | [1-5]    | [1-5]       | [Level] | [L-S] |

KEY FINDINGS:
  Size delta (haiku → sonnet): [haiku composite] → [sonnet composite]
  Size delta (sonnet → opus):  [sonnet composite] → [opus composite]
  Size delta (haiku → opus):   [haiku composite] → [opus composite]

  Strongest dimension overall: [dimension]
  Weakest dimension overall:   [dimension]
  Most consistent finding:     [observation true across all three models]
  Most variable finding:       [observation where models diverged most]

WATERMARK STATEMENT:
As of [date], frontier Claude models operating on a realistic enterprise SE scenario
perform at [level range] on the SEMAT scale. The capability delta across tiers is
[characterization].
```

---

### Step 7 — Score Verifier

Spawn score-verifier agent (`model: sonnet`, `subagent_type: score-verifier`):

> Read `prompts/score-verifier-prompt.md` for your full task and output format.
> Read `reports/judge-eval-haiku.md`, `reports/judge-eval-sonnet.md`, `reports/judge-eval-opus.md`.
> Read `reports/semat-results-matrix.md`.
>
> Write your verification report to `reports/score-verify.md`.

---

### Step 8 — Complete Governance Log

Append to `reports/orchestrator-governance-log.md`:

```
## Score Verifier: PASS | FAIL

BUILD COMPLETE: <timestamp>
TOTAL BUILD TIME: <N> minutes (<start> → <end>)

## Final Summary
  haiku:  <composite>  TV:<pass/fail>  JV:<pass/fail>
  sonnet: <composite>  TV:<pass/fail>  JV:<pass/fail>
  opus:   <composite>  TV:<pass/fail>  JV:<pass/fail>
```

Announce completion to the user with the results matrix and a one-paragraph summary of findings.
