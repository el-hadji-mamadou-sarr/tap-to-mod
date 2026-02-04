interface HealthBarProps {
  health: number;
}

export const HealthBar = ({ health }: HealthBarProps) => {
  const getHealthColor = () => {
    if (health >= 60) return '#22c55e';
    if (health >= 30) return '#eab308';
    return '#ef4444';
  };

  const getHealthLabel = () => {
    if (health >= 60) return 'Healthy';
    if (health >= 30) return 'Unstable';
    return 'Critical';
  };

  return (
    <div className="health-bar-container">
      <div className="health-bar-label">
        <span>Health</span>
        <span className="health-bar-status" style={{ color: getHealthColor() }}>
          {getHealthLabel()}
        </span>
      </div>
      <div className="health-bar-track">
        <div
          className={`health-bar-fill ${health < 30 ? 'health-critical' : ''}`}
          style={{
            width: `${health}%`,
            backgroundColor: getHealthColor(),
          }}
        />
      </div>
    </div>
  );
};
