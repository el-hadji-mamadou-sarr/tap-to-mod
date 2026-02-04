interface PostCardProps {
  id: string;
  title: string;
  username: string;
  karma: number;
  removed: boolean;
  removedCorrectly: boolean | null;
  y: number;
  onTap: (id: string) => void;
}

export const PostCard = ({ id, title, username, karma, removed, removedCorrectly, y, onTap }: PostCardProps) => {
  const handleClick = () => {
    if (!removed) {
      onTap(id);
    }
  };

  let cardClass = 'post-card';
  if (removed) {
    cardClass += removedCorrectly ? ' post-card-correct' : ' post-card-wrong';
  }

  return (
    <div
      className={cardClass}
      style={{
        position: 'absolute',
        top: `${y}px`,
        left: '8px',
        right: '8px',
        zIndex: removed ? 5 : 10,
      }}
      onClick={handleClick}
    >
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
        <div className={`post-stamp ${removedCorrectly ? 'stamp-correct' : 'stamp-wrong'}`}>
          {removedCorrectly ? 'REMOVED' : 'WRONG!'}
        </div>
      )}
    </div>
  );
};
