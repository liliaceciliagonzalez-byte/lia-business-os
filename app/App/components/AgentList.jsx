import { agents } from '../data/agents';

export default function AgentList() {
  return (
    <div>
      {agents.map((agent) => (
        <div className="agent" key={agent.name}>
          <div className="agent-avatar">{agent.icon}</div>
          <div>
            <strong>{agent.name}</strong>
            <small>{agent.role} · {agent.task}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
