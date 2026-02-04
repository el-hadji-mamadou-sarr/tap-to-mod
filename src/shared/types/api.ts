export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  highScore: number;
};

export type SaveScoreRequest = {
  score: number;
  accuracy: number;
  level: number;
};

export type SaveScoreResponse = {
  type: 'saveScore';
  postId: string;
  highScore: number;
  isNewHigh: boolean;
};

export type LeaderboardEntry = {
  username: string;
  score: number;
};

export type LeaderboardResponse = {
  type: 'leaderboard';
  entries: LeaderboardEntry[];
};
