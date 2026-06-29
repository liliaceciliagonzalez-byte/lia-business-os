'use client';

import { useState } from 'react';

export default function CampaignForm({ onGenerate, loading }) {
  const [form, setForm] = useState({
    business: 'Gomitas de Vinagre de Manzana Farmasi',
    country: 'España',
    goal: 'Ventas por WhatsApp',
    budget: '15 €/día',
    problem: 'Pierdo mucho tiempo creando contenido y no sé montar campañas que conviertan.'
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onGenerate(form);
  }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <label>¿Qué vendes?</label>
        <input value={form.business} onChange={(e) => update('business', e.target.value)} />
      </div>

      <div className="form-row">
        <label>País</label>
        <select value={form.country} onChange={(e) => update('country', e.target.value)}>
          <option>España</option>
          <option>Estados Unidos</option>
          <option>Venezuela</option>
          <option>México</option>
          <option>Colombia</option>
          <option>Portugal</option>
        </select>
      </div>

      <div className="form-row">
        <label>Objetivo</label>
        <select value={form.goal} onChange={(e) => update('goal', e.target.value)}>
          <option>Ventas por WhatsApp</option>
          <option>Leads</option>
          <option>Reservas</option>
          <option>Tráfico a landing page</option>
          <option>Reclutar socias</option>
        </select>
      </div>

      <div className="form-row">
        <label>Presupuesto inicial</label>
        <input value={form.budget} onChange={(e) => update('budget', e.target.value)} />
      </div>

      <div className="form-row">
        <label>Problema actual</label>
        <textarea value={form.problem} onChange={(e) => update('problem', e.target.value)} />
      </div>

      <button className="primary-btn" disabled={loading}>
        {loading ? 'LIA está trabajando...' : 'Generar campaña con LIA'}
      </button>
    </form>
  );
}
