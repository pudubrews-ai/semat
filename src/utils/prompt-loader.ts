import { promises as fs } from 'fs';
import path from 'path';

const PROMPTS_DIR = path.join(process.cwd(), 'prompts');
const PRODUCT_DIR = path.join(process.cwd(), 'product');

let _sevoGptDef: string | null = null;
let _scoringRubric: string | null = null;
let _levelDefinitions: string | null = null;
let _sePromptTemplate: string | null = null;
let _customerPrompt: string | null = null;
let _judgePromptTemplate: string | null = null;
let _transcriptVerifierTemplate: string | null = null;
let _judgeVerifierTemplate: string | null = null;
let _scoreVerifierTemplate: string | null = null;

export async function loadAllPrompts(): Promise<void> {
  const [sevo, rubric, levels, se, customer, judge, tv, jv, sv] = await Promise.all([
    fs.readFile(path.join(PRODUCT_DIR, 'sevoGPT-definition.md'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'scoring-rubric.md'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'level-definitions.md'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'se-agent-prompt.md'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'customer-agent-prompt.md'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'judge-agent-prompt.md'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'transcript-verifier-prompt.md'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'judge-verifier-prompt.md'), 'utf8'),
    fs.readFile(path.join(PROMPTS_DIR, 'score-verifier-prompt.md'), 'utf8'),
  ]);
  _sevoGptDef = sevo;
  _scoringRubric = rubric;
  _levelDefinitions = levels;
  _sePromptTemplate = se;
  _customerPrompt = customer;
  _judgePromptTemplate = judge;
  _transcriptVerifierTemplate = tv;
  _judgeVerifierTemplate = jv;
  _scoreVerifierTemplate = sv;
}

export function buildSEPrompt(): string {
  return required(_sePromptTemplate, 'se-agent-prompt').replace(
    '{{SEVO_GPT_DEFINITION}}',
    required(_sevoGptDef, 'sevoGPT-definition')
  );
}

export function getCustomerPrompt(): string {
  return required(_customerPrompt, 'customer-agent-prompt');
}

export function buildJudgePrompt(transcript: string): string {
  return required(_judgePromptTemplate, 'judge-agent-prompt')
    .replace('{{SEVO_GPT_DEFINITION}}', required(_sevoGptDef, 'sevoGPT-definition'))
    .replace('{{SCORING_RUBRIC}}', required(_scoringRubric, 'scoring-rubric'))
    .replace('{{LEVEL_DEFINITIONS}}', required(_levelDefinitions, 'level-definitions'))
    .replace('{{TRANSCRIPT}}', transcript);
}

export function buildTranscriptVerifierPrompt(modelId: string, transcript: string): string {
  return required(_transcriptVerifierTemplate, 'transcript-verifier-prompt')
    .replace('{{SEVO_GPT_DEFINITION}}', required(_sevoGptDef, 'sevoGPT-definition'))
    .replace('{{MODEL_ID}}', modelId)
    .replace('{{TRANSCRIPT}}', transcript);
}

export function buildJudgeVerifierPrompt(
  modelId: string,
  transcript: string,
  judgeReport: string
): string {
  return required(_judgeVerifierTemplate, 'judge-verifier-prompt')
    .replace('{{LEVEL_DEFINITIONS}}', required(_levelDefinitions, 'level-definitions'))
    .replace('{{SCORING_RUBRIC}}', required(_scoringRubric, 'scoring-rubric'))
    .replace('{{MODEL_ID}}', modelId)
    .replace('{{TRANSCRIPT}}', transcript)
    .replace('{{JUDGE_REPORT}}', judgeReport);
}

export function buildScoreVerifierPrompt(judgeEvals: string, resultsMatrix: string): string {
  return required(_scoreVerifierTemplate, 'score-verifier-prompt')
    .replace('{{JUDGE_EVALS}}', judgeEvals)
    .replace('{{RESULTS_MATRIX}}', resultsMatrix);
}

function required(val: string | null, name: string): string {
  if (!val) throw new Error(`Prompt not loaded: ${name}. Call loadAllPrompts() first.`);
  return val;
}
