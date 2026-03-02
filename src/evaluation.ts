import Anthropic from '@anthropic-ai/sdk';
import { ModelConfig, ConversationResult, EvaluationResult, ConversationTurn } from './types';
import { callAgent, MessageParam } from './agents/call-agent';
import { runJudge } from './agents/judge-agent';
import { runTranscriptVerifier } from './agents/verifiers/transcript-verifier';
import { runJudgeVerifier } from './agents/verifiers/judge-verifier';
import {
  buildSEPrompt,
  getCustomerPrompt,
} from './utils/prompt-loader';
import {
  writeConversationFiles,
  writeJudgeEval,
  writeTranscriptVerify,
  writeJudgeVerify,
  buildTranscript,
} from './utils/file-writer';
import { now } from './utils/timestamp';
import {
  CUSTOMER_AGENT_MODEL,
  OPENING_TRIGGER,
  MAX_TURNS,
  MIN_TURNS,
  MAX_TOKENS_SE,
  MAX_TOKENS_CUSTOMER,
  MEETING_END_SIGNALS,
} from './config';

function meetingEnded(customerResponse: string): boolean {
  const lower = customerResponse.toLowerCase();
  return MEETING_END_SIGNALS.some((signal) => lower.includes(signal));
}

export async function runEvaluation(
  anthropic: Anthropic,
  model: ModelConfig
): Promise<EvaluationResult> {
  console.log(`  [${model.shortName}] Starting conversation...`);

  const totalStart = now();
  const seSystemPrompt = buildSEPrompt();
  const customerSystemPrompt = getCustomerPrompt();

  const seHistory: MessageParam[] = [];
  const customerHistory: MessageParam[] = [];
  const turns: ConversationTurn[] = [];

  // --- Opening: customer receives trigger and opens ---
  customerHistory.push({ role: 'user', content: OPENING_TRIGGER });
  const customerOpening = await callAgent(
    anthropic,
    CUSTOMER_AGENT_MODEL,
    customerSystemPrompt,
    customerHistory,
    MAX_TOKENS_CUSTOMER
  );
  customerHistory.push({ role: 'assistant', content: customerOpening });

  let lastCustomerMessage = customerOpening;
  const conversationStart = now();

  // --- Main conversation loop ---
  for (let turnNum = 1; turnNum <= MAX_TURNS; turnNum++) {
    console.log(`  [${model.shortName}] Turn ${turnNum}/${MAX_TURNS}...`);

    // SE responds to the last customer message
    seHistory.push({ role: 'user', content: lastCustomerMessage });
    const seResponse = await callAgent(
      anthropic,
      model.modelId,
      seSystemPrompt,
      seHistory,
      MAX_TOKENS_SE
    );
    seHistory.push({ role: 'assistant', content: seResponse });

    // Customer responds to SE
    customerHistory.push({ role: 'user', content: seResponse });
    const customerResponse = await callAgent(
      anthropic,
      CUSTOMER_AGENT_MODEL,
      customerSystemPrompt,
      customerHistory,
      MAX_TOKENS_CUSTOMER
    );
    customerHistory.push({ role: 'assistant', content: customerResponse });

    turns.push({ turnNumber: turnNum, seResponse, customerMessage: customerResponse });

    // Check for natural meeting end (only after minimum turns)
    if (turnNum >= MIN_TURNS && meetingEnded(customerResponse)) {
      console.log(`  [${model.shortName}] Meeting ended naturally at turn ${turnNum}.`);
      break;
    }

    lastCustomerMessage = customerResponse;
  }

  const conversationEnd = now();
  console.log(`  [${model.shortName}] Conversation complete (${turns.length} turns). Building transcript...`);

  // --- Build and write conversation files ---
  const { fullTranscript, seTurnsText, customerTurnsText } = buildTranscript(
    model,
    customerOpening,
    turns
  );

  const conv: ConversationResult = {
    model,
    turns,
    customerOpening,
    fullTranscript,
    seTurnsText,
    customerTurnsText,
  };

  await writeConversationFiles(conv);

  // --- Judge evaluation ---
  console.log(`  [${model.shortName}] Running judge evaluation...`);
  const judgeStart = now();
  const judgeEval = await runJudge(anthropic, model.shortName, fullTranscript);
  const judgeEnd = now();
  await writeJudgeEval(model.shortName, judgeEval.rawReport);

  // --- Verifiers (parallel) ---
  console.log(`  [${model.shortName}] Running verifiers (parallel)...`);
  const verifiersStart = now();
  const [tvResult, jvResult] = await Promise.all([
    runTranscriptVerifier(anthropic, model.shortName, fullTranscript),
    runJudgeVerifier(anthropic, model.shortName, fullTranscript, judgeEval.rawReport),
  ]);
  const verifiersEnd = now();

  await Promise.all([
    writeTranscriptVerify(model.shortName, tvResult.report),
    writeJudgeVerify(model.shortName, jvResult.report),
  ]);

  const totalEnd = now();

  console.log(
    `  [${model.shortName}] Complete. ` +
      `Transcript verifier: ${tvResult.pass ? 'PASS' : 'FAIL'}, ` +
      `Judge verifier: ${jvResult.pass ? 'PASS' : 'FAIL'}`
  );

  return {
    model,
    conversation: conv,
    judgeEval,
    verification: {
      modelId: model.shortName,
      transcriptVerifyReport: tvResult.report,
      judgeVerifyReport: jvResult.report,
      transcriptPass: tvResult.pass,
      judgePass: jvResult.pass,
    },
    timing: {
      modelShortName: model.shortName,
      conversationStart,
      conversationEnd,
      judgeStart,
      judgeEnd,
      verifiersStart,
      verifiersEnd,
      totalStart,
      totalEnd,
    },
  };
}
