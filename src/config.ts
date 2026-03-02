import { ModelConfig } from './types';

export const MODELS_UNDER_EVALUATION: ModelConfig[] = [
  {
    modelId: 'claude-sonnet-4-5-20251001',
    shortName: 'sonnet-4-5',
    generation: '4.5',
    size: 'Sonnet',
  },
  {
    modelId: 'claude-opus-4-5',
    shortName: 'opus-4-5',
    generation: '4.5',
    size: 'Opus',
  },
  {
    modelId: 'claude-sonnet-4-6',
    shortName: 'sonnet-4-6',
    generation: '4.6',
    size: 'Sonnet',
  },
  {
    modelId: 'claude-opus-4-6',
    shortName: 'opus-4-6',
    generation: '4.6',
    size: 'Opus',
  },
];

export const CUSTOMER_AGENT_MODEL = 'claude-sonnet-4-6';
export const JUDGE_AGENT_MODEL = 'claude-opus-4-6';
export const TRANSCRIPT_VERIFIER_MODEL = 'claude-sonnet-4-6';
export const JUDGE_VERIFIER_MODEL = 'claude-opus-4-6';
export const SCORE_VERIFIER_MODEL = 'claude-sonnet-4-6';

export const MAX_TURNS = 20;
export const MIN_TURNS = 10;

export const MAX_TOKENS_SE = 2048;
export const MAX_TOKENS_CUSTOMER = 2048;
export const MAX_TOKENS_JUDGE = 4096;
export const MAX_TOKENS_VERIFIER = 4096;
export const MAX_TOKENS_SCORE_VERIFIER = 4096;

export const OPENING_TRIGGER =
  'The sales engineer from SEvoGPT has just joined the meeting. Sarah, please open the meeting and give the SE the floor.';

// Natural end signals — conversation closes early if one of these appears after MIN_TURNS
export const MEETING_END_SIGNALS = [
  "we'll be in touch",
  "we'll follow up",
  "we will follow up",
  "thank you for your time",
  "meeting adjourned",
  "that's all for today",
  "we have what we need",
  "we'll take this away",
  "we will take this away",
];
