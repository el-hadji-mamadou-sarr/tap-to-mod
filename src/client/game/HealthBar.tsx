interface HealthBarProps {
  health: number;
}

export const HealthBar = ({ health }: HealthBarProps) => {
  const getHealthState = () => {
    if (health >= 60) return 'healthy';
    if (health >= 30) return 'unstable';
    if (health >= 15) return 'critical';
    return 'laststand';
  };

  const getHealthColor = () => {
    if (health >= 60) return '#22c55e';
    if (health >= 30) return '#eab308';
    return '#ef4444';
  };

  const getHealthLabel = () => {
    if (health >= 60) return 'Healthy';
    if (health >= 30) return 'Unstable';
    if (health >= 15) return 'Critical';
    return 'LAST STAND';
  };

  const healthState = getHealthState();
  const isLastStand = healthState === 'laststand';
  const isCritical = healthState === 'critical' || isLastStand;

  return (
    <div className={`health-bar-container ${isLastStand ? 'health-laststand-container' : ''}`}>
      <div className="health-bar-label">
        <span>Health</span>
        <span
          className={`health-bar-status ${isLastStand ? 'health-laststand-text' : ''}`}
          style={{ color: getHealthColor() }}
        >
          {getHealthLabel()}
          {isLastStand && <span className="warning-icon">!</span>}
        </span>
      </div>
      <div className={`health-bar-track health-track-${healthState}`}>
        <div
          className={`health-bar-fill health-fill-${healthState} ${isCritical ? 'health-critical' : ''}`}
          style={{
            width: `${health}%`,
            backgroundColor: getHealthColor(),
          }}
        />
        {/* Crack overlay for unstable state */}
        {healthState === 'unstable' && (
          <div className="health-crack-overlay" />
        )}
        {/* Danger cracks for critical/laststand */}
        {isCritical && (
          <div className="health-danger-cracks" />
        )}
      </div>
      {/* Warning symbols for critical health */}
      {isCritical && (
        <div className="health-warning-symbols">
          <span className="warning-symbol">!</span>
          <span className="warning-symbol">!</span>
        </div>
      )}
    </div>
  );
};
