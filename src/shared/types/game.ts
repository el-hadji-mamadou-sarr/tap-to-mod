export interface LevelPost {
  title: string;
  username: string;
  karma: number;
  isBad: boolean;
  tags: string[];
}

export interface PostData extends LevelPost {
  id: string;
}

export interface Level {
  id: number;
  name: string;
  scrollSpeed: number;
  maxPostsOnScreen: number;
  spawnInterval: [number, number];
  goodPostRatio: number;
  baitPostRatio: number;
  healthDrainMultiplier: number;
  posts: LevelPost[];
}

export interface GameState {
  health: number;
  score: number;
  combo: number;
  level: number;
  postsRemoved: number;
  correctRemovals: number;
  wrongRemovals: number;
  missedBadPosts: number;
  isGameOver: boolean;
  startTime: number;
}
