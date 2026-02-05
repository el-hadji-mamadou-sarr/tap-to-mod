import '../index.css';
import './splash.css';

import { navigateTo } from '@devvit/web/client';
import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  const [isPressed, setIsPressed] = useState(false);

  const handleStart = (e: React.MouseEvent) => {
    setIsPressed(true);
    setTimeout(() => {
      requestExpandedMode(e.nativeEvent, 'game');
    }, 150);
  };

  return (
    <div className="splash-container">
      {/* Animated background */}
      <div className="splash-bg-pattern" />

      <div className="splash-content">
        <div className="splash-header">
          <div className="splash-title">r/TapToMod</div>
          <p className="splash-subtitle">Can you keep the subreddit clean?</p>
        </div>

        <div className="splash-instructions">
          <div className="instruction-item">
            <span className="instruction-icon bad">X</span>
            <span>Tap bad posts to remove them</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon good">V</span>
            <span>Don't remove the good ones!</span>
          </div>
        </div>

        <div className="splash-legend">
          <div className="legend-item">
            <span className="legend-box bad" />
            <span>Spam / Bad</span>
          </div>
          <div className="legend-item">
            <span className="legend-box good" />
            <span>Good Posts</span>
          </div>
        </div>

        <div className="splash-button-container">
          <button
            className={`splash-button ${isPressed ? 'splash-button-pressed' : ''}`}
            onClick={handleStart}
          >
            <span className="button-text">Start Modding</span>
            <span className="button-shine" />
          </button>
        </div>

        <p className="splash-greeting">
          Hey {context.username ?? 'moderator'}! Ready to clean up?
        </p>
      </div>

      <footer className="splash-footer">
        <button
          className="footer-link"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span className="footer-divider">|</span>
        <button
          className="footer-link"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
          r/Devvit
        </button>
        <span className="footer-divider">|</span>
        <button
          className="footer-link"
          onClick={() => navigateTo('https://discord.com/invite/R7yu2wh9Qz')}
        >
          Discord
        </button>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
