export default function HistoryPanel({ campaigns, onClear }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <h2>Historial local</h2>
        <button className="secondary-btn" onClick={onClear}>Limpiar</button>
      </div>
      {campaigns.length === 0 ? (
        <p style={{ color: '#75706B' }}>Todavía no hay campañas guardadas.</p>
      ) : (
        campaigns.map((campaign, index) => (
          <div className="history-item" key={`${campaign.summary}-${index}`}>
            <strong>{campaign.summary || 'Campaña sin título'}</strong>
            <small>Score: {campaign.score}/100 · Modo: {campaign.mode}</small>
          </div>
        ))
      )}
    </div>
  );
}
