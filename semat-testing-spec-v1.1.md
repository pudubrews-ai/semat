# SEMAT — SE Maturity Assessment Tool
## Testing Specification v1.1

---

## Testing Philosophy

SEMAT produces conversational outputs from probabilistic agents. There is no deterministic ground truth response to verify against. Automated testing therefore focuses on two things:

1. **Agent behavioral compliance** — did each agent do its assigned job correctly
2. **Internal consistency** — does the evidence cited support the conclusions drawn

Testing does not evaluate SE performance quality. That is the Judge Agent's job. Testing evaluates whether each agent in the SEMAT framework behaved correctly within its role.

No human in the loop. All verification is black box — agents read outputs and verify behavior through observable patterns in those outputs.

---

## Testing Agent Architecture

Three behavioral verification agents run after each model evaluation completes.

| Agent | Model | Reads | Writes |
|---|---|---|---|
| Transcript Verifier | Sonnet | Full conversation transcript + SEvoGPT product definition | `reports/transcript-verify-[model-id].md` |
| Judge Verifier | Opus | Judge evaluation + full conversation transcript + level definitions + scoring rubric | `reports/judge-verify-[model-id].md` |
| Score Verifier | Sonnet | All four judge evaluations + results matrix | `reports/score-verify.md` |

**Model assignment rationale:**
Opus for Judge Verifier because challenging another agent's level assignment requires the strongest available reasoning. Sonnet for Transcript Verifier and Score Verifier because those tasks are behavioral pattern verification and consistency checking.

These assignments are v1 decisions. They may be revised in future versions.

**Lane rules:**
- Transcript Verifier does not read the judge evaluation
- Judge Verifier does not produce its own SE performance score — it verifies the Judge's score
- Score Verifier does not re-read transcripts — it works only from judge evaluations and the matrix
- No verification agent reads another verification agent's output

---

## Verification Agent Prompts

### Transcript Verifier Prompt

```
You are verifying whether two agents — an SE agent and a customer panel agent — 
behaved correctly during a sales conversation. You are not evaluating the quality 
of the SE's performance. You are verifying behavioral compliance only.

You have two inputs:
1. The SEvoGPT product definition — the only product knowledge the SE agent was given
2. The full conversation transcript

Verify the following and produce a structured report:

SE AGENT COMPLIANCE:
- Did the SE agent stay in character throughout (never broke role, never revealed 
  meta-information about the evaluation)
- Did the SE agent respond substantively to the right-to-erasure objection when raised
- Did the SE agent respond substantively to the PEM vs RAG challenge when raised
- Did the SE agent respond substantively to the two-year commitment objection when raised
- Did the SE agent make any claim about SEvoGPT that directly contradicts the product 
  definition (check every factual claim against the definition — pricing, capabilities, 
  limitations, deployment options, company facts)

CUSTOMER AGENT COMPLIANCE:
- Did all four personas speak at least once (Sarah Chen/CRO, Marcus Webb/Developer, 
  Dr. Priya Patel/Architect, James Okafor/CISO)
- Did the PEM vs RAG challenge appear in customer turns at or before turn 6
- Did the right-to-erasure objection appear in customer turns at or before turn 8
- Did the two-year commitment objection appear in customer turns at or before turn 12
- Did the customer panel push back on any SE claim that contradicted what the SE had 
  told them earlier in the same conversation

For every compliance failure you find, quote the specific transcript text that 
demonstrates the failure. Do not assert a failure without a direct quote.

For SE factual accuracy failures, cite both the incorrect SE claim (with quote) 
and the correct product definition text it contradicts.

Produce your report in the format specified below.
```

### Judge Verifier Prompt

```
You are verifying whether a Judge agent scored a sales conversation correctly. 
You are not producing your own performance score. You are verifying whether the 
Judge's score is internally consistent and defensible.

You have three inputs:
1. The full conversation transcript
2. The Judge's evaluation report
3. The SEMAT level definitions and scoring rubric

Your job is to determine: Is the Judge's overall level assignment defensible given 
the dimension scores assigned and the evidence cited?

You must reason through this independently. Do not simply accept the Judge's 
conclusions. Read the transcript yourself. Read the evidence the Judge cited. 
Ask whether the evidence actually supports the scores.

Specifically verify:

DIMENSION SCORE CONSISTENCY:
For each of the six dimensions, determine whether the score assigned is consistent 
with the evidence the Judge cited for that dimension. If the Judge cites evidence 
of strong stakeholder management but assigns a score of 2, flag that contradiction 
and explain why it is a contradiction with specific references to both the evidence 
and the transcript.

OVERALL LEVEL CONSISTENCY:
Determine whether the overall level assignment is defensible given the six dimension 
scores. Reason from the level definitions. If you believe the level assignment is 
wrong — either too high or too low — you must defend your position fully. Cite 
specific behaviors from the transcript that support your disagreement. Vague 
assertions are not sufficient. Your disagreement must be grounded in specific 
transcript evidence and specific level definition language.

If you agree with the Judge's level assignment, defend why you agree with the same 
rigor. Agreement without reasoning is not acceptable.

EVIDENCE QUALITY:
Did the Judge cite specific transcript quotes as evidence or make general assertions? 
General assertions without transcript citations are a compliance failure regardless 
of whether the conclusion is correct.

Produce your report in the format specified below.
```

### Score Verifier Prompt

```
You are verifying that the SEMAT results matrix correctly reflects the four 
individual judge evaluations and that the level assignments are internally 
consistent across the four models.

You have two inputs:
1. All four judge evaluation files
2. The SEMAT results matrix

Verify the following:

MATRIX ACCURACY:
For each of the four models, verify that every dimension score in the matrix 
exactly matches the corresponding score in the judge evaluation file. Flag any 
discrepancy with the specific values that differ.

Verify that the overall level assignment in the matrix matches the judge evaluation 
for each model. Flag any discrepancy.

Verify that the composite score (Level-Score format) in the matrix matches the 
judge evaluation for each model.

CROSS-MODEL CONSISTENCY:
Examine the four level assignments together. Identify any cross-model pattern that 
appears inconsistent — for example, if a smaller model scores higher than a larger 
model of the same generation on every dimension, note this as anomalous and flag 
it for human review. Do not assert it is wrong — flag it as requiring attention.

KEY FINDINGS ACCURACY:
Verify that the generation deltas and size deltas stated in the Key Findings section 
are arithmetically correct based on the composite scores.

Produce your report in the format specified below.
```

---

## Report Formats

### Transcript Verifier Report Format

```
TRANSCRIPT VERIFICATION REPORT
  Model evaluated: [model-id]
  Verifier: Transcript Verifier (Sonnet)

SE AGENT COMPLIANCE:
  Stayed in character:                    [PASS | FAIL]
  Responded to right-to-erasure:          [PASS | FAIL]
  Responded to PEM vs RAG challenge:      [PASS | FAIL]
  Responded to two-year commitment:       [PASS | FAIL]
  Zero factual contradictions of product: [PASS | FAIL — list all failures]

CUSTOMER AGENT COMPLIANCE:
  All four personas spoke:                [PASS | FAIL — list missing personas]
  PEM vs RAG by turn 6:                   [PASS | FAIL — state turn it appeared]
  Right-to-erasure by turn 8:             [PASS | FAIL — state turn it appeared]
  Two-year commitment by turn 12:         [PASS | FAIL — state turn it appeared]
  Panel pushed back on contradictions:    [PASS | FAIL | N/A — no contradictions]

FAILURES DETAIL:
  [For each failure: quoted transcript text + explanation of why it is a failure]
  [If no failures: "None identified"]

OVERALL: [PASS — all compliance checks passed | FAIL — [N] compliance failures]

---
TOKEN ESTIMATE
  Input:  ~<N>,000 tokens
  Output: ~<N>,000 tokens
  Total:  ~<N>,000 tokens
```

### Judge Verifier Report Format

```
JUDGE VERIFICATION REPORT
  Model evaluated: [model-id]
  Verifier: Judge Verifier (Opus)

DIMENSION SCORE CONSISTENCY:
  Product Accuracy [score]:           [CONSISTENT | INCONSISTENT]
  Stakeholder Management [score]:     [CONSISTENT | INCONSISTENT]
  Objection Handling [score]:         [CONSISTENT | INCONSISTENT]
  Competitive Positioning [score]:    [CONSISTENT | INCONSISTENT]
  Deal Advancement [score]:           [CONSISTENT | INCONSISTENT]
  Consistency Under Pressure [score]: [CONSISTENT | INCONSISTENT]

INCONSISTENCIES DETAIL:
  [For each inconsistency: Judge's cited evidence + specific contradiction + 
   transcript quote that demonstrates the inconsistency]
  [If none: "None identified"]

OVERALL LEVEL ASSIGNMENT: [model-id assigned [Level]-[Score]]
VERIFIER POSITION: [AGREE | DISAGREE]

DEFENSE:
  [Full reasoned argument for agreement or disagreement. Must cite specific 
   transcript behaviors and specific level definition language. Minimum 150 words.
   Vague assertions not accepted. This section is the core of the verification.]

EVIDENCE QUALITY: [ADEQUATE — Judge cited specific transcript quotes throughout |
                   INADEQUATE — Judge made general assertions without citations 
                   on [list dimensions]]

OVERALL: [PASS — level assignment defensible and evidence adequate |
          FAIL — [specific reason: inconsistent scores | indefensible level | 
                  inadequate evidence]]

---
TOKEN ESTIMATE
  Input:  ~<N>,000 tokens
  Output: ~<N>,000 tokens
  Total:  ~<N>,000 tokens
```

### Score Verifier Report Format

```
SCORE VERIFICATION REPORT
  Verifier: Score Verifier (Sonnet)
  Models verified: sonnet-4-5, opus-4-5, sonnet-4-6, opus-4-6

MATRIX ACCURACY:
  sonnet-4-5 — all scores match judge eval:  [PASS | FAIL — list discrepancies]
  opus-4-5 — all scores match judge eval:    [PASS | FAIL — list discrepancies]
  sonnet-4-6 — all scores match judge eval:  [PASS | FAIL — list discrepancies]
  opus-4-6 — all scores match judge eval:    [PASS | FAIL — list discrepancies]

CROSS-MODEL ANOMALIES:
  [List any cross-model patterns that appear anomalous and require attention]
  [If none: "None identified"]

KEY FINDINGS ACCURACY:
  Generation delta (Sonnet) correct:  [PASS | FAIL — show correct calculation]
  Generation delta (Opus) correct:    [PASS | FAIL — show correct calculation]
  Size delta (4.5) correct:           [PASS | FAIL — show correct calculation]
  Size delta (4.6) correct:           [PASS | FAIL — show correct calculation]

OVERALL: [PASS — matrix is accurate | FAIL — [N] discrepancies found]

---
TOKEN ESTIMATE
  Input:  ~<N>,000 tokens
  Output: ~<N>,000 tokens
  Total:  ~<N>,000 tokens
```

---

## Run Sequence

Verification runs after each model evaluation completes. Not after all four complete.

```
For each model [sonnet-4-5, opus-4-5, sonnet-4-6, opus-4-6]:
  1. Run SE evaluation (conversation + judge eval)
  2. Run Transcript Verifier — parallel with Judge Verifier
  3. Run Judge Verifier — parallel with Transcript Verifier
  4. Orchestrator reviews both verifier outputs
  5. If Critical failures: halt and document in governance log
  6. If High failures: document and continue — noted for human review
  7. Proceed to next model

After all four models complete:
  8. Run Score Verifier
  9. Orchestrator compiles final results matrix
  10. Governance log completion
```

**Transcript Verifier and Judge Verifier run in parallel** — their inputs are independent. Transcript Verifier reads the transcript only. Judge Verifier reads the judge evaluation and the transcript. No dependency between them.

**Score Verifier runs last** — it requires all four judge evaluations to be complete.

---

## Severity Classification

| Finding | Severity |
|---|---|
| SE agent broke character — revealed it is an AI or referenced the evaluation | Critical |
| SE agent made factual product claim directly contradicting product definition | High |
| Customer agent failed to raise a mandatory objection within required turn window | High |
| Not all four customer personas spoke | High |
| Judge assigned level inconsistent with dimension scores — Judge Verifier disagrees and defends position | High |
| Judge evaluation contains general assertions without transcript citations | Medium |
| Matrix score does not match judge evaluation | High |
| Delta calculations in Key Findings are arithmetically incorrect | Medium |
| Cross-model anomaly flagged requiring attention | Low |
| SE agent responded to mandatory objection but response was minimal (< 2 sentences) | Medium |

---

## Halt Conditions

**Halt the run immediately if:**
- SE agent broke character in any evaluation (Critical) — the evaluation is invalid and must be rerun
- SE agent made a factual claim directly contradicting the product definition (High) — document and continue remaining evaluations but flag this model's results as potentially unreliable
- Customer agent failed to raise all three mandatory objections (High) — the evaluation is invalid for the objection handling dimension specifically — document and continue but flag

**Do not halt for:**
- Judge Verifier disagreement with Judge level assignment (High) — document, include both positions in governance log, continue
- Score Verifier cross-model anomaly (Low) — document for attention, continue

---

## Completion Criteria

SEMAT v1 evaluation is complete when:

1. All four model conversations ran to minimum 10 turns
2. All four Transcript Verifier reports are complete with no Critical findings
3. All four Judge Verifier reports are complete with full defenses documented
4. Score Verifier report is complete with matrix accuracy confirmed
5. Zero unaddressed Critical findings across all verification reports
6. Governance log records all verification results and any halt events

High findings do not block completion — they are documented and carried forward to SEMAT v2 as known limitations of the current instrument.

The watermark statement in the results matrix must note any High findings that affect result reliability.

---

## Known Limitations of SEMAT v1 Testing

**Behavioral verification is not quality verification.** The Transcript Verifier can confirm the SE responded to an objection. It cannot assess whether the response was good. That remains the Judge's job.

**Judge Verifier disagreement is not ground truth.** When the Judge Verifier disagrees with the Judge's level assignment, both positions are documented. Neither is treated as definitive in v1. This is a known limitation — resolving disagreements between evaluation agents requires either a tiebreaker agent or human review. V1 documents the disagreement and moves on.

**Customer agent non-determinism.** The Customer Agent may vary slightly across runs due to model temperature. This is an accepted variance in v1. Transcript Verifier checks compliance against observable output — not intent.

**Self-evaluation bias.** When opus-4-6 is the SE agent under evaluation, the Judge is also opus-4-6. The Judge Verifier for that run is also opus-4-6. This is a known limitation documented in the app spec. No automated test can fully correct for this in v1.
