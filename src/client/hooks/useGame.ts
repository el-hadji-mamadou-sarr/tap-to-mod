import { useCallback, useEffect, useRef, useState } from 'react';
import type { PostData, GameState } from '../../shared/types/game';
import { loadLevel, getMaxLevel } from '../game/levels';

interface ActivePost extends PostData {
  y: number;
  removed: boolean;
  removedCorrectly: boolean | null;
  spawnTime: number;
}

interface UseGameReturn {
  gameState: GameState;
  activePosts: ActivePost[];
  tapPost: (postId: string) => void;
  restart: () => void;
  showHint: boolean;
  levelName: string;
  containerHeight: number;
  autoModAvailable: boolean;
  autoModActive: boolean;
  activateAutoMod: () => void;
}

const INITIAL_GAME_STATE: GameState = {
  health: 100,
  score: 0,
  combo: 0,
  level: 1,
  postsRemoved: 0,
  correctRemovals: 0,
  wrongRemovals: 0,
  missedBadPosts: 0,
  isGameOver: false,
  startTime: Date.now(),
};

const POST_HEIGHT = 90;
const CONTAINER_HEIGHT = 600;

let postIdCounter = 0;

function generatePostId(): string {
  return `post-${++postIdCounter}-${Date.now()}`;
}

const AUTO_MOD_DURATION = 4000; // 4 seconds of auto-modding

export function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState>({ ...INITIAL_GAME_STATE, startTime: Date.now() });
  const [activePosts, setActivePosts] = useState<ActivePost[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [autoModAvailable, setAutoModAvailable] = useState(true);
  const [autoModActive, setAutoModActive] = useState(false);

  const gameStateRef = useRef(gameState);
  const activePostsRef = useRef(activePosts);
  const autoModActiveRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const levelRef = useRef(loadLevel(1));
  const scoreThresholdsRef = useRef([100, 250, 500, 800]);

  gameStateRef.current = gameState;
  activePostsRef.current = activePosts;
  autoModActiveRef.current = autoModActive;

  const spawnPost = useCallback(() => {
    const level = levelRef.current;
    const currentPosts = activePostsRef.current.filter((p) => !p.removed);
    if (currentPosts.length >= level.maxPostsOnScreen) return;

    const pool = level.posts;
    const post = pool[Math.floor(Math.random() * pool.length)];
    if (!post) return;
    const newPost: ActivePost = {
      title: post.title,
      username: post.username,
      karma: post.karma,
      isBad: post.isBad,
      tags: post.tags,
      id: generatePostId(),
      y: -POST_HEIGHT,
      removed: false,
      removedCorrectly: null,
      spawnTime: Date.now(),
    };

    setActivePosts((prev) => [...prev, newPost]);
  }, []);

  const tapPost = useCallback((postId: string) => {
    const state = gameStateRef.current;
    if (state.isGameOver) return;

    setActivePosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || p.removed) return p;
        const isCorrect = p.isBad;

        setGameState((gs) => {
          if (gs.isGameOver) return gs;

          const newCombo = isCorrect ? Math.min(gs.combo + 1, 5) : 0;
          const scoreChange = isCorrect ? 10 * Math.max(newCombo, 1) : -5;
          const healthChange = isCorrect ? 0 : -15;
          const newHealth = Math.max(0, gs.health + healthChange);

          const newState: GameState = {
            ...gs,
            score: Math.max(0, gs.score + scoreChange),
            combo: newCombo,
            health: newHealth,
            postsRemoved: gs.postsRemoved + 1,
            correctRemovals: gs.correctRemovals + (isCorrect ? 1 : 0),
            wrongRemovals: gs.wrongRemovals + (isCorrect ? 0 : 1),
            isGameOver: newHealth <= 0,
          };
          return newState;
        });

        return { ...p, removed: true, removedCorrectly: isCorrect };
      })
    );
  }, []);

  const checkLevelUp = useCallback(() => {
    const state = gameStateRef.current;
    const thresholds = scoreThresholdsRef.current;
    const currentLevel = state.level;
    const maxLevel = getMaxLevel();

    const threshold = thresholds[currentLevel - 1];
    if (currentLevel < maxLevel && threshold !== undefined) {
      if (state.score >= threshold) {
        const newLevel = currentLevel + 1;
        levelRef.current = loadLevel(newLevel);
        setGameState((gs) => ({ ...gs, level: newLevel }));
      }
    }
  }, []);

  // Auto-mod: automatically remove bad posts
  const activateAutoMod = useCallback(() => {
    if (!autoModAvailable || autoModActive || gameStateRef.current.isGameOver) return;

    setAutoModAvailable(false);
    setAutoModActive(true);

    // Deactivate after duration
    setTimeout(() => {
      setAutoModActive(false);
    }, AUTO_MOD_DURATION);
  }, [autoModAvailable, autoModActive]);

  // Auto-mod logic: remove bad posts automatically when active
  const processAutoMod = useCallback(() => {
    if (!autoModActiveRef.current) return;

    const posts = activePostsRef.current;
    const badPosts = posts.filter(p => p.isBad && !p.removed);

    if (badPosts.length > 0) {
      // Remove one bad post per tick (staggered for visual effect)
      const postToRemove = badPosts[0];

      setActivePosts((prev) =>
        prev.map((p) => {
          if (p.id !== postToRemove.id || p.removed) return p;

          // Give reduced points for auto-mod (half points, no combo)
          setGameState((gs) => {
            if (gs.isGameOver) return gs;
            return {
              ...gs,
              score: gs.score + 5, // Half points
              postsRemoved: gs.postsRemoved + 1,
              correctRemovals: gs.correctRemovals + 1,
              // No combo bonus for auto-mod
            };
          });

          return { ...p, removed: true, removedCorrectly: true };
        })
      );
    }
  }, []);

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const state = gameStateRef.current;
      if (state.isGameOver) return;

      const level = levelRef.current;
      const scrollSpeed = level.scrollSpeed * 60;

      // Spawn new posts
      const timeSinceSpawn = (timestamp - lastSpawnRef.current) / 1000;
      const [minInterval, maxInterval] = level.spawnInterval;
      const spawnInterval = minInterval + Math.random() * (maxInterval - minInterval);
      if (timeSinceSpawn >= spawnInterval) {
        spawnPost();
        lastSpawnRef.current = timestamp;
      }

      // Move posts and check for missed bad posts
      setActivePosts((prev) => {
        const updated: ActivePost[] = [];
        let missedBad = 0;

        for (const post of prev) {
          if (post.removed) {
            // Keep removed posts briefly for animation, then discard
            if (Date.now() - post.spawnTime > 5000) continue;
            updated.push(post);
            continue;
          }

          const newY = post.y + scrollSpeed * delta;

          if (newY > CONTAINER_HEIGHT) {
            // Post left the screen
            if (post.isBad) {
              missedBad++;
            }
            continue;
          }

          updated.push({ ...post, y: newY });
        }

        if (missedBad > 0) {
          setGameState((gs) => {
            if (gs.isGameOver) return gs;
            const healthLoss = missedBad * 10 * level.healthDrainMultiplier;
            const newHealth = Math.max(0, gs.health - healthLoss);
            return {
              ...gs,
              missedBadPosts: gs.missedBadPosts + missedBad,
              health: newHealth,
              combo: 0,
              isGameOver: newHealth <= 0,
            };
          });
        }

        return updated;
      });

      checkLevelUp();

      // Process auto-mod if active
      processAutoMod();

      // Hide hint after 3 seconds
      if (Date.now() - state.startTime > 3000) {
        setShowHint(false);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [spawnPost, checkLevelUp, processAutoMod]
  );

  const restart = useCallback(() => {
    postIdCounter = 0;
    levelRef.current = loadLevel(1);
    lastTimeRef.current = 0;
    lastSpawnRef.current = 0;
    setActivePosts([]);
    setGameState({ ...INITIAL_GAME_STATE, startTime: Date.now() });
    setShowHint(true);
    setAutoModAvailable(true);
    setAutoModActive(false);
  }, []);

  // Start game loop
  useEffect(() => {
    if (gameState.isGameOver) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameLoop, gameState.isGameOver]);

  return {
    gameState,
    activePosts: activePosts.filter((p) => !p.removed || Date.now() - p.spawnTime < 1000),
    tapPost,
    restart,
    showHint,
    levelName: levelRef.current.name,
    containerHeight: CONTAINER_HEIGHT,
    autoModAvailable,
    autoModActive,
    activateAutoMod,
  };
}
