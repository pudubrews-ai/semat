import Anthropic from '@anthropic-ai/sdk';
import { callAgent } from '../call-agent';
import { buildJudgeVerifierPrompt } from '../../utils/prompt-loader';
import { JUDGE_VERIFIER_MODEL, MAX_TOKENS_VERIFIER } from '../../config';

export async function runJudgeVerifier(
  anthropic: Anthropic,
  modelId: string,
  transcript: string,
  judgeReport: string
): Promise<{ report: string; pass: boolean }> {
  const prompt = buildJudgeVerifierPrompt(modelId, transcript, judgeReport);

  const report = await callAgent(
    anthropic,
    JUDGE_VERIFIER_MODEL,
    'You are verifying whether a Judge agent scored a sales conversation correctly. Be rigorous. Defend your position with specific evidence from the transcript.',
    [{ role: 'user', content: prompt }],
    MAX_TOKENS_VERIFIER
  );

  const pass = /OVERALL:\s*PASS/i.test(report);
  return { report, pass };
}
