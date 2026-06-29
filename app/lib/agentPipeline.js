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

async function callAgent(client, { key, system, user, maxTokens = 500 }) {
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

  const cleaned = text.replace(/```json|```/g, '').trim();

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
 * Ejecuta el pipeline completo de 4 etapas:
 * Etapa 1 (paralelo): Diego (mercado) + Sofía (psicología)
 * Etapa 2: Valentina (oferta), usa la etapa 1
 * Etapa 3 (paralelo): Luna, Pablo, Olivia, Emma, usan la oferta
 * Etapa 4: Clara (Directora General) sintetiza todo
 */
export async function runAgentPipeline(form) {
  const client = getClient();
  const trace = [];

  // Etapa 1
  const [market, psychology] = await Promise.all([
    callAgent(client, { key: 'market', system: systemPrompt_market(), user: userPrompt_market(form) }),
    callAgent(client, { key: 'psychology', system: systemPrompt_psychology(), user: userPrompt_psychology(form) })
  ]);
  trace.push(buildTraceEntry('market', market));
  trace.push(buildTraceEntry('psychology', psychology));

  const ctxAfterStage1 = { market, psychology };

  // Etapa 2
  const offer = await callAgent(client, {
    key: 'offer',
    system: systemPrompt_offer(),
    user: userPrompt_offer(form, ctxAfterStage1)
  });
  trace.push(buildTraceEntry('offer', offer));

  const ctxAfterStage2 = { ...ctxAfterStage1, offer };

  // Etapa 3 (paralelo)
  const [copy, metaAds, automation, creative] = await Promise.all([
    callAgent(client, { key: 'copy', system: systemPrompt_copy(), user: userPrompt_copy(form, ctxAfterStage2) }),
    callAgent(client, { key: 'metaAds', system: systemPrompt_metaAds(), user: userPrompt_metaAds(form, ctxAfterStage2) }),
    callAgent(client, { key: 'automation', system: systemPrompt_automation(), user: userPrompt_automation(form, ctxAfterStage2) }),
    callAgent(client, { key: 'creative', system: systemPrompt_creative(), user: userPrompt_creative(form, ctxAfterStage2) })
  ]);
  trace.push(buildTraceEntry('copy', copy));
  trace.push(buildTraceEntry('metaAds', metaAds));
  trace.push(buildTraceEntry('automation', automation));
  trace.push(buildTraceEntry('creative', creative));

  const ctxFinal = { ...ctxAfterStage2, copy, metaAds, automation, creative };

  // Etapa 4: Directora General
  const directorResult = await callAgent(client, {
    key: 'director',
    system: systemPrompt_director(),
    user: userPrompt_director(form, ctxFinal),
    maxTokens: 1400
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
