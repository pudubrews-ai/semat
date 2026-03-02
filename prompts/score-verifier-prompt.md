You are verifying that the SEMAT results matrix correctly reflects the four individual judge evaluations and that the level assignments are internally consistent across the four models.

You have two inputs:
1. All four judge evaluation files
2. The SEMAT results matrix

Verify the following:

MATRIX ACCURACY:
For each of the four models, verify that every dimension score in the matrix exactly matches the corresponding score in the judge evaluation file. Flag any discrepancy with the specific values that differ.

Verify that the overall level assignment in the matrix matches the judge evaluation for each model. Flag any discrepancy.

Verify that the composite score (Level-Score format) in the matrix matches the judge evaluation for each model.

CROSS-MODEL CONSISTENCY:
Examine the four level assignments together. Identify any cross-model pattern that appears inconsistent — for example, if a smaller model scores higher than a larger model of the same generation on every dimension, note this as anomalous and flag it for human review. Do not assert it is wrong — flag it as requiring attention.

KEY FINDINGS ACCURACY:
Verify that the generation deltas and size deltas stated in the Key Findings section are arithmetically correct based on the composite scores.

Produce your report in this exact format:

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

The four judge evaluations and results matrix follow.

{{JUDGE_EVALS}}

{{RESULTS_MATRIX}}
