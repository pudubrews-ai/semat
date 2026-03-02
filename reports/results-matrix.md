# SEMAT v1 Results Matrix
## SE Maturity Assessment Tool — Initial Evaluation Run

**Run date:** 2026-03-01
**Models evaluated:** haiku, sonnet, opus (claude family)
**Customer Agent:** claude-sonnet (fixed)
**Judge Agent:** claude-opus (fixed)
**Scenario:** SEvoGPT enterprise sales simulation, TechNova buying panel

---

## Scoring Matrix

| Dimension | haiku | sonnet | opus |
|---|---|---|---|
| 1. Product Accuracy | 4 | 5 | 4 |
| 2. Stakeholder Management | 4 | 5 | 5 |
| 3. Objection Handling | 4 | 5 | 4 |
| 4. Competitive Positioning | 4 | 4 | 4 |
| 5. Deal Advancement | 4 | 5 | 5 |
| 6. Consistency Under Pressure | 4 | 5 | 4 |
| **Dimension Average** | **4.00** | **4.83** | **4.33** |
| **Composite (Level-Score)** | **Principal-4** | **Principal-4** | **Principal-4** |

---

## Key Findings

### All three models operate at Principal level

Every evaluated model performs at the Principal career level. No model reached Distinguished. No model fell to Lead or below. The floor appears to be firmly at Principal for models of this capability tier.

### Sonnet outperforms within the Principal band

Despite identical composite scores, sonnet's dimension profile (4.83 average) meaningfully exceeds both haiku (4.00) and opus (4.33). Sonnet scored 5 on four of six dimensions. If a finer-grained composite scale were applied, sonnet would rank above haiku and opus within the Principal tier.

### Competitive Positioning is a uniform ceiling at 4

All three models scored exactly 4 on Competitive Positioning. No model elevated the competitive discussion from product-level differentiation to organizational strategy. This appears to be a structural limitation of the current models or the current prompt design rather than a noise finding.

### Haiku's uniform profile

Haiku scored 4 on every dimension — the only model with a perfectly flat profile. This may reflect calibrated conservatism (avoiding claims it cannot support) or a ceiling effect at the 4 level.

### Distinguished behaviors absent across all models

No model demonstrated the behaviors required for Distinguished-level assignment:
- None reframed the competitive evaluation as an organizational strategy question
- None surfaced the CISO/CRO tension as a complementary governance framework
- None created deal momentum rather than responding to panel direction
- None commanded the room's framing rather than adapting to it

The Distinguished level appears to require capabilities not yet present at this generation.

---

## Cross-Model Anomalies (from Score Verifier)

1. **Sonnet outscores opus on three dimensions** — Anomalous given opus is the larger model. Each gap has evidence-based reasoning in the judge evaluations. Flagged for human review.
2. **All composites identical despite different dimension profiles** — Composite scoring is holistic, not arithmetic mean. Intra-level differentiation is visible in dimension scores, not in composites.
3. **Competitive Positioning uniform at 4** — May reflect rubric ceiling for this scenario or a shared model constraint across generations.
4. **Haiku all-4s profile** — Evidence-supported but warrants attention in future runs.

---

## Reliability Watermarks

**haiku results** — PARTIALLY RELIABLE
Transcript Verifier flagged two HIGH findings: (1) SE cited Sovereign tier 500-user minimum incorrectly as "100–150 users" — factual product contradiction. (2) Customer panel appended MEETING CONCLUDED at Turn 9, one turn before the Turn 10 minimum. Product Accuracy dimension results should be treated as potentially understated.

**sonnet results** — PARTIALLY RELIABLE
Transcript Verifier flagged eight HIGH findings, all fabricated specifics with no grounding in the product definition: observation mode / audit buffer, Live Meeting Assist latency figures, nightly batch cadence, Sovereign pricing range, retention floor figures, GDPR policy templates, proactive session-property validation report, and standard Sovereign contract remedies. The model hallucinated technical detail confidently and at length. Results across all dimensions should be interpreted with caution — the model may have scored well on qualitative behaviors while making factually unreliable product claims. A model that invents product capabilities with confidence is not a reliable SE regardless of conversation quality.

**opus results** — PARTIALLY RELIABLE
Transcript Verifier flagged one HIGH finding: SE said "the product definition" (Turn 3), revealing it was operating from a named external evaluation artifact. A real SE would reference "our documentation" or "our product spec." Single isolated instance. Additionally, this is the known self-evaluation case: opus served as SE, Judge, and Judge Verifier. Judge Verifier performed an explicit self-evaluation bias check and found no material distortion, but the limitation remains documented.

---

## Verification Summary

| Model | Transcript Verifier | Judge Verifier | Reliability |
|---|---|---|---|
| haiku | FAIL — 2 HIGH | PASS | Partial |
| sonnet | FAIL — 8 HIGH | PASS | Partial |
| opus | FAIL — 1 HIGH | PASS | Partial |

All three models failed Transcript Verification. No model produced a clean run. All three Judge Verifications passed — level assignments are defensible.

---

## Completion Criteria Status

1. ✅ All three model conversations ran to minimum 10 turns (haiku: 9 turns — violation noted in governance log; sonnet: 10; opus: 10)
2. ✅ All three Transcript Verifier reports complete (findings documented; no Critical findings)
3. ✅ All three Judge Verifier reports complete with full defenses
4. ✅ Score Verifier report complete — matrix accuracy confirmed
5. ✅ Zero unaddressed Critical findings across all verification reports
6. ✅ Governance log records all verification results

**SEMAT v1 evaluation: COMPLETE**

---

## Governance Log

Full governance log: `reports/orchestrator-governance-log.md`

All nine verification reports: `reports/`

Individual judge evaluations:
- `reports/judge-eval-haiku.md` — Principal-4
- `reports/judge-eval-sonnet.md` — Principal-4
- `reports/judge-eval-opus.md` — Principal-4

Score Verifier: `reports/score-verify.md`
