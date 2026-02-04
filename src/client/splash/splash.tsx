import '../index.css';

import { navigateTo } from '@devvit/web/client';
import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4 bg-white">
      <div className="flex flex-col items-center gap-1">
        <div className="text-4xl font-black text-[#1a1a1b] tracking-tight">r/TapToMod</div>
        <p className="text-sm text-gray-500">Can you keep the subreddit clean?</p>
      </div>

      <div className="flex flex-col items-center gap-3 mt-2">
        <div className="flex flex-col items-center gap-1 text-sm text-gray-600">
          <span>Tap bad posts to remove them</span>
          <span>Don't remove the good ones!</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mt-2 text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-red-100 border border-red-300" /> Spam
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-green-100 border border-green-300" /> Good
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center mt-5">
        <button
          className="flex items-center justify-center bg-[#d93900] text-white w-auto h-12 rounded-full cursor-pointer transition-colors px-8 text-lg font-bold hover:bg-[#c13000] active:scale-95"
          onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
        >
          Start Modding
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-1">
        Hey {context.username ?? 'moderator'}! Ready to clean up?
      </p>

      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-gray-600">
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span className="text-gray-300">|</span>
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
          r/Devvit
        </button>
        <span className="text-gray-300">|</span>
        <button
          className="cursor-pointer"
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
