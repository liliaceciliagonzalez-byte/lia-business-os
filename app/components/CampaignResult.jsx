function modeLabel(mode) {
  if (mode === 'ai-multiagent') return 'Equipo IA (multiagente)';
  if (mode === 'ai') return 'Claude (IA real)';
  return 'Demo';
}

export default function CampaignResult({ result, loading }) {
  if (loading) {
    return (
      <div className="progress-box">
        <h2 style={{ color: 'white' }}>El equipo de LIA está construyendo tu campaña</h2>
        <div className="progress-line">📊 Diego analiza el mercado...</div>
        <div className="progress-line">🧠 Sofía define al cliente ideal...</div>
        <div className="progress-line">🎯 Valentina diseña la oferta...</div>
        <div className="progress-line">✍️ Luna, 📢 Pablo, 🤖 Olivia y 🎨 Emma trabajan en paralelo...</div>
        <div className="progress-line">👩‍💼 Clara revisa y sintetiza el plan final...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="progress-box">
        <h2 style={{ color: 'white' }}>Tu campaña aparecerá aquí</h2>
        <p style={{ opacity: 0.85 }}>Completa el formulario y LIA reunirá al equipo IA.</p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="error-box">
        <strong>Error:</strong> {result.error}
        {result.detail ? <p>{result.detail}</p> : null}
      </div>
    );
  }

  const sections = [
    ['Mercado', result.market],
    ['Cliente ideal', result.idealCustomer],
    ['Oferta', result.offer],
    ['Contenido', result.content],
    ['Meta Ads', result.metaAds],
    ['Automatización', result.automation],
    ['Dirección creativa', result.creative]
  ];

  return (
    <>
      <div className="card">
        <div className="tabs">
          <span className="tab">Modo: {modeLabel(result.mode)}</span>
          <span className="tab">Score: {result.score}/100</span>
          <span className="tab">Campaña inicial</span>
        </div>

        <div className="result-section">
          <h3>Resumen</h3>
          <ul><li>{result.summary}</li></ul>
        </div>

        {sections.map(([title, items]) => (
          items && items.length > 0 ? (
            <section className="result-section" key={title}>
              <h3>{title}</h3>
              <ul>
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ) : null
        ))}

        {result.diagnosis ? (
          <section className="result-section">
            <h3>Qué falta validar</h3>
            <ul><li>{result.diagnosis}</li></ul>
          </section>
        ) : null}
      </div>

      {result.agentTrace && result.agentTrace.length > 0 ? (
        <div className="card" style={{ marginTop: 22 }}>
          <h2>Así trabajó tu equipo</h2>
          {result.agentTrace.map((step, idx) => (
            <div className="agent" key={`${step.name}-${idx}`}>
              <div className="agent-avatar">{step.icon}</div>
              <div>
                <strong>{step.name} · {step.role}</strong>
                <small>{step.headline}</small>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
