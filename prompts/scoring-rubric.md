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
