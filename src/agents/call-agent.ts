import Anthropic from '@anthropic-ai/sdk';

export type MessageParam = Anthropic.MessageParam;

/**
 * Single call to an Anthropic model with a system prompt and conversation history.
 * Returns the text of the first content block.
 */
export async function callAgent(
  anthropic: Anthropic,
  model: string,
  systemPrompt: string,
  history: MessageParam[],
  maxTokens = 2048
): Promise<string> {
  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: history,
  });

  const block = response.content[0];
  if (!block || block.type !== 'text') {
    throw new Error(`Unexpected response from model ${model}: no text block`);
  }
  return block.text;
}
