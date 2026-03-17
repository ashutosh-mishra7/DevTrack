import axios from 'axios';

// GitHub Stats
export const getGitHubStats = async (username) => {
  if (!username) return { commits: 0, pushes: 0, repos: 0 };
  
  try {
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const repos = userRes.data.public_repos;
    
    // Simplistic commit/push tracking using recent events
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

// LeetCode Stats
export const getLeetCodeStats = async (username) => {
  if (!username) return { solved: 0 };
  
  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const res = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = res.data.data.matchedUser;
    if (data && data.submitStats && data.submitStats.acSubmissionNum) {
      const allStats = data.submitStats.acSubmissionNum.find(stat => stat.difficulty === 'All');
      return { solved: allStats ? allStats.count : 0 };
    }
    
    return { solved: 0 };
  } catch (error) {
    console.error(`Error fetching LeetCode stats for ${username}:`, error.message);
    return { solved: 0 };
  }
};

// HackerRank Stats (Mock due to harsh scraping protections/lack of public API)
export const getHackerRankStatsMock = (username) => {
  if (!username) return { progress: 0 };
  // Deterministic mock based on username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return { progress: Math.abs(hash) % 500 }; 
};

// LinkedIn Stats (Mock due to extreme scraping protections)
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
  // Ranking factors as required:
  // GitHub commits 30%
  // LeetCode problems 25%
  // HackerRank progress 20%
  // LinkedIn posts 15%
  // Consistency 10%
  // We'll normalize this by multiplying by weights
  
  const score = (stats.githubCommits * 0.30) +
                (stats.leetcodeSolved * 0.25) +
                (stats.hackerrankProgress * 0.20) +
                (stats.linkedinPosts * 0.15) +
                (stats.streak * 0.10);
                
  return Math.floor(score);
};
