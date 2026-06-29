import { Home, Target, Video, Megaphone, Bot, BarChart3 } from 'lucide-react';

const items = [
  { label: 'Inicio', icon: Home, active: true },
  { label: 'Campañas', icon: Target },
  { label: 'Contenido', icon: Video },
  { label: 'Publicidad', icon: Megaphone },
  { label: 'Automatizaciones', icon: Bot },
  { label: 'Analítica', icon: BarChart3 }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">LIA</div>
      <div className="logo-subtitle">Business OS · App v0.5 · Equipo multiagente</div>
      <nav>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a className={`nav-item ${item.active ? 'active' : ''}`} href="#" key={item.label}>
              <Icon size={18} />
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
