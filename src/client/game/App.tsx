import { useGame } from '../hooks/useGame';
import { PostCard } from './PostCard';
import { HealthBar } from './HealthBar';
import { GameOver } from './GameOver';

export const App = () => {
  const { gameState, activePosts, tapPost, restart, showHint, levelName, containerHeight } = useGame();

  return (
    <div className="game-root">
      {/* Top Bar */}
      <div className="game-header">
        <div className="header-left">
          <span className="subreddit-name">r/TapToMod</span>
          <span className="level-badge">Lvl {gameState.level}: {levelName}</span>
        </div>
        <div className="header-right">
          <span className="score-display">Score: {gameState.score}</span>
          {gameState.combo > 1 && (
            <span className="combo-display">x{gameState.combo}</span>
          )}
        </div>
      </div>

      {/* Health Bar */}
      <HealthBar health={gameState.health} />

      {/* Feed Area */}
      <div
        className={`game-feed ${gameState.health < 30 ? 'feed-critical' : ''}`}
        style={{ height: `${containerHeight}px` }}
      >
        {activePosts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            username={post.username}
            karma={post.karma}
            removed={post.removed}
            removedCorrectly={post.removedCorrectly}
            y={post.y}
            onTap={tapPost}
          />
        ))}

        {/* Hint overlay */}
        {showHint && (
          <div className="hint-overlay">
            <span className="hint-text">TAP ANY POST TO REMOVE</span>
          </div>
        )}
      </div>

      {/* Game Over Screen */}
      {gameState.isGameOver && (
        <GameOver gameState={gameState} onRestart={restart} />
      )}
    </div>
  );
};
