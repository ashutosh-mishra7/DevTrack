import axios from 'axios';

// GitHub Stats
export const getGitHubStats = async (username) => {
  if (!username) return { commits: 0, pushes: 0, repos: 0 };
  
  try {
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const repos = userRes.data.public_repos;
    
    const eventsRes = await axios.get(`https://api.github.com/users/${username}/events/public?per_page=100`);
    const events = eventsRes.data;
    
    let pushes = 0;
    let commits = 0;
    
    events.forEach(event => {
      if (event.type === 'PushEvent') {
        pushes += 1;
        commits += event.payload.commits ? event.payload.commits.length : 0;
      }
    });

    return { commits, pushes, repos };
  } catch (error) {
    console.error(`Error fetching GitHub stats for ${username}:`, error.message);
    return { commits: 0, pushes: 0, repos: 0 };
  }
};

// ✅ Fixed: LeetCode - alternate public API
// ✅ alfa-leetcode-api — most reliable alternative
export const getLeetCodeStats = async (username) => {
  if (!username) return { solved: 0 };
  
  try {
    const res = await axios.get(
      `https://alfa-leetcode-api.onrender.com/${username}/solved`
    );
    
    if (res.data && res.data.solvedProblem !== undefined) {
      return { solved: res.data.solvedProblem };
    }
    
    return { solved: 0 };
  } catch (error) {
    console.error(`Error fetching LeetCode stats for ${username}:`, error.message);
    return { solved: 0 };
  }
};

// HackerRank Stats (Mock)
export const getHackerRankStatsMock = (username) => {
  if (!username) return { progress: 0 };
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return { progress: Math.abs(hash) % 500 };
};

// LinkedIn Stats (Mock)
export const getLinkedInStatsMock = (username) => {
  if (!username) return { posts: 0 };
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return { posts: Math.abs(hash) % 100 };
};

// Calculate Score
export const calculateTotalScore = (stats) => {
  const score = (stats.githubCommits * 0.30) +
                (stats.leetcodeSolved * 0.25) +
                (stats.hackerrankProgress * 0.20) +
                (stats.linkedinPosts * 0.15) +
                (stats.streak * 0.10);
                
  return Math.floor(score);
};