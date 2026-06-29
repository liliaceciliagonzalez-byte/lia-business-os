// Modo demo: no llama a ningún agente real. Usa datos de ejemplo para poder
// probar la interfaz y el flujo completo sin gastar créditos de API.
export function generateDemoCampaign({ business, country, goal, budget, problem }) {
  return {
    mode: 'demo',
    score: 78,
    summary: `Campaña inicial para ${business} en ${country}, enfocada en ${goal}. (Resultado de ejemplo: conecta tu ANTHROPIC_API_KEY para que el equipo de agentes lo genere de verdad.)`,
    market: [
      `El producto/servicio "${business}" debe venderse con un mensaje simple y específico.`,
      `País seleccionado: ${country}. Adaptar precio, lenguaje y objeciones al mercado local.`,
      `Objetivo recomendado: ${goal}. No mezclar ventas, leads y reconocimiento en una sola campaña.`
    ],
    idealCustomer: [
      'Persona con problema visible, urgente o emocional.',
      'Ya ha intentado soluciones antes y no quiere perder más tiempo.',
      'Necesita confianza, prueba social y una oferta clara antes de comprar.'
    ],
    offer: [
      'Crear una oferta principal con resultado concreto.',
      'Añadir bono de decisión rápida.',
      'Usar garantía o reducción de riesgo si aplica.',
      'CTA directo a WhatsApp o landing, no a "más información".'
    ],
    content: [
      'Reel 1: mostrar el problema en una escena cotidiana.',
      'Reel 2: explicar el error común que comete el cliente.',
      'Reel 3: mostrar la solución con demostración simple.',
      'Reel 4: responder objeción de precio o confianza.',
      'Stories: encuesta + caja de preguntas + CTA.'
    ],
    metaAds: [
      `Presupuesto inicial sugerido: ${budget || '10-20 €/día'} durante 5 días.`,
      'Campaña: Leads o Mensajes si venderás por WhatsApp.',
      'Creativo principal: video corto de 15-25 segundos.',
      'Probar 3 hooks diferentes antes de tocar la audiencia.',
      'No escalar si no hay clics, mensajes o leads baratos.'
    ],
    automation: [
      'Mensaje 1: confirmar interés y país.',
      'Mensaje 2: enviar beneficio principal y precio.',
      'Mensaje 3: resolver objeción frecuente.',
      'Mensaje 4: cierre con urgencia real, sin presión falsa.'
    ],
    creative: [
      'Fotografía natural, luz cálida, sin filtros exagerados.',
      'Mostrar el producto en uso real, no solo el empaque.',
      'Evitar stock photos genéricas; usar contenido propio siempre que sea posible.'
    ],
    diagnosis: problem,
    agentTrace: [
      { name: 'Diego', role: 'Analista de Mercado', icon: '📊', headline: 'Resultado de ejemplo (modo demo).' },
      { name: 'Sofía', role: 'Psicóloga del Consumidor', icon: '🧠', headline: 'Resultado de ejemplo (modo demo).' },
      { name: 'Valentina', role: 'Estratega de Ofertas', icon: '🎯', headline: 'Resultado de ejemplo (modo demo).' },
      { name: 'Luna', role: 'Copywriter', icon: '✍️', headline: 'Resultado de ejemplo (modo demo).' },
      { name: 'Pablo', role: 'Especialista en Meta Ads', icon: '📢', headline: 'Resultado de ejemplo (modo demo).' },
      { name: 'Olivia', role: 'Automatización', icon: '🤖', headline: 'Resultado de ejemplo (modo demo).' },
      { name: 'Emma', role: 'Directora Creativa', icon: '🎨', headline: 'Resultado de ejemplo (modo demo).' },
      { name: 'Clara', role: 'Directora General', icon: '👩‍💼', headline: 'Plan sintetizado (modo demo).' }
    ]
  };
}
