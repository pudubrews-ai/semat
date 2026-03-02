import Anthropic from '@anthropic-ai/sdk';
import { callAgent } from '../call-agent';
import { buildScoreVerifierPrompt } from '../../utils/prompt-loader';
import { EvaluationResult } from '../../types';
import { SCORE_VERIFIER_MODEL, MAX_TOKENS_SCORE_VERIFIER } from '../../config';

export async function runScoreVerifier(
  anthropic: Anthropic,
  results: EvaluationResult[],
  resultsMatrix: string
): Promise<{ report: string; pass: boolean }> {
  const judgeEvals = results
    .map(
      (r) =>
        `## Judge Evaluation — ${r.model.shortName}\n\n${r.judgeEval.rawReport}`
    )
    .join('\n\n---\n\n');

  const prompt = buildScoreVerifierPrompt(judgeEvals, resultsMatrix);

  const report = await callAgent(
    anthropic,
    SCORE_VERIFIER_MODEL,
    'You are verifying that the SEMAT results matrix correctly reflects the four individual judge evaluations. Be precise and flag any discrepancy.',
    [{ role: 'user', content: prompt }],
    MAX_TOKENS_SCORE_VERIFIER
  );

  const pass = /OVERALL:\s*PASS/i.test(report);
  return { report, pass };
}
