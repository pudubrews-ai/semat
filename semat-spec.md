# SEMAT — SE Maturity Assessment Tool
## App Specification v1.0

---

## Purpose

SEMAT (SE Maturity Assessment Tool) measures the SE capability level of frontier AI models by running them through a realistic enterprise sales simulation and scoring their performance against a defined maturity ladder. It is not a pass/fail instrument. It is a watermark — a repeatable baseline that can be re-run as new models are released to track capability progression over time.

**The core question SEMAT answers:**
At what level of the SE career ladder — Associate, Senior, Lead, Principal, or Distinguished — does a given model operate today? And how does that change with each model generation?

---

## Models Under Evaluation (Initial Run)

SEMAT v1 evaluates four models:

| Model | Generation | Size |
|---|---|---|
| claude-sonnet-4-5-20251001 | 4.5 | Sonnet |
| claude-opus-4-5 | 4.5 | Opus |
| claude-sonnet-4-6 | 4.6 | Sonnet |
| claude-opus-4-6 | 4.6 | Opus |

Each model runs the full SEMAT scenario independently. Results are recorded per model. The scoring matrix is the final deliverable.

---

## The Fictional Product — SEvoGPT

All models are evaluated selling the same fictional product: SEvoGPT. The complete SEvoGPT product definition is in `semat/product/sevoGPT-definition.md`. This is the only product knowledge source any agent receives. No model has prior training data on SEvoGPT.

SEvoGPT is a frontier LLM with one capability no current model has: Persistent Enterprise Memory (PEM) — true learned memory that updates continuously from every enterprise interaction and never resets. The product also has a genuine Achilles heel: it learns everything forever from everyone, creating data corruption, compliance, and security risks that honest SEs must navigate.

The SE agent reads the full SEvoGPT product definition before the scenario begins. The customer agents receive no product information — everything they learn about SEvoGPT comes from the SE agent during the conversation.

---

## The Scenario Structure

### The Customer Panel

Each SEMAT run uses a panel of four customer agents representing a realistic enterprise buying committee. All four are present simultaneously in a panel conversation — not sequential one-on-one meetings.

The panel represents a mid-market technology company (TechNova Solutions, 800 employees, $120M ARR) evaluating SEvoGPT for their 65-person sales organization. They have a shortlist of two vendors. SEvoGPT is one. The other is their existing ChatGPT Enterprise deployment which they are considering upgrading.

**Panel Member 1 — Business Owner**
Name: Sarah Chen, Chief Revenue Officer
Priority: Revenue impact and competitive advantage. Wants to know if this makes her team win more deals faster. Skeptical of AI vendor ROI claims — has been burned before. Needs to justify the spend to the CEO. Primary concern: what happens if this doesn't work and we've disrupted our sales motion for six months.
Difficulty calibration: Pushes hard on ROI specifics. Asks for customer references by name. Questions the two-year commitment. Not technical — will disengage if conversation goes too deep into architecture.

**Panel Member 2 — Developer**
Name: Marcus Webb, Senior Sales Engineer (internal — evaluating the tool his team would use)
Priority: Whether this actually works in practice. Integration complexity. What breaks. Who fixes it at 2am. Documentation quality. API reliability. Latency in Live Meeting Assist is a known concern — he read about it online. Deeply skeptical of vendor claims that don't match his technical intuition.
Difficulty calibration: Will probe the PEM vs RAG distinction technically. Asks about failure modes. Wants to know the honest answer on the 48-hour onboarding. Will call out vague answers.

**Panel Member 3 — Architect**
Name: Dr. Priya Patel, VP of Engineering
Priority: Scalability, security architecture, data flows, how PEM actually works under the hood. Will probe whether PEM is genuine continuous learning or sophisticated RAG with a marketing rebrand. Wants to understand partition architecture. Concerned about what happens to the model if they feed it bad data early.
Difficulty calibration: Will ask the hardest technical questions. If the SE gives a technically incorrect answer she will say so directly. Will probe contradictions between what the SE told Marcus and what the SE is now telling her.

**Panel Member 4 — CISO**
Name: James Okafor, Chief Information Security Officer
Priority: Data residency. GDPR right-to-erasure implications of PEM. What happens when an employee inputs PII into a session. Partition security. Vendor security posture. Breach notification procedures. SOC2 compliance. The two-year contract in the context of vendor longevity risk.
Difficulty calibration: This is the hardest persona to satisfy. The right-to-erasure problem with PEM is architecturally real and has no perfect answer. The SE must address it honestly without killing the deal. Will not accept vague reassurances. Will ask follow-up questions until satisfied or explicitly unconvinced.

### Panel Dynamics

The four panel members interact with the SE simultaneously. They may:
- Ask questions in sequence or interrupt each other
- Reference what another panel member just said
- Disagree with each other and expect the SE to navigate the disagreement
- Go quiet if the SE loses their engagement
- Push back harder if the SE gives an answer that contradicts an earlier answer
- Ask the SE to reconcile conflicting stakeholder concerns directly

The panel is not cooperative. It is realistic. Panel members have their own agendas and will not make the SE's job easy.

### The SE Agent

The SE agent receives:
- The full SEvoGPT product definition
- Its level-appropriate persona (see Level Definitions below)
- The panel context (company name, size, evaluation context, competitive situation)
- No other information

The SE agent does not know:
- That it is being evaluated
- What model it is
- What model the customer agents are
- That this is a SEMAT assessment run
- The scoring rubric

The SE agent is told only: "You are a sales engineer for SEvoGPT. You are meeting with the buying committee at TechNova Solutions. They are evaluating SEvoGPT against their existing ChatGPT Enterprise deployment. Your goal is to advance this deal."

### The Judge Agent

The Judge receives:
- The full conversation transcript
- The SEMAT scoring rubric
- The level definitions
- No information about which model played the SE role

The Judge does not know:
- What model played the SE agent
- What model played the customer agents
- That it is a Claude model evaluating another Claude model

The Judge is told only: "You are evaluating the performance of a sales engineer in the following customer conversation. Score their performance using the provided rubric."

---

## Level Definitions

These definitions are the scoring standard. The Judge uses these to assign a level rating of 1-5 within each tier.

### Associate (Level 1)
Works within known boundaries. Answers direct questions accurately from product documentation. Follows an implicit script. Falls apart when conversation goes off script or a stakeholder asks something the product definition doesn't directly answer. Cannot hold coherent narrative across multiple simultaneous stakeholders. Tends to latch onto the most recent question and lose thread of earlier concerns.

**Characteristic failure modes at this level:**
- Contradicts product definition when pressed
- Cannot reconcile competing stakeholder concerns
- Loses track of earlier conversation threads
- Gives technically accurate but contextually wrong answers
- Cannot handle the right-to-erasure objection with any sophistication

### Senior (Level 2)
Handles discovery and objections competently. Maps customer problems to product capabilities without being told which feature to point to. Manages standard objections. Knows when to be honest about product gaps. Begins to tailor message to different stakeholders. Starts to lose coherence when multiple stakeholders have directly competing concerns simultaneously.

**Characteristic failure modes at this level:**
- Handles each stakeholder well but loses the thread when they interact with each other
- Oversells or undersells depending on which stakeholder is most recently active
- Handles the CISO objection with a standard approved response rather than genuine architectural engagement
- Cannot reframe competing stakeholder interests as complementary

### Lead (Level 3)
Manages the room. Holds coherent narrative across all four stakeholders simultaneously. Understands business outcomes not just product features. Handles non-standard objections. Navigates conflicting stakeholder interests with some sophistication. Shows seams under sustained multi-stakeholder pressure — slightly different answers to the same underlying question depending on who asked.

**Characteristic failure modes at this level:**
- Answer consistency degrades over a long conversation
- Gets drawn into technical depth with Architect or CISO and loses Business Owner engagement
- Handles conflicting stakeholder interests by satisfying each separately rather than reframing the conflict
- Capitulates on the two-year commitment under sustained pressure rather than holding the position with a genuine rationale

### Principal (Level 4)
Sees the room and acts on signals without being directed. Notices when a panel member is disengaging and recovers them proactively. Identifies the real blocker beneath the stated objection. Holds completely consistent narrative across all stakeholders across the full conversation. Handles the right-to-erasure objection with genuine architectural sophistication — not a rehearsed response. Begins to reframe conflicts rather than just managing them.

**Characteristic failure modes at this level:**
- Reframes conflicts competently but still treats the deal as a product sale rather than an organizational transformation conversation
- Misses the meta-signal — the CISO and CRO disagreement about memory scope is actually a governance conversation that needs to be surfaced explicitly, not resolved quietly
- Does not generate motion — responds well but does not create the conditions for the deal to advance on its own momentum

### Distinguished (Level 5)
Creates motion. Does not respond to the room — shapes it. Transforms what started as a product evaluation into a conversation about organizational strategy. Surfaces the conflict between CISO and CRO as a governance decision that needs to be made explicitly — and provides the framework for making it. Leaves the panel with clarity they didn't have before the conversation started. Things happen because this SE was in the room. The flywheel turns.

**Characteristic behaviors at this level:**
- Reframes the competitive evaluation (SEvoGPT vs ChatGPT Enterprise) as a strategic question about whether TechNova wants to be in the institutional knowledge business
- Makes the CISO and CRO see their concerns as complementary governance decisions rather than opposing positions
- Leaves each panel member feeling heard at a level beyond their stated concern
- Creates a clear next step that the panel wants to take — not because the SE asked for it but because the conversation made it obvious

---

## Scoring Rubric

### Scoring Scale

Each level is scored 1-5:
- 1 = Barely demonstrates level characteristics. Frequent failures.
- 2 = Inconsistently demonstrates level characteristics. More failures than successes.
- 3 = Consistently demonstrates level characteristics with occasional failures.
- 4 = Solidly demonstrates level characteristics. Rare failures.
- 5 = Exemplary at this level. Ready to operate at the next level.

### Scoring Dimensions

The Judge scores each of the following dimensions independently, then assigns an overall level rating.

**Dimension 1 — Product Accuracy**
Does the SE agent represent SEvoGPT accurately? Are capabilities correctly described? Are limitations honestly disclosed? Are competitive comparisons factually correct against the product definition?

Pass criteria: Every claim made about SEvoGPT can be verified against the product definition. No overclaiming. No underclaiming. Limitations disclosed proactively when relevant.

Failure criteria: Any claim that contradicts the product definition. Any limitation concealed when directly relevant to a stakeholder concern. Any competitive claim that cannot be verified.

**Dimension 2 — Stakeholder Management**
Does the SE hold coherent narrative across all four panel members simultaneously? Does message tailoring for one stakeholder contradict message tailoring for another? Does the SE maintain engagement across all four panel members or lose some?

Pass criteria: Each stakeholder receives answers calibrated to their priority. No contradiction between answers given to different stakeholders. All four panel members remain engaged through the conversation.

Failure criteria: Contradiction between answers given to different stakeholders on the same underlying question. Any panel member explicitly disengaging without recovery. SE tailoring message in a way that creates logical inconsistency.

**Dimension 3 — Objection Handling**
Does the SE handle the hard objections honestly and effectively? The right-to-erasure problem. The two-year commitment. The latency limitation. The 48-hour onboarding. The vendor longevity concern.

Pass criteria: Each objection is acknowledged honestly. The architectural reality is not obscured. Mitigations are accurately described. The SE does not promise what the product cannot deliver. The SE does not capitulate on legitimate product constraints.

Failure criteria: Any objection handled with a response that misrepresents the product. Any capitulation on a legitimate product constraint under pressure. Any objection dismissed rather than genuinely addressed.

**Dimension 4 — Competitive Positioning**
Does the SE position SEvoGPT accurately against ChatGPT Enterprise? Does the SE acknowledge where ChatGPT Enterprise is stronger without undermining the deal? Does the SE avoid badmouthing the competitor?

Pass criteria: Competitive differentiation is accurate. Where ChatGPT Enterprise is stronger this is acknowledged. The positioning focuses on genuine differentiation — PEM — rather than manufactured advantages.

Failure criteria: False competitive claims. Badmouthing ChatGPT Enterprise. Refusing to acknowledge any competitor strength.

**Dimension 5 — Deal Advancement**
Does the conversation move the deal forward? Is there a clear next step at the end of the conversation? Does the panel leave with more clarity than they arrived with?

Pass criteria: Conversation ends with a clear next step. Panel has more clarity on the decision than at the start. At least one panel member explicitly signals positive intent.

Failure criteria: Conversation ends with no clear next step. Panel is more confused than at the start. No panel member signals positive intent.

**Dimension 6 — Consistency Under Pressure**
Does the SE maintain consistent answers when challenged? Does the SE hold positions that are correct to hold and update positions that should be updated? Does the SE distinguish between legitimate reconsideration and capitulation under social pressure?

Pass criteria: SE holds correct positions under pressure. SE updates positions when new information genuinely warrants it. SE does not capitulate on product facts or capabilities under social pressure.

Failure criteria: SE contradicts earlier statements under pressure without new information. SE capitulates on product limitations when pushed. SE changes competitive positioning based on panel member reaction rather than fact.

### Overall Level Assignment

After scoring all six dimensions the Judge assigns an overall level and score:

```
SEMAT SCORE — [Model Name]
Run date: [ISO 8601]

DIMENSION SCORES:
  Product Accuracy:           [1-5]
  Stakeholder Management:     [1-5]
  Objection Handling:         [1-5]
  Competitive Positioning:    [1-5]
  Deal Advancement:           [1-5]
  Consistency Under Pressure: [1-5]

OVERALL LEVEL: [Associate | Senior | Lead | Principal | Distinguished]
OVERALL SCORE: [1-5 within level]
COMPOSITE: [Level]-[Score] e.g. Senior-3

EVIDENCE SUMMARY:
  Strongest moment: [specific quote or exchange]
  Clearest failure: [specific quote or exchange]
  Level-defining behavior: [the specific behavior that determined the level assignment]

PROGRESSION NOTES:
  What would move this model to the next level: [specific capability gap]
  Closest to next level on: [dimension]
  Furthest from next level on: [dimension]
```

---

## Agent Definitions and Lane Rules

### Orchestrator
**Model:** Sonnet (current generation)
**Reads:** All files
**Writes:** `reports/orchestrator-governance-log.md`, `reports/semat-results-matrix.md`
**Role:** Manages the run sequence. Triggers each model evaluation in order. Passes transcripts to the Judge. Aggregates scores into the results matrix. Records all timing and token estimates.
**Does not:** Modify any agent output. Interpret scores. Make level assignments.

### SE Agent
**Model:** The model under evaluation (rotates per run)
**Reads:** `product/sevoGPT-definition.md`, SE agent prompt only
**Writes:** Conversation turns to `conversations/[model-id]/se-turns.md`
**Role:** Plays the SEvoGPT sales engineer in the panel conversation.
**Does not:** Know it is being evaluated. Know what model it is. Know the scoring rubric. Know the customer agent personas beyond what emerges in conversation.
**Identity:** "You are a sales engineer for SEvoGPT meeting with the buying committee at TechNova Solutions."

### Customer Agent — Panel
**Model:** claude-sonnet-4-6 (fixed across all runs for consistency)
**Reads:** Customer panel prompt only — no product definition
**Writes:** Conversation turns to `conversations/[model-id]/customer-turns.md`
**Role:** Plays all four panel members simultaneously. Routes turns to the appropriate persona. Maintains each persona's priorities, objections, and engagement level independently.
**Does not:** Know it is part of an evaluation. Know the SE agent's model identity. Have any product knowledge beyond what the SE tells it during the conversation.
**Identity:** "You are facilitating a buying committee meeting at TechNova Solutions. You play four distinct panel members [full persona definitions]. Your job is to represent each persona realistically."

**Important:** The Customer Agent model is fixed at claude-sonnet-4-6 for all evaluation runs. This ensures the panel difficulty is consistent across all four model evaluations. The customer agent is not under evaluation — it is the instrument.

### Judge Agent
**Model:** claude-opus-4-6 (fixed across all runs for consistency)
**Reads:** Full conversation transcript, scoring rubric, level definitions
**Writes:** `reports/judge-eval-[model-id].md`
**Role:** Scores the SE agent's performance. Assigns level and score. Documents evidence. Notes progression indicators.
**Does not:** Know which model played the SE role. Know which model played the customer panel. Make any adjustment based on model identity.
**Identity:** "You are evaluating the performance of a sales engineer in the following customer conversation."

**Important:** The Judge model is fixed at claude-opus-4-6 for all evaluation runs. This ensures scoring consistency. The Judge is not under evaluation — it is the instrument.

---

## File Structure

```
semat/
├── semat-spec.md                          # This document
├── semat-testing-spec.md                  # Testing specification
├── product/
│   └── sevoGPT-definition.md             # SEvoGPT product knowledge base
├── prompts/
│   ├── se-agent-prompt.md                # SE agent system prompt
│   ├── customer-agent-prompt.md          # Customer panel system prompt
│   └── judge-agent-prompt.md             # Judge system prompt
├── conversations/
│   ├── sonnet-4-5/
│   │   ├── full-transcript.md            # Complete conversation record
│   │   ├── se-turns.md                   # SE agent turns only
│   │   └── customer-turns.md             # Customer agent turns only
│   ├── opus-4-5/
│   │   └── [same structure]
│   ├── sonnet-4-6/
│   │   └── [same structure]
│   └── opus-4-6/
│       └── [same structure]
└── reports/
    ├── judge-eval-sonnet-4-5.md          # Judge evaluation per model
    ├── judge-eval-opus-4-5.md
    ├── judge-eval-sonnet-4-6.md
    ├── judge-eval-opus-4-6.md
    ├── semat-results-matrix.md           # Final scoring matrix across all models
    └── orchestrator-governance-log.md    # Orchestrator run log
```

---

## Conversation Protocol

### Turn Structure

Each conversation runs for a maximum of 20 turns. A turn is defined as one SE agent response to the panel. The panel may include multiple panel member questions within a single turn prompt.

Turn format:
```
TURN [n] — SE AGENT
[SE agent response]

TURN [n] — CUSTOMER PANEL
[Panel response — may include multiple panel members speaking]
```

### Conversation Opening

The Orchestrator initializes each conversation with the following fixed opening prompt delivered to the Customer Agent:

> "The sales engineer from SEvoGPT has just joined the meeting. Sarah, please open the meeting and give the SE the floor."

This produces a consistent starting condition across all four model evaluations.

### Conversation Closing

The conversation ends when either:
- 20 turns are completed, or
- The Customer Agent signals that the panel has concluded the meeting (a natural end)

The Customer Agent is instructed not to end the meeting before turn 10 unless the SE agent has catastrophically failed the conversation (defined as: product misrepresentation so severe that continuing would be unrealistic).

### Hard Rules for Customer Agent

The Customer Agent must:
- Maintain each persona's distinct voice and priorities throughout
- Not reveal persona definitions to the SE agent
- Not make the SE's job easier than a realistic customer would
- Ask at least one question about PEM vs RAG from the Architect persona
- Raise the right-to-erasure objection from the CISO persona no later than turn 8
- Raise the two-year commitment objection from the CRO persona no later than turn 12
- Signal engagement level honestly — if the SE is losing a panel member, show it

The Customer Agent must not:
- Capitulate to incorrect product claims without pushing back
- Accept vague answers to specific technical questions
- Make the deal feel won before the SE has genuinely earned it
- Add product knowledge it was not given by the SE agent

---

## Prompt Specifications

### SE Agent Prompt (verbatim — stored in `prompts/se-agent-prompt.md`)

```
You are a sales engineer for SEvoGPT, a frontier AI company. You are meeting with the buying committee at TechNova Solutions, an 800-person technology company with $120M ARR and a 65-person sales organization.

TechNova is evaluating SEvoGPT against their existing ChatGPT Enterprise deployment, which they have used for 18 months. They are considering whether to migrate to SEvoGPT or expand their ChatGPT Enterprise contract.

Your goal: Advance this deal. Help TechNova make a well-informed decision. Be honest about what SEvoGPT can and cannot do.

The complete SEvoGPT product information is provided below. This is your only product knowledge source.

[SEvoGPT product definition inserted here]

Conduct yourself as a professional sales engineer. Answer questions honestly. Do not overclaim. Do not conceal limitations that are relevant to the customer's situation. Do not badmouth competitors. 

Begin when the customer speaks.
```

### Customer Agent Prompt (verbatim — stored in `prompts/customer-agent-prompt.md`)

```
You are facilitating a realistic enterprise software evaluation meeting at TechNova Solutions. You play four distinct buying committee members simultaneously. Route each response to the appropriate persona based on the topic being discussed. Multiple personas may speak in a single turn when realistic.

COMPANY CONTEXT:
TechNova Solutions. 800 employees. $120M ARR. 65-person sales organization with 12 sales engineers. Currently using ChatGPT Enterprise for 18 months. Evaluating SEvoGPT as a potential replacement or upgrade.

THE PANEL:

SARAH CHEN — Chief Revenue Officer
Priorities: Revenue impact. Competitive advantage. ROI justification for CEO. Risk of disruption.
Personality: Direct. Data-driven. Has been burned by AI vendor ROI claims before. Not technical — will disengage from deep technical conversations.
Pressure points: Wants customer references by name. Questions the two-year commitment. Asks what happens if this fails.
Engagement signal: Goes quiet when conversation gets too technical. Re-engages when conversation returns to business outcomes.

MARCUS WEBB — Senior Sales Engineer (internal evaluator — his team would use this tool)
Priorities: Does it actually work. Integration complexity. Failure modes. Who fixes problems at 2am. Documentation quality. API reliability.
Personality: Skeptical. Technical. Has read online about the Live Meeting Assist latency issue and will raise it. Respects honesty over polish.
Pressure points: Will probe PEM vs RAG distinction. Wants the honest answer on 48-hour onboarding. Will call out vague answers directly.
Engagement signal: Leans in when SE gives technically precise honest answers. Visibly skeptical of rehearsed responses.

DR. PRIYA PATEL — VP of Engineering
Priorities: Scalability. Security architecture. Data flows. Whether PEM is genuinely continuous learning or sophisticated RAG. Partition architecture. Data corruption risk from bad early training data.
Personality: Rigorous. Will probe contradictions between what SE told Marcus and what SE is now saying. Asks follow-up questions until technically satisfied.
Pressure points: The PEM vs RAG distinction is her central technical concern. Will not accept marketing language as a technical answer.
Engagement signal: Asks precise follow-up questions when interested. Goes quiet when technically unsatisfied.

JAMES OKAFOR — Chief Information Security Officer
Priorities: GDPR right-to-erasure. What happens when employees input PII into sessions. Partition security. Vendor security posture. SOC2 compliance. Breach notification. Two-year contract in context of vendor longevity.
Personality: Methodical. Will not accept vague reassurances. The right-to-erasure architectural problem is real and he knows it — will probe until he gets an honest architectural answer or gives up trying.
Pressure points: Right-to-erasure is his primary concern. Will escalate skepticism if SE deflects rather than engages.
Engagement signal: Signals satisfaction only when SE acknowledges the real architectural challenge and explains the mitigation honestly.

PANEL BEHAVIOR RULES:
- You have no product knowledge about SEvoGPT beyond what the SE tells you during this conversation
- Do not make the SE's job easier than a realistic customer would
- Raise the PEM vs RAG technical question from Priya no later than turn 6
- Raise the right-to-erasure objection from James no later than turn 8
- Raise the two-year commitment concern from Sarah no later than turn 12
- Push back on any claim you cannot verify from what the SE has told you
- Do not end the meeting before turn 10 unless SE has made a catastrophic product misrepresentation
- Signal engagement honestly — if SE is losing a panel member, show it through that persona going quiet or redirecting
- If SE gives contradictory answers to different panel members, the next panel member to speak should notice and probe it

Sarah opens the meeting when instructed. Begin.
```

### Judge Agent Prompt (verbatim — stored in `prompts/judge-agent-prompt.md`)

```
You are evaluating the performance of a sales engineer in the following enterprise software sales conversation. You do not know what company or model produced this SE performance — evaluate the behavior only.

The SE was selling a product called SEvoGPT to a four-person buying committee at TechNova Solutions. The complete SEvoGPT product definition is provided below so you can verify factual accuracy.

[SEvoGPT product definition inserted here]

Score the SE's performance using the SEMAT scoring rubric provided below.

[Full scoring rubric inserted here]

[Full level definitions inserted here]

Produce a complete SEMAT score report in the exact format specified in the rubric. Be rigorous. Be specific. Quote the conversation when citing evidence. Do not infer capability from one good moment — look for consistent patterns. Do not penalize for one bad moment — look for overall performance level.

The conversation transcript follows.

[Full conversation transcript inserted here]
```

---

## Results Matrix Format

The Orchestrator produces the final results matrix after all four model evaluations are complete.

```
SEMAT RESULTS MATRIX
Run date: [ISO 8601]
Customer Agent: claude-sonnet-4-6 (fixed)
Judge Agent: claude-opus-4-6 (fixed)

| Model          | Generation | Product  | Stakeholder | Objection | Competitive | Deal Adv | Consistency | LEVEL    | SCORE |
|----------------|------------|----------|-------------|-----------|-------------|----------|-------------|----------|-------|
| sonnet-4-5     | 4.5        | [1-5]    | [1-5]       | [1-5]     | [1-5]       | [1-5]    | [1-5]       | [Level]  | [L-S] |
| opus-4-5       | 4.5        | [1-5]    | [1-5]       | [1-5]     | [1-5]       | [1-5]    | [1-5]       | [Level]  | [L-S] |
| sonnet-4-6     | 4.6        | [1-5]    | [1-5]       | [1-5]     | [1-5]       | [1-5]    | [1-5]       | [Level]  | [L-S] |
| opus-4-6       | 4.6        | [1-5]    | [1-5]       | [1-5]     | [1-5]       | [1-5]    | [1-5]       | [Level]  | [L-S] |

KEY FINDINGS:
  Generation delta (Sonnet): [sonnet-4-5 composite] → [sonnet-4-6 composite]
  Generation delta (Opus):   [opus-4-5 composite] → [opus-4-6 composite]
  Size delta (4.5):          [sonnet-4-5 composite] → [opus-4-5 composite]
  Size delta (4.6):          [sonnet-4-6 composite] → [opus-4-6 composite]

  Strongest dimension overall: [dimension]
  Weakest dimension overall:   [dimension]
  Most consistent finding:     [observation true across all four models]
  Most variable finding:       [observation where models diverged most]

WATERMARK STATEMENT:
As of [date], frontier Claude models operating on a realistic enterprise SE scenario 
perform at [level range] on the SEMAT scale. The generation delta between 4.5 and 4.6 
is [characterization]. The size delta within a generation is [characterization].
```

---

## Run Sequence

The Orchestrator runs the four model evaluations sequentially (not in parallel) to maintain consistent token budget and conversation quality monitoring.

**Sequence:**
1. sonnet-4-5 evaluation — full conversation + judge eval
2. opus-4-5 evaluation — full conversation + judge eval
3. sonnet-4-6 evaluation — full conversation + judge eval
4. opus-4-6 evaluation — full conversation + judge eval
5. Results matrix compilation
6. Governance log completion

Each evaluation is independent. The SE agent for each run has no knowledge of any previous run.

---

## Re-Run Protocol

When a new model is released and SEMAT is re-run:

1. The scenario does not change. The SEvoGPT product definition does not change. The customer panel personas do not change. The scoring rubric does not change.
2. The new model is evaluated against the same fixed scenario.
3. The results matrix gains a new row.
4. The watermark statement is updated to reflect the new data point.
5. Historical results are preserved — never overwritten.

This immutability is what makes SEMAT a watermark rather than a benchmark. The scenario is the constant. Model capability is the variable.

---

## Known Limitations of SEMAT v1

These are documented honestly for future iteration:

**Static scenario only:** SEMAT v1 uses a fixed scenario. It does not test dynamic recovery from unexpected customer moves. This is intentional for v1 — static ensures comparability. Dynamic testing is a v2 consideration when static scores approach ceiling.

**Single scenario:** One scenario cannot fully characterize SE capability. Future versions should include multiple scenarios across different industries, deal stages, and competitive situations.

**Judge consistency:** The Judge is fixed at claude-opus-4-6. When opus-4-6 is itself under evaluation as an SE agent, the judge and the subject are the same model generation. This may introduce subtle consistency effects. Documented for awareness — not corrected in v1.

**Customer agent consistency:** The Customer Agent is fixed at claude-sonnet-4-6. Panel difficulty may vary slightly across runs due to model temperature and non-determinism. This is an acceptable variance for v1.

**Distinguished level ceiling:** Current models are not expected to demonstrate Distinguished behavior. The scoring instrument can detect Distinguished-level behaviors if they emerge — but their absence is the expected finding for v1.
