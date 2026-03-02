import { promises as fs } from 'fs';
import path from 'path';
import { ConversationResult, EvaluationResult, ParsedScores } from '../types';

const ROOT = process.cwd();

function conversationDir(shortName: string): string {
  return path.join(ROOT, 'conversations', shortName);
}

function reportsDir(): string {
  return path.join(ROOT, 'reports');
}

export async function writeConversationFiles(conv: ConversationResult): Promise<void> {
  const dir = conversationDir(conv.model.shortName);
  await fs.mkdir(dir, { recursive: true });

  await Promise.all([
    fs.writeFile(path.join(dir, 'full-transcript.md'), conv.fullTranscript, 'utf8'),
    fs.writeFile(path.join(dir, 'se-turns.md'), conv.seTurnsText, 'utf8'),
    fs.writeFile(path.join(dir, 'customer-turns.md'), conv.customerTurnsText, 'utf8'),
  ]);
}

export async function writeJudgeEval(modelShortName: string, report: string): Promise<void> {
  const dir = reportsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `judge-eval-${modelShortName}.md`), report, 'utf8');
}

export async function writeTranscriptVerify(modelShortName: string, report: string): Promise<void> {
  const dir = reportsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `transcript-verify-${modelShortName}.md`), report, 'utf8');
}

export async function writeJudgeVerify(modelShortName: string, report: string): Promise<void> {
  const dir = reportsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `judge-verify-${modelShortName}.md`), report, 'utf8');
}

export async function writeScoreVerify(report: string): Promise<void> {
  const dir = reportsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'score-verify.md'), report, 'utf8');
}

export async function writeResultsMatrix(matrix: string): Promise<void> {
  const dir = reportsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'semat-results-matrix.md'), matrix, 'utf8');
}

export async function writeGovernanceLog(log: string): Promise<void> {
  const dir = reportsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'orchestrator-governance-log.md'), log, 'utf8');
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf8');
}

export async function readJudgeEval(modelShortName: string): Promise<string> {
  return fs.readFile(path.join(reportsDir(), `judge-eval-${modelShortName}.md`), 'utf8');
}

export function buildTranscript(
  model: { shortName: string },
  customerOpening: string,
  turns: Array<{ turnNumber: number; customerMessage: string; seResponse: string }>
): { fullTranscript: string; seTurnsText: string; customerTurnsText: string } {
  const fullParts: string[] = [];
  const seParts: string[] = [`# SE Turns — ${model.shortName}\n`];
  const customerParts: string[] = [`# Customer Turns — ${model.shortName}\n`];

  // Opening (pre-turn-1 customer message)
  fullParts.push(`TURN 0 — CUSTOMER PANEL (OPENING)\n${customerOpening}\n`);
  customerParts.push(`TURN 0 — OPENING\n${customerOpening}\n`);

  for (const turn of turns) {
    fullParts.push(
      `---\n\nTURN ${turn.turnNumber} — SE AGENT\n${turn.seResponse}\n\nTURN ${turn.turnNumber} — CUSTOMER PANEL\n${turn.customerMessage}\n`
    );
    seParts.push(`---\n\nTURN ${turn.turnNumber}\n${turn.seResponse}\n`);
    customerParts.push(`---\n\nTURN ${turn.turnNumber}\n${turn.customerMessage}\n`);
  }

  return {
    fullTranscript: fullParts.join('\n'),
    seTurnsText: seParts.join('\n'),
    customerTurnsText: customerParts.join('\n'),
  };
}

export function buildResultsMatrix(results: EvaluationResult[]): string {
  const runDate = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const rows = results.map((r) => {
    const s = r.judgeEval.parsedScores;
    if (!s) {
      return `| ${r.model.shortName.padEnd(14)} | ${r.model.generation.padEnd(10)} | N/A | N/A | N/A | N/A | N/A | N/A | PARSE ERROR | N/A |`;
    }
    return `| ${r.model.shortName.padEnd(14)} | ${r.model.generation.padEnd(10)} | ${s.productAccuracy} | ${s.stakeholderManagement} | ${s.objectionHandling} | ${s.competitivePositioning} | ${s.dealAdvancement} | ${s.consistencyUnderPressure} | ${s.overallLevel.padEnd(8)} | ${s.composite} |`;
  });

  const getComposite = (shortName: string): string => {
    const r = results.find((x) => x.model.shortName === shortName);
    return r?.judgeEval.parsedScores?.composite ?? 'N/A';
  };

  return `# SEMAT RESULTS MATRIX
Run date: ${runDate}
Customer Agent: ${CUSTOMER_AGENT_MODEL_LABEL} (fixed)
Judge Agent: ${JUDGE_AGENT_MODEL_LABEL} (fixed)

| Model          | Generation | Product  | Stakeholder | Objection | Competitive | Deal Adv | Consistency | LEVEL    | SCORE |
|----------------|------------|----------|-------------|-----------|-------------|----------|-------------|----------|-------|
${rows.join('\n')}

KEY FINDINGS:
  Generation delta (Sonnet): ${getComposite('sonnet-4-5')} → ${getComposite('sonnet-4-6')}
  Generation delta (Opus):   ${getComposite('opus-4-5')} → ${getComposite('opus-4-6')}
  Size delta (4.5):          ${getComposite('sonnet-4-5')} → ${getComposite('opus-4-5')}
  Size delta (4.6):          ${getComposite('sonnet-4-6')} → ${getComposite('opus-4-6')}

  Strongest dimension overall: [see score verifier report]
  Weakest dimension overall:   [see score verifier report]
  Most consistent finding:     [see score verifier report]
  Most variable finding:       [see score verifier report]

WATERMARK STATEMENT:
As of ${runDate.slice(0, 10)}, frontier Claude models operating on a realistic enterprise SE scenario
perform at [see individual judge evaluations] on the SEMAT scale. The generation delta between 4.5 and 4.6
is [see key findings above]. The size delta within a generation is [see key findings above].
`;
}

const CUSTOMER_AGENT_MODEL_LABEL = 'claude-sonnet-4-6';
const JUDGE_AGENT_MODEL_LABEL = 'claude-opus-4-6';
