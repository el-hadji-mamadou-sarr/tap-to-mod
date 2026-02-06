import { useState } from 'react';

interface PostCardProps {
  id: string;
  title: string;
  username: string;
  karma: number;
  removed: boolean;
  removedCorrectly: boolean | null;
  y: number;
  isBad: boolean;
  onTap: (id: string, event?: React.MouseEvent) => void;
}

export const PostCard = ({ id, title, username, karma, removed, removedCorrectly, y, isBad, onTap }: PostCardProps) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    if (!removed) {
      // Add ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleId = Date.now();
      setRipples(prev => [...prev, { id: rippleId, x, y }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== rippleId));
      }, 600);

      onTap(id, e);
    }
  };

  let cardClass = 'post-card';
  if (removed) {
    cardClass += removedCorrectly ? ' post-card-correct' : ' post-card-wrong';
  } else {
    // Add subtle visual hint for bad posts (very subtle, shouldn't make it obvious)
    cardClass += isBad ? ' post-card-suspicious' : ' post-card-clean';
  }

  return (
    <div
      className={cardClass}
      data-post-id={id}
      style={{
        position: 'absolute',
        top: `${y}px`,
        left: '8px',
        right: '8px',
        zIndex: removed ? 5 : 10,
      }}
      onClick={handleClick}
    >
      {/* Tap ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="tap-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      <div className="post-card-content">
        <div className="post-title">{title}</div>
        <div className="post-meta">
          <span className="post-username">u/{username}</span>
          <span className={`post-karma ${karma < 0 ? 'karma-negative' : 'karma-positive'}`}>
            karma: {karma}
          </span>
        </div>
      </div>
      {removed && (
        <>
          <div className={`post-stamp ${removedCorrectly ? 'stamp-correct' : 'stamp-wrong'}`}>
            {removedCorrectly ? 'REMOVED' : 'WRONG!'}
          </div>
          {removedCorrectly && (
            <div className="post-stamp stamp-banned">
              BANNED
            </div>
          )}
        </>
      )}
    </div>
  );
};
