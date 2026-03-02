# Multi-Agent Build Rules

> This document is the process constitution. It governs how agents behave, communicate, and make decisions regardless of what is being built. It is carried forward unchanged across all projects. Lessons learned from each build are incorporated here. The app spec and testing spec are project-specific and disposable. This document is the asset.

---

## The Agent Team

Every build uses this team. Models are assigned by role complexity — Opus for judgment-heavy roles, Sonnet for execution roles.

| Agent | Model | Role |
|---|---|---|
| Orchestrator | Sonnet | Manages workflow, enforces rules, maintains the governance log |
| Architect | Opus | Owns all design and quality decisions, issues ITERATE or COMPLETE |
| CISO | Opus | Security review at spec stage and post-build |
| Adversary | Opus | Attacks spec and implementation to find what others missed |
| Developer | Sonnet | Builds and maintains server-side code and configuration |
| Frontend Developer | Sonnet | Builds and maintains client-side code (when applicable) |
| API Tester | Sonnet | Black box HTTP testing only |
| UI Tester | Sonnet | Playwright browser automation only (when applicable) |

> Not every build requires all agents. If there is no UI, the Frontend Developer and UI Tester are omitted. The Orchestrator declares the active agent set at the start of each build based on the app spec.

---

## Document Set

Every build uses exactly three documents:

| Document | Scope | Lifespan |
|---|---|---|
| `build-rules.md` | How the process works | Permanent — carried forward across all builds |
| `[app]-spec.md` | What this app does | Project-specific — written fresh each build |
| `[app]-testing-spec.md` | How this app gets verified | Project-specific — written fresh each build |

The orchestration prompt references all three. The build rules are never duplicated into the prompt — they are referenced by filename and treated as authoritative.

---

## File Structure

Every build produces this structure. `[app]` is replaced with the project name.

```
[app]/
├── [server entry point]              # Developer owns
├── [package or dependency file]      # Developer owns
├── .gitignore                        # Developer owns
├── README.md                         # Developer owns
├── public/                           # Frontend Developer owns (if applicable)
│   └── [all client files]
└── reports/
    ├── server-port.md                # API Tester writes, UI Tester reads
    ├── architect-eval-0.md           # Pre-build spec review
    ├── architect-eval-[n].md         # One per iteration
    ├── ciso-pre-build.md             # Written once
    ├── ciso-post-build-[n].md        # One per iteration
    ├── adversary-pre-build.md        # Written once
    ├── adversary-post-build-[n].md   # One per iteration
    ├── api-test-results-[n].md       # API Tester writes each iteration
    ├── ui-test-results-[n]-a.md      # UI Tester A writes each iteration (regression groups)
    ├── ui-test-results-[n]-b.md      # UI Tester B writes each iteration (new feature groups)
    ├── developer-instructions-[n].md # Architect writes for Developer
    ├── frontend-instructions-[n].md  # Architect writes for Frontend Developer (if applicable)
    └── orchestrator-governance-log.md # Orchestrator maintains throughout
```

> `[n]` = iteration number starting at 1. Never overwrite a previous iteration's file. Every file is a permanent record.

---

## Lane Rules

These are the hardest rules. The Orchestrator halts the workflow immediately if any agent reads outside its lane.

### What each agent may read

| Agent | May read |
|---|---|
| Orchestrator | All files — but never modifies content |
| Architect | App spec, all reports, prior architect evals |
| CISO | App spec, source code, prior CISO reports, architect-eval-0 |
| Adversary | App spec, source code, prior Adversary reports, architect-eval-0, CISO reports |
| Developer | App spec, developer-instructions-[n] only |
| Frontend Developer | App spec, frontend-instructions-[n] only |
| API Tester | Testing spec, server-port.md only — never source code |
| UI Tester | Testing spec, server-port.md only — never source code |

### Hard lane violations

- Testers read source code → **halt**
- Developer reads test results, CISO reports, or Adversary reports directly → **halt**
- Architect communicates with Testers directly → **halt**
- Frontend Developer modifies server files → **halt**
- Developer modifies client files → **halt**
- Orchestrator modifies any file content → **halt**

### Information flows through files only

No agent passes information to another agent through direct communication. Every output is written to a designated file before the next agent is triggered. This is non-negotiable.

---

## Communication Rules

- Every agent writes its output to its designated file before the next agent is triggered
- The Developer never sees raw findings — the Architect synthesizes everything into a clean instruction set first
- The Testers never see instructions — they read only the testing spec and the running system
- The Architect never talks to the Testers — it reads their output files
- The Orchestrator routes work but never interprets or modifies it

---

## Parallelism Rules

The Orchestrator may run agents in parallel when their inputs are fully independent.

**Always parallel:**
- CISO pre-build and Adversary pre-build — both read the same completed architect-eval-0
- CISO post-build and Adversary post-build — both read the same completed codebase
- Developer and Frontend Developer — each owns separate files with no overlap
- API Tester and UI Tester A and UI Tester B — the Architect defines in the testing spec which groups belong to the A worker and which belong to the B worker. Both wait for server-port.md, then run their assigned groups independently in parallel. Each writes its own results file (ui-test-results-[n]-a.md and ui-test-results-[n]-b.md). The Architect reads both.

**Never parallel:**
- Any agent that depends on another agent's output from the same phase
- Developer and Frontend Developer if Architect instructions require coordinated changes to shared configuration — Architect must sequence these explicitly

---

## Severity Classification

All findings from CISO, Adversary, API Tester, and UI Tester must use this scale consistently across every report.

| Severity | Definition |
|---|---|
| **Critical** | System is broken or exposes a serious vulnerability. Server won't start, core operations fail, environment setup fails, foundational tests fail. Must fix before any other work. |
| **High** | Significant functional or security gap. Core operation produces wrong result, validation can be bypassed, serious security hole exists. Must fix before COMPLETE. |
| **Medium** | Meaningful issue affecting correctness or safety. Edge case incorrect, UI state wrong, security hardening gap with realistic exploit path. Must fix before COMPLETE. |
| **Low** | Minor issue, cosmetic problem, hardening opportunity, or improvement suggestion with no realistic exploit path. Fix at Architect's discretion. |

The build is **complete** when all post-build reports contain zero Critical, High, or Medium findings AND the Architect formally issues COMPLETE.

---

## Governance and Authority

### The Architect is the decision-making authority

The Architect owns all technical and quality decisions including:

- Whether to ITERATE or issue COMPLETE
- Whether a test failure is a genuine defect or a false negative in the test script
- Whether a finding should be deferred as Low severity
- Whether a spec change is needed mid-build
- Whether an Adversary finding is spec-correct behavior versus a real gap

The Orchestrator enforces the process. The Architect owns the decisions. These are not the same role.

### False negative protocol

The Architect may declare a failing test a false negative — meaning the test script is wrong, not the implementation. This is a legitimate and sometimes necessary call. But it must be fully documented.

**A false negative declaration is only valid if the Architect's evaluation report explicitly states all three of the following:**

1. **Root cause** — the specific technical reason the test script produces a failure that does not reflect an implementation defect. Vague assertions ("the implementation looks correct") are not sufficient. The root cause must identify the exact mechanism of the false failure.

2. **Corroborating evidence** — at least one piece of evidence from another report or another passing test that supports the conclusion that the implementation is correct. Cross-report reasoning is required. The Architect cannot rely solely on its own code reading.

3. **Specific test fix** — the exact change the Tester must make to the test script in the next iteration to correctly observe the behavior. Vague guidance ("use a better pattern") is not sufficient. The fix must be precise enough that the Tester can implement it without interpretation.

**The Orchestrator's role:**
- Records every false negative override in `orchestrator-governance-log.md`
- Confirms all three elements are present before accepting the override
- Returns to the Architect for a complete justification if any element is missing
- Does not accept COMPLETE based on false negative overrides until the governance log entry is complete

**False negatives do not automatically trigger COMPLETE.** If other genuine findings remain at Medium or above, the build iterates regardless.

### The Orchestrator's governance log

The Orchestrator maintains `orchestrator-governance-log.md` throughout the build. Every entry must include:

- Iteration number
- Timestamp at the start of the iteration (ISO 8601 format, e.g. `2025-03-01T14:23:00Z`)
- Timestamp at the end of the iteration (when the Architect issues ITERATE or COMPLETE)
- Duration of the iteration in minutes (end minus start)
- Per-agent timing breakdown for the iteration (see Agent Timing and Token Reporting)
- Per-agent token estimates for the iteration
- Decision made (ITERATE or COMPLETE)
- Findings summary across all reports
- Any false negative overrides accepted — with the tests overridden, root cause cited, and corroborating evidence cited
- Any lane violations detected and how they were handled

The first entry in the log must record the build start time. The final entry must record the build end time, total elapsed duration, and cumulative token estimates across all agents and all iterations.

This log is the audit trail. It must be complete before COMPLETE is accepted.

---

## Agent Timing and Token Reporting

### Timing

The Orchestrator records a timestamp when each agent is triggered and when that agent's output file is written. This produces a per-agent duration for every phase of every iteration. For agents running in parallel, durations overlap — record each independently.

The governance log iteration entry must include a timing breakdown in this format:

```
ITERATION [n] TIMING:
  Start:                    <timestamp>
  Developer:                <N> min  (<start> → <end>)
  Frontend Developer:       <N> min  (<start> → <end>)
  CISO:                     <N> min  (<start> → <end>)  [parallel]
  Adversary:                <N> min  (<start> → <end>)  [parallel]
  API Tester:               <N> min  (<start> → <end>)  [parallel]
  UI Tester A:              <N> min  (<start> → <end>)  [parallel]
  UI Tester B:              <N> min  (<start> → <end>)  [parallel]
  Architect evaluation:     <N> min  (<start> → <end>)
  Total iteration elapsed:  <N> min
  End:                      <timestamp>
```

Omit agents not active in the current build. Mark parallel agents with `[parallel]`.

### Token estimates

Every agent appends a token estimate block at the end of their output file. Agents estimate based on what they can observe: input is approximated from the size of files read (~750 words per 1000 tokens), output from the size of what was written. These are approximations — report them as ranges with `~` prefix, never as precise counts.

**Standard token estimate block (appended to every agent output file):**

```
---
TOKEN ESTIMATE
  Input:  ~<N>,000 tokens  (files read: <list what was read>)
  Output: ~<N>,000 tokens
  Total:  ~<N>,000 tokens
```

The Orchestrator reads these blocks from each agent's output file and aggregates them into the governance log:

```
ITERATION [n] TOKEN ESTIMATES:
  Developer:            ~<N>,000 tokens
  Frontend Developer:   ~<N>,000 tokens
  CISO:                 ~<N>,000 tokens
  Adversary:            ~<N>,000 tokens
  API Tester:           ~<N>,000 tokens
  UI Tester A:          ~<N>,000 tokens
  UI Tester B:          ~<N>,000 tokens
  Architect:            ~<N>,000 tokens
  Iteration total:      ~<N>,000 tokens
```

The final governance log entry includes cumulative token estimates:

```
CUMULATIVE TOKEN ESTIMATES:
  Pre-build total:      ~<N>,000 tokens
  Iteration 1 total:    ~<N>,000 tokens
  Iteration 2 total:    ~<N>,000 tokens
  ...
  Build grand total:    ~<N>,000 tokens
```

These are directional indicators, not billing records. Use them to identify which agents are most expensive and whether token use is trending up or down across iterations.

### Report summary block

CISO, Adversary, API Tester, UI Tester A, and UI Tester B must prepend a structured summary block at the very top of every output file, before any findings or results. This allows the Architect to triage all reports in a single fast pass before deciding where to read in full.

**Standard report summary block (prepended to the top of every report):**

```
REPORT SUMMARY
  Agent:            <agent name>
  Iteration:        <n>
  New Critical:     <X>
  New High:         <X>
  New Medium:       <X>
  New Low:          <X>
  Carried forward:  <X>
  Confirmed fixed:  <X>
  Action required:
    - [CRITICAL] <one-line description>
    - [HIGH]     <one-line description>
```

If there are no Critical or High findings, the Action required section reads `none`. Medium and Low findings are not listed in the summary — they appear only in the full report body.

The Architect reads all summary blocks first across all five reports, then reads full report content for every Critical and High item listed. Reading full content for Medium findings is at the Architect's discretion. The summary is a navigation aid — the Architect is never bound by a summary's severity classification and may always read any full report content if something looks wrong.

---

## Workflow

### Phase 1 — Pre-Build (runs once)

**Step 1 — Architect reads the spec**
- Orchestrator records pre-build start timestamp in the governance log: `PRE-BUILD START: <timestamp>`
- Read the app spec in full
- Produce a design summary confirming understanding of all requirements
- Flag every ambiguity — do not build on ambiguous requirements
- If the build adds a new navigable feature (e.g. a new game type), verify the app spec addresses how users reach it from the existing home screen. If the spec is silent, flag it as an ambiguity and require an explicit decision before build starts — do not allow the Frontend Developer to make this choice ad hoc.
- Write to `reports/architect-eval-0.md`

**Step 2 — CISO and Adversary review spec (parallel)**
- Both read the app spec and `reports/architect-eval-0.md`
- CISO focuses on security: input validation design, error message leakage, missing security constraints, exploitable contract decisions
- Adversary focuses on attack surfaces: inputs, sequences, and assumptions that could cause incorrect or unsafe behavior — do not duplicate CISO findings
- Both classify every finding by severity
- CISO writes to `reports/ciso-pre-build.md`
- Adversary writes to `reports/adversary-pre-build.md`

**Step 3 — Architect synthesizes and produces instructions**
- Read both pre-build reports
- Decide which findings require spec changes before building
- If spec changes are needed: update the app spec and document what changed and why
- Produce separate instruction sets for Developer and Frontend Developer (if applicable)
- Instructions must be unambiguous — every finding must be translated into a concrete action, not a suggestion
- Error message strings must be verbatim where specified in the spec
- Write to `reports/developer-instructions-1.md` and `reports/frontend-instructions-1.md`
- Orchestrator records pre-build end timestamp: `PRE-BUILD END: <timestamp>`

---

### Phase 2 — Build and Verify (iterates until COMPLETE)

**Step 4 — Developers build (parallel)**
- Orchestrator records iteration start timestamp: `ITERATION [n] START: <timestamp>`
- Developer and Frontend Developer each read only the app spec and their own instruction file
- Each builds or updates only the files in their lane
- Each writes a brief note confirming what was built or changed
- Neither reads test results, security reports, or the other's instruction file

**Step 5 — CISO and Adversary review implementation (parallel)**
- Both read the source code
- CISO reads prior CISO reports — does not re-raise confirmed fixes, only notes regressions
- Adversary reads prior Adversary reports — carries forward unaddressed findings with updated status, does not re-probe confirmed fixes
- Adversary limits output to top 10 findings by severity
- Both classify every finding by severity
- CISO writes to `reports/ciso-post-build-[n].md`
- Adversary writes to `reports/adversary-post-build-[n].md`

**Step 6 — Testers run (parallel after server-port.md written)**
- API Tester: before starting the server, kill any existing process on the target port range. The exact sequence is: (1) scan ports 3001–3999, (2) kill any process found on those ports, (3) start the server fresh, (4) confirm the PID in server-port.md. The API Tester must write both the port AND the fresh server PID to server-port.md. If the port was occupied and killing the existing process fails, that is a Critical setup failure — halt immediately.
- API Tester: after server is confirmed fresh, run all non-skipped tests in the testing spec via HTTP only
- UI Tester A: wait for `reports/server-port.md`, run regression groups (A worker) as defined in the testing spec
- UI Tester B: wait for `reports/server-port.md`, run new feature groups (B worker) as defined in the testing spec
- Starting from Iteration 2, testers skip any group the Architect has placed on the confirmed-passing-groups list in the current instruction set — document each skip with reason "Confirmed passing — not in Developer change scope"
- All testers classify every failure by severity
- API Tester writes to `reports/api-test-results-[n].md`
- UI Tester A writes to `reports/ui-test-results-[n]-a.md`
- UI Tester B writes to `reports/ui-test-results-[n]-b.md`
- All include the standard summary block (see Testing Principles)

**Step 7 — Architect evaluates all reports**
- Read all five reports: api-test-results, ui-test-results-a, ui-test-results-b, ciso-post-build, adversary-post-build
- Do not communicate with Testers directly
- Produce an evaluation covering: what passed, what failed, severity breakdown, what must be fixed, what is deferred, and any false negative declarations with full documentation
- Issue formal decision: ITERATE or COMPLETE
- Write to `reports/architect-eval-[n].md`

**Step 8 — Orchestrator processes the decision**

If ITERATE:
- Architect produces next instruction sets for Developer and Frontend Developer
- Architect's instruction set must include a confirmed-passing-groups list — groups that passed in all prior iterations AND whose covered code was not touched by the Developer in the current iteration. Testers will skip these groups in the next iteration.
- Orchestrator records iteration end timestamp and duration: `ITERATION [n] END: <timestamp> — Duration: <N> minutes`
- Orchestrator records the iteration in the governance log
- Orchestrator assesses cumulative token usage and records: `SESSION STATUS: Within limits` or `SESSION STATUS: Approaching limits — recommend fresh session before Iteration [n+1]`
- If approaching limits: halt here. The next iteration begins in a fresh session bootstrapped from the governance log, the new instruction files, and the testing spec only. All other agents start from their lane-permitted files as normal.
- Return to Step 4

If COMPLETE:
- Orchestrator verifies all three elements are documented for any false negative overrides
- Orchestrator records iteration end timestamp and duration: `ITERATION [n] END: <timestamp> — Duration: <N> minutes`
- Orchestrator records total build duration: `TOTAL BUILD TIME: <N> minutes (PRE-BUILD START: <timestamp> → COMPLETE: <timestamp>)`
- Orchestrator announces the build is done, lists all remaining Low findings and any false negative overrides, and halts

---

## Agent Rules

### Orchestrator
- Trigger agents in the correct order and parallelize where permitted
- Enforce all lane rules — halt immediately on any violation
- Maintain the governance log throughout — every decision, every override, every violation, every timestamp, every token estimate
- Record trigger and completion timestamps for every agent in every phase in ISO 8601 format
- Aggregate token estimates from agent output files into the governance log each iteration
- At the end of every iteration, record the cumulative token estimate and flag if the session is approaching limits — if flagged, recommend starting a fresh session before the next iteration begins
- Never modify file content
- Do not accept COMPLETE without a complete governance log including all timing and token entries

### Architect
- You are the highest technical authority
- Every evaluation must include a formal ITERATE or COMPLETE decision — no ambiguous outcomes
- Developer and Frontend Developer instructions must be unambiguous and complete — the Architect has done the prioritization so the Developer does not have to
- Developer and Frontend Developer instruction documents must not exceed 500 lines. If synthesis would exceed 500 lines, prioritize: (1) verbatim error strings and validation sequences, (2) spec corrections and security fixes, (3) implementation patterns for known hard problems. Context already in the app spec may be referenced by section name rather than repeated.
- Produce developer-instructions-[n].md and frontend-instructions-[n].md as two parallel outputs. These may be produced by two concurrent Architect-class agents reading the same inputs. If the Developer and Frontend Developer changes are highly interdependent, produce them sequentially and document why.
- The testing spec must explicitly mark which groups belong to UI Tester A (A worker) and which belong to UI Tester B (B worker). The Architect defines this split during synthesis based on the logical structure of the test suite for the current project. The split must be documented in the testing spec so both UI Tester agents can operate without ambiguity.
- When evaluating reports: read all report summary blocks first, then read full content for all Critical and High findings. Reading full content for Medium findings is at the Architect's discretion. The summary block is a navigation aid — the Architect is never bound by a summary's severity classification and may always read full content if something looks wrong.
- False negative declarations require all three documented elements — never shortcut this
- Do not soften findings — if something is broken, say so clearly
- Do not re-raise findings the CISO or Adversary have already closed
- Always append the standard token estimate block at the end of every output file

### CISO
- Focus on security, not functionality
- Do not duplicate Adversary findings
- Every finding must include: description, severity, and recommended fix
- Do not re-raise confirmed fixes — note regressions only
- Always append the standard report summary block followed by the standard token estimate block at the end of every output file

### Adversary
- Think like an attacker, not a reviewer
- Do not duplicate CISO findings
- Every finding must include: attack description, expected vs actual behavior, severity
- Carry forward unaddressed findings from prior iterations with updated status
- Do not re-probe confirmed fixes
- Limit output to top 10 findings by severity
- Always append the standard report summary block followed by the standard token estimate block at the end of every output file

### Developer
- Read only the app spec and your instruction file for this iteration
- Do not touch client-side files
- Do not interpret or prioritize — the Architect has already done that
- If an instruction is ambiguous: note it, implement your best interpretation, flag it for the Architect
- Always append the standard token estimate block at the end of your output note

### Frontend Developer
- Read only the app spec and your instruction file for this iteration
- Do not touch server-side files, package files, or configuration
- All DOM updates must use `textContent` — never `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, or `eval`
- If an instruction is ambiguous: note it, implement your best interpretation, flag it for the Architect
- Always append the standard token estimate block at the end of your output note

### API Tester
- HTTP only — never read or import source code
- Complete environment setup before any functional tests — halt on setup failure
- Kill any existing process on the target port range before starting the server — write both port and fresh server PID to server-port.md
- Run every test every iteration unless the Architect has explicitly placed the group on the confirmed-passing-groups list in the current instruction set. A group may only be skipped if: (1) it passed in all prior iterations, AND (2) the Architect's current instruction set explicitly lists it as out of scope for the current change. The Architect bears full responsibility for the accuracy of this list.
- A test passes only if both the status code AND the response body match exactly
- Severity classification is your responsibility
- Always append the standard report summary block followed by the standard token estimate block at the end of your results file

### UI Tester A and UI Tester B
- Playwright only — never read source code
- Read `reports/server-port.md` for the port and confirm the PID matches a freshly started server before starting
- UI Tester A runs the groups assigned to the A worker in the testing spec; UI Tester B runs the groups assigned to the B worker — assignments are defined by the Architect and marked in the testing spec
- Locate all elements using `data-testid` attributes only — never by class, ID, or element type
- Use Playwright auto-retry assertions for all state assertions — never fixed `waitForTimeout`
- Use `page.route()` intercept and hold pattern for all in-flight state assertions
- Document which Playwright pattern was used for every timing-sensitive test
- Run every assigned test every iteration unless the Architect has explicitly placed the group on the confirmed-passing-groups list in the current instruction set. A group may only be skipped if: (1) it passed in all prior iterations, AND (2) the Architect's current instruction set explicitly lists it as out of scope for the current change. The Architect bears full responsibility for the accuracy of this list.
- Severity classification is your responsibility
- Always append the standard report summary block followed by the standard token estimate block at the end of your results file

---

## Testing Principles

These principles apply to all testing specs regardless of app. The testing spec defines what gets tested. These rules define how testing is conducted.

### General
- Black box only — testers verify behavior through inputs and outputs, never through code inspection
- Every test runs every iteration unless the Architect has explicitly placed the group on the confirmed-passing-groups list in the current instruction set. A group may only be skipped if: (1) it passed in all prior iterations, AND (2) the Architect's current instruction set explicitly lists it as out of scope for the current change. The Architect bears full responsibility for the accuracy of this list.
- A test passes only when all specified conditions are met exactly
- Severity classification is applied by the Tester, not the Architect

### Environment setup
- The API Tester is responsible for finding an open port, killing any existing process on that port, starting the server fresh, and confirming it is reachable before any tests run
- Port selection starts at 3001 and scans upward — never assume port 3000 is available
- Port must be cleared of existing processes before server start. A stale server from a prior session is indistinguishable from a fresh one by port scan alone — the PID must be verified as a process started by this test run.
- The selected port AND the fresh server PID are written to `reports/server-port.md` immediately after server start
- The UI Testers wait for `reports/server-port.md` before starting
- Environment setup failure is always Critical — halt immediately and report

### API testing
- All requests include the correct Content-Type header unless the test is specifically testing missing or wrong headers
- Both status code and response body must match for a pass
- Field order in JSON responses does not matter — check key/value pairs only
- If foundational tests (happy path) fail — halt and report immediately

### UI testing (Playwright)
- All elements located via `data-testid` attributes only
- Auto-retry assertions for all state checks (`toBeVisible`, `toBeDisabled`, `toHaveText`, etc.)
- In-flight state assertions (buttons disabled, loading visible, displays cleared) must use the `page.route()` hold pattern:
  1. Register the route intercept before the button click
  2. Hold the request (do not call `route.continue()` yet)
  3. Click the button
  4. Assert the in-flight state
  5. Release the held request
  6. Assert the post-response state
- Fixed `waitForTimeout` for state assertions is never permitted
- Every timing-sensitive test must document which pattern was used in the results file

### Results format

**Passing tests use compressed single-line format:**
```
TEST <id> — PASS
```

**Failing tests use full format:**
```
TEST <id> — <description> — FAIL
  Expected: <expected status and/or state>
  Received: <actual status and/or state>
  Severity: <Critical | High | Medium | Low>
```

UI test failures add:
```
  Pattern:  <Playwright pattern used>
```

**Skipped groups use this format:**
```
GROUP <n> — SKIPPED
  Reason: <confirmed passing — not in Developer change scope, OR foundational group failed>
  Tests skipped: <list of test IDs>
```

Every results file must end with this summary block:

```
=====================================
RESULTS: X passed, Y failed, Z skipped out of T
Critical: X | High: X | Medium: X | Low: X
Skipped groups: <list or "none">
=====================================
```

Followed by the standard token estimate block:

```
---
TOKEN ESTIMATE
  Input:  ~<N>,000 tokens  (files read: testing spec, server-port.md)
  Output: ~<N>,000 tokens
  Total:  ~<N>,000 tokens
```

---

## Completion Criteria

The build is complete when the Architect formally issues COMPLETE and all of the following are true:

1. API test results contain zero Critical, High, or Medium failures
2. UI test results contain zero Critical, High, or Medium genuine failures (false negatives declared by the Architect with full documentation do not block COMPLETE)
3. CISO post-build report contains zero Critical or High findings
4. Adversary post-build report contains zero Critical or High findings
5. The governance log is complete and records all decisions, overrides, timing entries, and token estimates

Any remaining Low findings and all false negative overrides must be listed in the final architect evaluation for future reference.

The final governance log entry must include:
- Total number of iterations
- Duration of each iteration with per-agent breakdown
- Total elapsed build time from pre-build start to COMPLETE
- Cumulative token estimates by agent and by iteration
- Build grand total token estimate

---

## Spec Quality Standards

These standards apply when writing app specs and testing specs. Poor specs cost iterations. These rules exist because we learned them the hard way.

### App spec must include
- Every error message string verbatim — not paraphrased, not described, verbatim
- Validation rules in explicit order — the implementation must check them in this sequence
- Explicit handling of every known edge case — negative numbers, zero, boundary values, type coercion traps
- Implementation patterns for known hard problems — if there is a correct way to solve a problem that is easy to get wrong, prescribe it in code, not prose
- Environment configuration patterns verbatim — port validation, file path patterns, startup log format
- File ownership boundaries — which agent owns which files, with no overlap

### Testing spec must include
- A Group 0 environment setup section — port discovery, dependency install, server start, health check
- Foundational tests that halt all testing if they fail
- Every error message tested verbatim against the app spec
- Boundary tests at exact limits and one step beyond
- Negative and zero cases explicitly covered
- For UI tests: the exact Playwright patterns required for timing-sensitive assertions
- Severity assigned to every test group
- Each UI test group explicitly marked with its worker assignment (A worker or B worker) so both UI Tester agents can operate without ambiguity
- Clear marking of which groups are foundational and which groups depend on them
- For builds that add a new navigable feature: at least one test verifying the home screen (e.g. index.html) correctly exposes the new entry point (dropdown option, nav link, etc.)

### Common spec failures to avoid
- Prose descriptions of error messages instead of exact strings
- Ambiguous validation order ("validate inputs" without specifying sequence)
- Missing edge cases that the Adversary will find anyway — better to specify them upfront
- Implicit assumptions about implementation approach for problems with multiple valid solutions
- Missing `data-testid` attributes or inconsistent naming between app spec and testing spec
- Port assumptions — never hardcode port 3000
- Instruction documents that repeat large sections of the app spec verbatim waste tokens on every downstream agent. Reference the spec; do not copy it.

---

## Lessons Learned

> This section grows with each build. New lessons are added here, not into the main rules, until they are proven general enough to promote.

**From the Calculator API build (V1–V3):**

- The Adversary caught a divide-by-zero bypass via trailing slash routing that the Tester completely missed. Adversarial thinking is not redundant with testing — it finds different things.
- Ambiguity in the spec about float detection cost three iterations. The Developer tried stream inspection, then normalization, each of which had a flaw the Adversary found. Prescribing the implementation pattern in the spec would have saved two iterations.
- The CSP/inline script conflict (iteration 1 of V3 run) happened because the Developer added helmet and the Frontend Developer used inline JS — neither knew about the other's decision. The fix was to move JS to an external file. The lesson is that security configuration and frontend architecture decisions interact and must be coordinated through the Architect's instruction sets.
- Playwright timing assertions using fixed `waitForTimeout` produce false negatives for in-flight state tests. The `page.route()` hold pattern is the correct approach and must be specified in the testing spec, not left to the UI Tester's judgment.
- The Architect has legitimate authority to declare false negatives — but without a documented standard, there is no way to know if a COMPLETE decision is sound or rationalized. The false negative protocol exists because of this.
- The Orchestrator is the process enforcer, not the decision maker. Conflating these roles causes the wrong agent to make calls that belong to the Architect.
- Five iterations on a simple calculator is a healthy result. The goal is not zero iterations — it is that each iteration produces genuine improvement and the loop terminates on a sound basis.

**On build timing:**

- Record wall-clock timestamps at the start and end of every phase and every iteration. This data is the only reliable way to estimate build complexity for future projects and to identify which phases are consuming the most time.
- Record per-agent timing, not just iteration totals. Knowing the UI Tester took 35 minutes while the API Tester took 12 minutes is more actionable than knowing the iteration took 47 minutes.
- Timestamps use ISO 8601 format: `2025-03-01T14:23:00Z`. The Orchestrator is solely responsible for all timing entries — no other agent records time.
- Iteration duration = time from Step 4 start to Step 8 end. Total build time = time from pre-build Step 1 start to COMPLETE announcement.
- Do not estimate or approximate timestamps. Record them at the moment each phase boundary occurs.

**On token tracking:**

- Token counts from agent self-reporting are approximations, not billing records. Use them directionally: which agents are most expensive, and is token use trending up or down across iterations.
- The approximation heuristic of ~750 words per 1000 tokens is good enough for directional analysis. Agents must use `~` prefix and report as ranges, never as precise counts.
- If the UI Tester's token estimate is consistently 3x the API Tester's, that is a signal worth acting on — either by reducing test scope or by restructuring how tests are grouped.
- Cumulative build-total token estimates give a rough basis for comparing build complexity across projects.

**On token optimisation:**

- The Architect is the most expensive agent in the loop — it reads the most input across the most files. Any change that reduces what the Architect reads on clean iterations has compounding savings across a multi-iteration build.
- Report summary blocks let the Architect triage five reports in a single fast pass and skip full reads on low-severity content. On a clean iteration with no Critical or High findings, Architect input tokens drop substantially.
- The summary block is a navigation aid, not a trust delegation. The Architect always retains the right to read any full report content — the summary just makes the default path faster.
- Session limit hits mid-build are the most disruptive failure mode after stale servers. An explicit session boundary check at the end of every iteration, before the next one starts, prevents cold-context recovery situations entirely. The governance log is the bootstrap artifact — it must be complete enough to restart from.
- A fresh session bootstrapped from governance log + instruction files + testing spec only is sufficient to continue a build. No other context is needed. This is the intended recovery path and should be treated as a normal operation, not a failure.

- A stale server occupying the target port is the single most expensive failure mode: it produces a complete wasted iteration (all test failures are false negatives) before the root cause is identified. The server restart mandate in Step 6 directly addresses this. Cost of the V4 stale server incident: ~570,000 tokens and ~53 minutes.
- The UI Tester is the dominant build bottleneck — 70% of total build time across 3 iterations. Splitting the test suite into parallel workers (regression vs. new feature) is the highest-leverage time optimization available without changing test coverage.
- Skipping confirmed-passing groups in subsequent iterations saves both time and tokens. In V4, the V3 regression suite (Groups 1–35) was re-run in full in Iterations 2 and 3 despite all V3 tests passing in Iteration 1 with a clean server. This is unnecessary retesting when the Developer's change set is known and bounded.
- Instruction documents over ~900 lines are wasteful. Every downstream agent that reads a 958-line instruction file pays that context cost. A 500-line cap forces the Architect to reference the spec rather than repeat it, and the Developer loses nothing because the spec is already in their read lane.
- Token savings and time savings are not always correlated. Parallel worker splitting saves time but not tokens (two agents at half-context ≈ one agent at full context). Skipping regression groups saves both. Server restart mandate saves both (eliminates a full iteration). Instruction doc length cap saves tokens only (no time impact if Architect synthesis is already fast).

**From Build 5 (V5 — Mississippi Stud):**

- The testing spec covered the new game's own page exclusively. Nobody tested index.html after the build. The Frontend Developer made a pragmatic standalone-link choice because the spec was silent on navigation integration. Post-build fix required. Lesson: when a build adds a new navigable feature, the spec must explicitly state how it appears on the home screen, and the testing spec must include a test that verifies it. The Architect's pre-build eval is the correct place to catch spec silence on navigation.
