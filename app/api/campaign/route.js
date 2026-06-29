import { generateDemoCampaign } from '../../lib/demoCampaign';
import { runAgentPipeline } from '../../lib/agentPipeline';

// El pipeline multiagente hace varias llamadas seguidas a Claude (no una sola),
// así que la respuesta tarda más. Esto le pide a Vercel hasta 60 segundos
// para esta función en vez de los 10 segundos por defecto del plan gratuito.
export const maxDuration = 60;

export async function POST(request) {
  try {
    const form = await request.json();

    if (!form.business || !form.country || !form.goal) {
      return Response.json(
        { error: 'Faltan datos obligatorios: negocio, país u objetivo.' },
        { status: 400 }
      );
    }

    // Modo demo si todavía no se configuró la API key real de Anthropic.
    // No llama a ningún agente; usa datos de ejemplo para poder probar la interfaz sin costo.
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('coloca_tu_api_key')) {
      return Response.json(generateDemoCampaign(form));
    }

    const result = await runAgentPipeline(form);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: 'No se pudo generar la campaña.', detail: error.message },
      { status: 500 }
    );
  }
}
