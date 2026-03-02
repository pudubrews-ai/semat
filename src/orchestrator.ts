import Anthropic from '@anthropic-ai/sdk';
import { loadAllPrompts } from './utils/prompt-loader';
import { runEvaluation } from './evaluation';
import { runScoreVerifier } from './agents/verifiers/score-verifier';
import {
  writeResultsMatrix,
  writeGovernanceLog,
  writeScoreVerify,
  buildResultsMatrix,
} from './utils/file-writer';
import { now, durationMinutes } from './utils/timestamp';
import { MODELS_UNDER_EVALUATION } from './config';
import { EvaluationResult, GovernanceEntry } from './types';

async function buildGovernanceLog(
  buildStart: string,
  buildEnd: string,
  results: EvaluationResult[],
  scoreVerifyReport: string,
  scoreVerifyPass: boolean
): Promise<string> {
  const lines: string[] = [
    '# SEMAT Orchestrator Governance Log',
    '',
    `BUILD START: ${buildStart}`,
    '',
    '---',
    '',
  ];

  for (const r of results) {
    const t = r.timing;
    lines.push(`## Evaluation: ${r.model.shortName} (${r.model.modelId})`);
    lines.push('');
    lines.push(`TIMING:`);
    lines.push(`  Total start:       ${t.totalStart}`);
    lines.push(`  Conversation:      ${durationMinutes(t.conversationStart, t.conversationEnd)} min  (${t.conversationStart} → ${t.conversationEnd})`);
    lines.push(`  Judge eval:        ${durationMinutes(t.judgeStart, t.judgeEnd)} min  (${t.judgeStart} → ${t.judgeEnd})`);
    lines.push(`  Verifiers:         ${durationMinutes(t.verifiersStart, t.verifiersEnd)} min  [parallel]  (${t.verifiersStart} → ${t.verifiersEnd})`);
    lines.push(`  Total elapsed:     ${durationMinutes(t.totalStart, t.totalEnd)} min`);
    lines.push(`  Total end:         ${t.totalEnd}`);
    lines.push('');

    const s = r.judgeEval.parsedScores;
    lines.push('JUDGE SCORES:');
    if (s) {
      lines.push(`  Product Accuracy:           ${s.productAccuracy}`);
      lines.push(`  Stakeholder Management:     ${s.stakeholderManagement}`);
      lines.push(`  Objection Handling:         ${s.objectionHandling}`);
      lines.push(`  Competitive Positioning:    ${s.competitivePositioning}`);
      lines.push(`  Deal Advancement:           ${s.dealAdvancement}`);
      lines.push(`  Consistency Under Pressure: ${s.consistencyUnderPressure}`);
      lines.push(`  Overall Level:              ${s.overallLevel}`);
      lines.push(`  Composite:                  ${s.composite}`);
    } else {
      lines.push('  [Score parsing failed — see judge-eval file for raw report]');
    }
    lines.push('');

    lines.push('VERIFICATION:');
    lines.push(`  Transcript Verifier: ${r.verification.transcriptPass ? 'PASS' : 'FAIL'}`);
    lines.push(`  Judge Verifier:      ${r.verification.judgePass ? 'PASS' : 'FAIL'}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('## Score Verifier');
  lines.push('');
  lines.push(`Score Verifier: ${scoreVerifyPass ? 'PASS' : 'FAIL'}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  const totalMinutes = durationMinutes(buildStart, buildEnd);
  lines.push(`BUILD COMPLETE: ${buildEnd}`);
  lines.push(`TOTAL BUILD TIME: ${totalMinutes} minutes (${buildStart} → ${buildEnd})`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');

  for (const r of results) {
    const s = r.judgeEval.parsedScores;
    const composite = s?.composite ?? 'PARSE ERROR';
    const tvStatus = r.verification.transcriptPass ? 'PASS' : 'FAIL';
    const jvStatus = r.verification.judgePass ? 'PASS' : 'FAIL';
    lines.push(`  ${r.model.shortName.padEnd(12)} ${composite.padEnd(16)} TV:${tvStatus} JV:${jvStatus}`);
  }
  lines.push('');

  return lines.join('\n');
}

async function main(): Promise<void> {
  const buildStart = now();
  console.log(`\n=== SEMAT v1 Evaluation Run ===`);
  console.log(`Start: ${buildStart}\n`);

  // Load all prompts and product definition upfront
  console.log('Loading prompts and product definition...');
  await loadAllPrompts();

  const anthropic = new Anthropic();
  const results: EvaluationResult[] = [];

  // Run four model evaluations sequentially
  for (const model of MODELS_UNDER_EVALUATION) {
    console.log(`\n=== Evaluating: ${model.shortName} (${model.modelId}) ===`);
    const result = await runEvaluation(anthropic, model);
    results.push(result);
  }

  // Build and write results matrix
  console.log('\n=== Compiling results matrix ===');
  const matrix = buildResultsMatrix(results);
  await writeResultsMatrix(matrix);

  // Run score verifier
  console.log('Running score verifier...');
  const { report: scoreVerifyReport, pass: scoreVerifyPass } = await runScoreVerifier(
    anthropic,
    results,
    matrix
  );
  await writeScoreVerify(scoreVerifyReport);
  console.log(`Score Verifier: ${scoreVerifyPass ? 'PASS' : 'FAIL'}`);

  // Write governance log
  const buildEnd = now();
  const governanceLog = await buildGovernanceLog(
    buildStart,
    buildEnd,
    results,
    scoreVerifyReport,
    scoreVerifyPass
  );
  await writeGovernanceLog(governanceLog);

  console.log(`\n=== SEMAT evaluation complete ===`);
  console.log(`End: ${buildEnd}`);
  console.log(`Duration: ${durationMinutes(buildStart, buildEnd)} minutes`);
  console.log('\nResults summary:');
  for (const r of results) {
    const composite = r.judgeEval.parsedScores?.composite ?? 'PARSE ERROR';
    console.log(`  ${r.model.shortName}: ${composite}`);
  }
  console.log('\nOutputs written to conversations/ and reports/');
}

main().catch((err) => {
  console.error('SEMAT run failed:', err);
  process.exit(1);
});
