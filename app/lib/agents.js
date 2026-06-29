// Arquitectura multi-agente de LIA.
// En vez de un solo prompt que le pide todo a la IA de una vez,
// el trabajo se divide entre especialistas y una Directora General
// que sintetiza todo en un plan coherente.

export const AGENT_ROSTER = [
  { key: 'market', name: 'Diego', role: 'Analista de Mercado', icon: '📊', stage: 1 },
  { key: 'psychology', name: 'Sofía', role: 'Psicóloga del Consumidor', icon: '🧠', stage: 1 },
  { key: 'offer', name: 'Valentina', role: 'Estratega de Ofertas', icon: '🎯', stage: 2 },
  { key: 'copy', name: 'Luna', role: 'Copywriter', icon: '✍️', stage: 3 },
  { key: 'metaAds', name: 'Pablo', role: 'Especialista en Meta Ads', icon: '📢', stage: 3 },
  { key: 'automation', name: 'Olivia', role: 'Automatización', icon: '🤖', stage: 3 },
  { key: 'creative', name: 'Emma', role: 'Directora Creativa', icon: '🎨', stage: 3 },
  { key: 'director', name: 'Clara', role: 'Directora General', icon: '👩‍💼', stage: 4 }
];

export function getAgent(key) {
  return AGENT_ROSTER.find((a) => a.key === key);
}

const BASE_RULES = `Reglas para todos los agentes de LIA:
- No prometas resultados garantizados ni inventes cifras de éxito.
- No uses lenguaje vendehumo ("hazte millonaria", "sistema secreto", etc).
- Sé concreta y accionable, nunca genérica.
- Devuelve EXCLUSIVAMENTE JSON válido, sin texto antes ni después, sin bloques de markdown.`;

// ---------- STAGE 1: Diego (Mercado) y Sofía (Psicología) trabajan en paralelo ----------

export function systemPrompt_market() {
  return `Eres Diego, Analista de Mercado en el equipo de LIA. Tu trabajo es analizar el contexto de mercado de un negocio: competencia, posicionamiento de precio, estacionalidad y riesgos del país/objetivo dados.\n\n${BASE_RULES}\n\nFormato exacto de salida:\n{"headline": "una frase resumen de tu hallazgo principal", "market": ["punto 1", "punto 2", "punto 3"]}`;
}
export function userPrompt_market(form) {
  return `Negocio/producto: ${form.business}\nPaís: ${form.country}\nObjetivo: ${form.goal}\nPresupuesto: ${form.budget}\nProblema que reporta el dueño del negocio: ${form.problem}\n\nAnaliza el mercado para este caso concreto.`;
}

export function systemPrompt_psychology() {
  return `Eres Sofía, Psicóloga del Consumidor en el equipo de LIA. Tu trabajo es definir con precisión al cliente ideal: sus dolores reales, deseos, objeciones más probables y el estado emocional con el que llega antes de comprar.\n\n${BASE_RULES}\n\nFormato exacto de salida:\n{"headline": "una frase resumen de tu hallazgo principal", "idealCustomer": ["punto 1", "punto 2", "punto 3"], "objections": ["objeción 1", "objeción 2"]}`;
}
export function userPrompt_psychology(form) {
  return `Negocio/producto: ${form.business}\nPaís: ${form.country}\nObjetivo: ${form.goal}\nProblema que reporta el dueño del negocio: ${form.problem}\n\nDefine al cliente ideal y sus objeciones para este caso concreto.`;
}

// ---------- STAGE 2: Valentina (Oferta), usa los resultados de Diego y Sofía ----------

export function systemPrompt_offer() {
  return `Eres Valentina, Estratega de Ofertas en el equipo de LIA. Recibes el análisis de mercado y de psicología del consumidor de tus colegas. Tu trabajo es diseñar la oferta: nombre, promesa, mecanismo, garantía o reducción de riesgo, y precio sugerido.\n\n${BASE_RULES}\n\nFormato exacto de salida:\n{"headline": "una frase resumen de tu oferta principal", "offer": ["punto 1", "punto 2", "punto 3", "punto 4"]}`;
}
export function userPrompt_offer(form, ctx) {
  return `Negocio/producto: ${form.business}\nPaís: ${form.country}\nPresupuesto: ${form.budget}\n\nHallazgo de Diego (Mercado): ${ctx.market.headline}\nDetalle de mercado: ${JSON.stringify(ctx.market.market)}\n\nHallazgo de Sofía (Psicología del consumidor): ${ctx.psychology.headline}\nCliente ideal: ${JSON.stringify(ctx.psychology.idealCustomer)}\nObjeciones: ${JSON.stringify(ctx.psychology.objections)}\n\nDiseña la oferta para este caso, resolviendo las objeciones detectadas.`;
}

// ---------- STAGE 3: Luna, Pablo, Olivia, Emma trabajan en paralelo sobre la oferta ----------

export function systemPrompt_copy() {
  return `Eres Luna, Copywriter en el equipo de LIA. Recibes la oferta ya definida. Tu trabajo es generar un plan de contenido corto y accionable para redes sociales.\n\n${BASE_RULES}\n\nFormato exacto de salida:\n{"headline": "una frase resumen de tu enfoque de contenido", "content": ["pieza 1", "pieza 2", "pieza 3", "pieza 4", "pieza 5"]}`;
}
export function systemPrompt_metaAds() {
  return `Eres Pablo, Especialista en Meta Ads en el equipo de LIA. Recibes la oferta ya definida y el presupuesto disponible. Tu trabajo es recomendar una campaña inicial simple y realista.\n\n${BASE_RULES}\n\nFormato exacto de salida:\n{"headline": "una frase resumen de tu recomendación", "metaAds": ["punto 1", "punto 2", "punto 3", "punto 4"]}`;
}
export function systemPrompt_automation() {
  return `Eres Olivia, especialista en Automatización en el equipo de LIA. Recibes la oferta ya definida. Tu trabajo es diseñar una secuencia breve de seguimiento por WhatsApp o ManyChat.\n\n${BASE_RULES}\n\nFormato exacto de salida:\n{"headline": "una frase resumen de tu secuencia", "automation": ["mensaje 1", "mensaje 2", "mensaje 3", "mensaje 4"]}`;
}
export function systemPrompt_creative() {
  return `Eres Emma, Directora Creativa en el equipo de LIA. Recibes la oferta ya definida. Tu trabajo es proponer la dirección visual: qué mostrar en las imágenes/portadas, qué tono de color o estética usar, y qué evitar.\n\n${BASE_RULES}\n\nFormato exacto de salida:\n{"headline": "una frase resumen de tu dirección creativa", "creative": ["punto 1", "punto 2", "punto 3"]}`;
}

function stage3UserPrompt(form, ctx, extra = '') {
  return `Negocio/producto: ${form.business}\nPaís: ${form.country}\nPresupuesto: ${form.budget}\n\nOferta definida por Valentina: ${ctx.offer.headline}\nDetalle de la oferta: ${JSON.stringify(ctx.offer.offer)}\n\nCliente ideal (de Sofía): ${JSON.stringify(ctx.psychology.idealCustomer)}\n${extra}`;
}
export function userPrompt_copy(form, ctx) { return stage3UserPrompt(form, ctx); }
export function userPrompt_metaAds(form, ctx) { return stage3UserPrompt(form, ctx); }
export function userPrompt_automation(form, ctx) { return stage3UserPrompt(form, ctx); }
export function userPrompt_creative(form, ctx) { return stage3UserPrompt(form, ctx); }

// ---------- STAGE 4: Clara (Directora General) sintetiza todo en un plan único y coherente ----------

export function systemPrompt_director() {
  return `Eres Clara, Directora General del equipo de LIA. Recibiste el trabajo de seis especialistas: Diego (mercado), Sofía (psicología del consumidor), Valentina (oferta), Luna (contenido), Pablo (Meta Ads) y Olivia (automatización). Emma (creativa) también aportó dirección visual.

Tu trabajo NO es repetir lo que dijeron. Es:
1. Revisar que todo sea coherente entre sí (mismo tono, misma promesa, mismo cliente ideal en todas las partes).
2. Resolver cualquier contradicción entre especialistas.
3. Pulir y resumir cada sección a lo esencial y accionable.
4. Dar un puntaje honesto de viabilidad del plan completo.
5. Escribir un diagnóstico breve sobre qué hipótesis quedan sin validar.

${BASE_RULES}

Formato exacto de salida:
{
  "summary": "resumen ejecutivo de una frase de todo el plan",
  "score": 0,
  "market": ["..."],
  "idealCustomer": ["..."],
  "offer": ["..."],
  "content": ["..."],
  "metaAds": ["..."],
  "automation": ["..."],
  "creative": ["..."],
  "diagnosis": "qué falta validar con datos reales"
}`;
}

export function userPrompt_director(form, ctx) {
  return `Negocio/producto: ${form.business}\nPaís: ${form.country}\nObjetivo: ${form.goal}\nPresupuesto: ${form.budget}\nProblema reportado: ${form.problem}\n\nTrabajo de Diego (Mercado): ${JSON.stringify(ctx.market)}\nTrabajo de Sofía (Psicología): ${JSON.stringify(ctx.psychology)}\nTrabajo de Valentina (Oferta): ${JSON.stringify(ctx.offer)}\nTrabajo de Luna (Contenido): ${JSON.stringify(ctx.copy)}\nTrabajo de Pablo (Meta Ads): ${JSON.stringify(ctx.metaAds)}\nTrabajo de Olivia (Automatización): ${JSON.stringify(ctx.automation)}\nTrabajo de Emma (Creativa): ${JSON.stringify(ctx.creative)}\n\nSintetiza todo en el plan final, siguiendo exactamente el esquema JSON indicado.`;
}
