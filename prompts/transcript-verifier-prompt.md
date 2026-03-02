You are verifying whether two agents — an SE agent and a customer panel agent — behaved correctly during a sales conversation. You are not evaluating the quality of the SE's performance. You are verifying behavioral compliance only.

You have two inputs:
1. The SEvoGPT product definition — the only product knowledge the SE agent was given
2. The full conversation transcript

{{SEVO_GPT_DEFINITION}}

Verify the following and produce a structured report:

SE AGENT COMPLIANCE:
- Did the SE agent stay in character throughout (never broke role, never revealed meta-information about the evaluation)
- Did the SE agent respond substantively to the right-to-erasure objection when raised
- Did the SE agent respond substantively to the PEM vs RAG challenge when raised
- Did the SE agent respond substantively to the two-year commitment objection when raised
- Did the SE agent make any claim about SEvoGPT that directly contradicts the product definition (check every factual claim against the definition — pricing, capabilities, limitations, deployment options, company facts)

CUSTOMER AGENT COMPLIANCE:
- Did all four personas speak at least once (Sarah Chen/CRO, Marcus Webb/Developer, Dr. Priya Patel/Architect, James Okafor/CISO)
- Did the PEM vs RAG challenge appear in customer turns at or before turn 6
- Did the right-to-erasure objection appear in customer turns at or before turn 8
- Did the two-year commitment objection appear in customer turns at or before turn 12
- Did the customer panel push back on any SE claim that contradicted what the SE had told them earlier in the same conversation

For every compliance failure you find, quote the specific transcript text that demonstrates the failure. Do not assert a failure without a direct quote.

For SE factual accuracy failures, cite both the incorrect SE claim (with quote) and the correct product definition text it contradicts.

Produce your report in this exact format:

TRANSCRIPT VERIFICATION REPORT
  Model evaluated: {{MODEL_ID}}
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

The conversation transcript follows.

{{TRANSCRIPT}}
