import Anthropic from '@anthropic-ai/sdk';
import { callAgent } from '../call-agent';
import { buildTranscriptVerifierPrompt } from '../../utils/prompt-loader';
import { TRANSCRIPT_VERIFIER_MODEL, MAX_TOKENS_VERIFIER } from '../../config';

export async function runTranscriptVerifier(
  anthropic: Anthropic,
  modelId: string,
  transcript: string
): Promise<{ report: string; pass: boolean }> {
  const prompt = buildTranscriptVerifierPrompt(modelId, transcript);

  const report = await callAgent(
    anthropic,
    TRANSCRIPT_VERIFIER_MODEL,
    'You are a behavioral compliance verifier. Verify agent compliance strictly and report findings in the exact format requested.',
    [{ role: 'user', content: prompt }],
    MAX_TOKENS_VERIFIER
  );

  const pass = /OVERALL:\s*PASS/i.test(report);
  return { report, pass };
}
