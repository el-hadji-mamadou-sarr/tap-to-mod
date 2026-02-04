import type { GameState } from '../../shared/types/game';

interface GameOverProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameOver = ({ gameState, onRestart }: GameOverProps) => {
  const totalActions = gameState.correctRemovals + gameState.wrongRemovals;
  const accuracy = totalActions > 0 ? Math.round((gameState.correctRemovals / totalActions) * 100) : 0;
  const elapsed = Math.round((Date.now() - gameState.startTime) / 1000);

  return (
    <div className="game-over-overlay" onClick={onRestart}>
      <div className="game-over-card" onClick={(e) => e.stopPropagation()}>
        <div className="game-over-title">SUBREDDIT COLLAPSED</div>
        <div className="game-over-subtitle">r/TapToMod has fallen into chaos</div>

        <div className="game-over-stats">
          <div className="stat-row">
            <span className="stat-label">Final Score</span>
            <span className="stat-value stat-score">{gameState.score}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Level Reached</span>
            <span className="stat-value">{gameState.level}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Posts Removed</span>
            <span className="stat-value">{gameState.postsRemoved}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Correct Removals</span>
            <span className="stat-value stat-good">{gameState.correctRemovals}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Wrong Removals</span>
            <span className="stat-value stat-bad">{gameState.wrongRemovals}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Missed Bad Posts</span>
            <span className="stat-value stat-bad">{gameState.missedBadPosts}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Time Survived</span>
            <span className="stat-value">{elapsed}s</span>
          </div>
        </div>

        <button className="restart-button" onClick={onRestart}>
          Try Again
        </button>

        <p className="game-over-hint">Tap anywhere to restart</p>
      </div>
    </div>
  );
};
