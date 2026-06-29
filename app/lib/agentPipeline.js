import Anthropic from '@anthropic-ai/sdk';
import {
  systemPrompt_market, userPrompt_market,
  systemPrompt_psychology, userPrompt_psychology,
  systemPrompt_offer, userPrompt_offer,
  systemPrompt_copy, userPrompt_copy,
  systemPrompt_metaAds, userPrompt_metaAds,
  systemPrompt_automation, userPrompt_automation,
  systemPrompt_creative, userPrompt_creative,
  systemPrompt_director, userPrompt_director,
  getAgent
} from './agents';

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

async function callAgent(client, { key, system, user, maxTokens = 450 }) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }]
  });

  const text = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const cleaned = text.replace(/```json|```/
