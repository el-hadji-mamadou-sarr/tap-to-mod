import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { PostCard } from './PostCard';
import { HealthBar } from './HealthBar';
import { GameOver } from './GameOver';

interface FloatingScore {
  id: string;
  value: number;
  x: number;
  y: number;
  isCorrect: boolean;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  life: number;
}

export const App = () => {
  const { gameState, activePosts, tapPost, restart, showHint, levelName, containerHeight } = useGame();
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [damageShake, setDamageShake] = useState(false);
  const [levelUpEffect, setLevelUpEffect] = useState(false);
  const [tapRipples, setTapRipples] = useState<{ id: string; x: number; y: number }[]>([]);
  const prevHealthRef = useRef(gameState.health);
  const prevLevelRef = useRef(gameState.level);
  const prevScoreRef = useRef(gameState.score);
  const floatingIdRef = useRef(0);
  const particleIdRef = useRef(0);

  const isLastStand = gameState.health < 15 && gameState.health > 0;
  const isCritical = gameState.health < 30 && gameState.health >= 15;

  // Create particles burst
  const createParticles = useCallback((x: number, y: number, isCorrect: boolean) => {
    const colors = isCorrect
      ? ['#22c55e', '#16a34a', '#15803d', '#4ade80']
      : ['#ef4444', '#dc2626', '#f97316', '#fbbf24'];
    const newParticles: Particle[] = [];
    const count = isCorrect ? 12 : 8;

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${++particleIdRef.current}`,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (Math.PI * 2 * i) / count + Math.random() * 0.5,
        speed: 2 + Math.random() * 3,
        life: 1,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Handle tap with effects
  const handleTap = useCallback((postId: string, event?: React.MouseEvent) => {
    const post = activePosts.find(p => p.id === postId);
    if (!post || post.removed) return;

    // Add tap ripple
    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rippleId = `ripple-${Date.now()}`;
      setTapRipples(prev => [...prev, { id: rippleId, x, y }]);
      setTimeout(() => {
        setTapRipples(prev => prev.filter(r => r.id !== rippleId));
      }, 600);
    }

    // Get post position for effects
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
      const rect = postElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const isCorrect = post.isBad;

      // Create particles
      createParticles(centerX, centerY, isCorrect);

      // Create floating score
      const scoreChange = isCorrect ? 10 * Math.max(gameState.combo + 1, 1) : -5;
      setFloatingScores(prev => [...prev, {
        id: `score-${++floatingIdRef.current}`,
        value: scoreChange,
        x: centerX,
        y: centerY,
        isCorrect,
      }]);
    }

    tapPost(postId);
  }, [activePosts, tapPost, createParticles, gameState.combo]);

  // Detect damage for screen shake
  useEffect(() => {
    if (gameState.health < prevHealthRef.current) {
      setDamageShake(true);
      setTimeout(() => setDamageShake(false), 300);
    }
    prevHealthRef.current = gameState.health;
  }, [gameState.health]);

  // Detect level up for celebration
  useEffect(() => {
    if (gameState.level > prevLevelRef.current) {
      setLevelUpEffect(true);
      setTimeout(() => setLevelUpEffect(false), 500);
    }
    prevLevelRef.current = gameState.level;
  }, [gameState.level]);

  // Clean up floating scores
  useEffect(() => {
    if (floatingScores.length > 0) {
      const timer = setTimeout(() => {
        setFloatingScores(prev => prev.slice(1));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [floatingScores]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed + 1,
            life: p.life - 0.05,
            speed: p.speed * 0.95,
          }))
          .filter(p => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length > 0]);

  // Get feed class based on health state
  const getFeedClass = () => {
    let classes = 'game-feed';
    if (isLastStand) {
      classes += ' feed-laststand';
    } else if (isCritical) {
      classes += ' feed-critical';
    }
    if (damageShake) {
      classes += ' damage-shake';
    }
    if (levelUpEffect) {
      classes += ' levelup-shake';
    }
    return classes;
  };

  // Get combo class based on combo level
  const getComboClass = () => {
    let classes = 'combo-display';
    if (gameState.combo >= 5) classes += ' combo-max';
    else if (gameState.combo >= 3) classes += ' combo-high';
    return classes;
  };

  return (
    <div className={`game-root ${damageShake ? 'damage-shake' : ''}`}>
      {/* Vignette for Last Stand */}
      {isLastStand && !gameState.isGameOver && (
        <>
          <div className="vignette-overlay" />
          <div className="heartbeat-overlay" />
        </>
      )}

      {/* Top Bar */}
      <div className="game-header">
        <div className="header-left">
          <span className="subreddit-name">r/TapToMod</span>
          <span className={`level-badge ${levelUpEffect ? 'level-up-badge' : ''}`}>
            Lvl {gameState.level}: {levelName}
          </span>
        </div>
        <div className="header-right">
          <span className="score-display">Score: {gameState.score}</span>
          {gameState.combo > 1 && (
            <span className={getComboClass()}>x{gameState.combo}</span>
          )}
        </div>
      </div>

      {/* Health Bar */}
      <HealthBar health={gameState.health} />

      {/* Feed Area */}
      <div
        className={getFeedClass()}
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
            isBad={post.isBad}
            onTap={handleTap}
          />
        ))}

        {/* Hint overlay */}
        {showHint && (
          <div className="hint-overlay">
            <span className="hint-text">TAP BAD POSTS TO REMOVE</span>
          </div>
        )}
      </div>

      {/* Floating Score Popups */}
      {floatingScores.map((score) => (
        <div
          key={score.id}
          className={`floating-score ${score.isCorrect ? 'floating-score-correct' : 'floating-score-wrong'}`}
          style={{
            left: score.x,
            top: score.y,
          }}
        >
          {score.value > 0 ? '+' : ''}{score.value}
        </div>
      ))}

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
          }}
        />
      ))}

      {/* Level Up Notification */}
      {levelUpEffect && (
        <div className="level-up-notification">
          LEVEL UP!
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.isGameOver && (
        <GameOver gameState={gameState} onRestart={restart} />
      )}
    </div>
  );
};
