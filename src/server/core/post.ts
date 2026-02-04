import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'Tap to Mod - Can you keep the subreddit clean?',
  });
};
