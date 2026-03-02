export interface ModelConfig {
  modelId: string;
  shortName: string;
  generation: string;
  size: string;
}

export interface ConversationTurn {
  turnNumber: number;
  customerMessage: string;
  seResponse: string;
}

export interface ConversationResult {
  model: ModelConfig;
  turns: ConversationTurn[];
  customerOpening: string;
  fullTranscript: string;
  seTurnsText: string;
  customerTurnsText: string;
}

export interface JudgeEvaluation {
  modelId: string;
  rawReport: string;
  parsedScores?: ParsedScores;
}

export interface ParsedScores {
  productAccuracy: number;
  stakeholderManagement: number;
  objectionHandling: number;
  competitivePositioning: number;
  dealAdvancement: number;
  consistencyUnderPressure: number;
  overallLevel: string;
  overallScore: number;
  composite: string;
}

export interface VerificationResult {
  modelId: string;
  transcriptVerifyReport: string;
  judgeVerifyReport: string;
  transcriptPass: boolean;
  judgePass: boolean;
}

export interface EvaluationResult {
  model: ModelConfig;
  conversation: ConversationResult;
  judgeEval: JudgeEvaluation;
  verification: VerificationResult;
  timing: EvaluationTiming;
}

export interface EvaluationTiming {
  modelShortName: string;
  conversationStart: string;
  conversationEnd: string;
  judgeStart: string;
  judgeEnd: string;
  verifiersStart: string;
  verifiersEnd: string;
  totalStart: string;
  totalEnd: string;
}

export interface GovernanceEntry {
  timestamp: string;
  event: string;
  detail?: string;
}
