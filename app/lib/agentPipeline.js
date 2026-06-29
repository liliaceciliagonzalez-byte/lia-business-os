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

  const BACKTICK = String.fromCharCode(96);
  const FENCE = BACKTICK + BACKTICK + BACKTICK;
  const cleaned = text.split(FENCE).join('').replace(/^json/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Si el agente no devolvió JSON limpio, no tumbamos todo el pipeline.
    return { headline: 'Respuesta no estructurada', raw: cleaned };
  }
}

function buildTraceEntry(key, output) {
  const agent = getAgent(key);
  return {
    name: agent.name,
    role: agent.role,
    icon: agent.icon,
    headline: output?.headline || 'Trabajo entregado a la Directora General.'
  };
}

/**
 * v0.6: pipeline de 2 etapas (en vez de 4), pensado para evitar el timeout
 * de 60s de Vercel:
 * Etapa 1 (paralelo, los 7 a la vez): Diego, Sofía, Valentina, Luna, Pablo, Olivia, Emma
 * Etapa 2: Clara (Directora General) sintetiza todo
 */
export async function runAgentPipeline(form) {
  const client = getClient();
  const trace = [];

  const [market, psychology, offer, copy, metaAds, automation, creative] = await Promise.all([
    callAgent(client, { key: 'market', system: systemPrompt_market(), user: userPrompt_market(form) }),
    callAgent(client, { key: 'psychology', system: systemPrompt_psychology(), user: userPrompt_psychology(form) }),
    callAgent(client, { key: 'offer', system: systemPrompt_offer(), user: userPrompt_offer(form) }),
    callAgent(client, { key: 'copy', system: systemPrompt_copy(), user: userPrompt_copy(form) }),
    callAgent(client, { key: 'metaAds', system: systemPrompt_metaAds(), user: userPrompt_metaAds(form) }),
    callAgent(client, { key: 'automation', system: systemPrompt_automation(), user: userPrompt_automation(form) }),
    callAgent(client, { key: 'creative', system: systemPrompt_creative(), user: userPrompt_creative(form) })
  ]);

  trace.push(buildTraceEntry('market', market));
  trace.push(buildTraceEntry('psychology', psychology));
  trace.push(buildTraceEntry('offer', offer));
  trace.push(buildTraceEntry('copy', copy));
  trace.push(buildTraceEntry('metaAds', metaAds));
  trace.push(buildTraceEntry('automation', automation));
  trace.push(buildTraceEntry('creative', creative));

  const ctx = { market, psychology, offer, copy, metaAds, automation, creative };

  const directorResult = await callAgent(client, {
    key: 'director',
    system: systemPrompt_director(),
    user: userPrompt_director(form, ctx),
    maxTokens: 1200
  });
  trace.push({
    name: 'Clara',
    role: 'Directora General',
    icon: '👩‍💼',
    headline: directorResult?.summary || 'Plan final sintetizado.'
  });

  return {
    mode: 'ai-multiagent',
    ...directorResult,
    agentTrace: trace
  };
}
