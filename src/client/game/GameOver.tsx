import { useState, useEffect } from 'react';
import type { GameState } from '../../shared/types/game';

interface GameOverProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameOver = ({ gameState, onRestart }: GameOverProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const totalActions = gameState.correctRemovals + gameState.wrongRemovals;
  const accuracy = totalActions > 0 ? Math.round((gameState.correctRemovals / totalActions) * 100) : 0;
  const elapsed = Math.round((Date.now() - gameState.startTime) / 1000);
  const isHighScore = gameState.score >= 500;

  // Animate score count-up
  useEffect(() => {
    const target = gameState.score;
    const duration = 1000;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setDisplayScore(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayScore(target);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [gameState.score]);

  // Staggered reveal animations
  useEffect(() => {
    const statsTimer = setTimeout(() => setShowStats(true), 600);
    const buttonTimer = setTimeout(() => setShowButton(true), 1200);

    return () => {
      clearTimeout(statsTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="game-over-overlay" onClick={onRestart}>
      <div className={`game-over-card ${isHighScore ? 'game-over-highscore' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="game-over-title">
          {isHighScore ? 'INCREDIBLE RUN!' : 'SUBREDDIT COLLAPSED'}
        </div>
        <div className="game-over-subtitle">
          {isHighScore ? 'You showed the spam who is boss!' : 'r/TapToMod has fallen into chaos'}
        </div>

        <div className="game-over-stats">
          <div className="stat-row stat-row-score">
            <span className="stat-label">Final Score</span>
            <span className={`stat-value stat-score ${isHighScore ? 'stat-score-high' : ''}`}>
              {displayScore}
            </span>
          </div>

          {showStats && (
            <>
              <div className="stat-row stat-reveal" style={{ animationDelay: '0ms' }}>
                <span className="stat-label">Level Reached</span>
                <span className="stat-value stat-level">Lvl {gameState.level}</span>
              </div>
              <div className="stat-row stat-reveal" style={{ animationDelay: '50ms' }}>
                <span className="stat-label">Accuracy</span>
                <span className={`stat-value ${accuracy >= 80 ? 'stat-good' : accuracy >= 50 ? 'stat-neutral' : 'stat-bad'}`}>
                  {accuracy}%
                </span>
              </div>
              <div className="stat-row stat-reveal" style={{ animationDelay: '100ms' }}>
                <span className="stat-label">Posts Removed</span>
                <span className="stat-value">{gameState.postsRemoved}</span>
              </div>
              <div className="stat-row stat-reveal" style={{ animationDelay: '150ms' }}>
                <span className="stat-label">Correct Removals</span>
                <span className="stat-value stat-good">{gameState.correctRemovals}</span>
              </div>
              <div className="stat-row stat-reveal" style={{ animationDelay: '200ms' }}>
                <span className="stat-label">Wrong Removals</span>
                <span className="stat-value stat-bad">{gameState.wrongRemovals}</span>
              </div>
              <div className="stat-row stat-reveal" style={{ animationDelay: '250ms' }}>
                <span className="stat-label">Missed Bad Posts</span>
                <span className="stat-value stat-bad">{gameState.missedBadPosts}</span>
              </div>
              <div className="stat-row stat-reveal" style={{ animationDelay: '300ms' }}>
                <span className="stat-label">Time Survived</span>
                <span className="stat-value">{elapsed}s</span>
              </div>
            </>
          )}
        </div>

        {showButton && (
          <button className="restart-button button-reveal" onClick={onRestart}>
            Try Again
          </button>
        )}

        <p className={`game-over-hint ${showButton ? 'hint-reveal' : ''}`}>
          Tap anywhere to restart
        </p>
      </div>
    </div>
  );
};
