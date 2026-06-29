'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import AgentList from './components/AgentList';
import CampaignForm from './components/CampaignForm';
import CampaignResult from './components/CampaignResult';
import HistoryPanel from './components/HistoryPanel';

export default function HomePage() {
  const [result, setResult] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('lia_campaigns');
    if (saved) setCampaigns(JSON.parse(saved));
  }, []);

  function saveCampaign(campaign) {
    if (campaign.error) return;
    const next = [campaign, ...campaigns].slice(0, 8);
    setCampaigns(next);
    window.localStorage.setItem('lia_campaigns', JSON.stringify(next));
  }

  async function generateCampaign(form) {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      setResult(data);
      saveCampaign(data);
    } catch (error) {
      setResult({ error: 'Error de conexión', detail: error.message });
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    setCampaigns([]);
    window.localStorage.removeItem('lia_campaigns');
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <header className="header">
          <div>
            <h1>Crear campaña completa</h1>
            <p>LIA analiza tu negocio, define cliente ideal, crea contenido y recomienda una campaña inicial.</p>
          </div>
          <div className="status-pill">Motor: Claude (Anthropic)</div>
        </header>

        <section className="grid three" style={{ marginBottom: 22 }}>
          <div className="kpi"><strong>{campaigns.length}</strong><span>Campañas guardadas</span></div>
          <div className="kpi"><strong>6</strong><span>Agentes IA definidos</span></div>
          <div className="kpi"><strong>v0.5</strong><span>Equipo multiagente</span></div>
        </section>

        <section className="grid two">
          <div className="card">
            <h2>Brief inteligente</h2>
            <CampaignForm onGenerate={generateCampaign} loading={loading} />
          </div>

          <div className="card">
            <h2>Equipo IA asignado</h2>
            <AgentList />
          </div>
        </section>

        <section style={{ marginTop: 22 }}>
          <CampaignResult result={result} loading={loading} />
        </section>

        <section style={{ marginTop: 22 }}>
          <HistoryPanel campaigns={campaigns} onClear={clearHistory} />
        </section>
      </main>
    </div>
  );
}
