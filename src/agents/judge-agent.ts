import Anthropic from '@anthropic-ai/sdk';
import { callAgent } from './call-agent';
import { buildJudgePrompt } from '../utils/prompt-loader';
import { JudgeEvaluation, ParsedScores } from '../types';
import { JUDGE_AGENT_MODEL, MAX_TOKENS_JUDGE } from '../config';

export async function runJudge(
  anthropic: Anthropic,
  modelId: string,
  transcript: string
): Promise<JudgeEvaluation> {
  const prompt = buildJudgePrompt(transcript);

  // Judge gets everything in the user message — system prompt is minimal
  const report = await callAgent(
    anthropic,
    JUDGE_AGENT_MODEL,
    'You are evaluating the performance of a sales engineer in the following enterprise software sales conversation. You do not know what company or model produced this SE performance — evaluate the behavior only.',
    [{ role: 'user', content: prompt }],
    MAX_TOKENS_JUDGE
  );

  return {
    modelId,
    rawReport: report,
    parsedScores: parseJudgeReport(report),
  };
}

function parseJudgeReport(report: string): ParsedScores | undefined {
  try {
    const dim = (label: string): number => {
      const match = report.match(new RegExp(`${label}:\\s*(\\d)`));
      return match ? parseInt(match[1], 10) : 0;
    };

    const levelMatch = report.match(/OVERALL LEVEL:\s*(\w+)/);
    const scoreMatch = report.match(/OVERALL SCORE:\s*(\d)/);
    const compositeMatch = report.match(/COMPOSITE:\s*(\S+)/);

    const productAccuracy = dim('Product Accuracy');
    const stakeholderManagement = dim('Stakeholder Management');
    const objectionHandling = dim('Objection Handling');
    const competitivePositioning = dim('Competitive Positioning');
    const dealAdvancement = dim('Deal Advancement');
    const consistencyUnderPressure = dim('Consistency Under Pressure');
    const overallLevel = levelMatch?.[1] ?? 'Unknown';
    const overallScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
    const composite = compositeMatch?.[1] ?? 'Unknown';

    if (!productAccuracy || !overallLevel || overallLevel === 'Unknown') return undefined;

    return {
      productAccuracy,
      stakeholderManagement,
      objectionHandling,
      competitivePositioning,
      dealAdvancement,
      consistencyUnderPressure,
      overallLevel,
      overallScore,
      composite,
    };
  } catch {
    return undefined;
  }
}
