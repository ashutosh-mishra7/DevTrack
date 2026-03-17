import User from '../models/User.js';
import {
  getGitHubStats,
  getLeetCodeStats,
  getHackerRankStatsMock,
  getLinkedInStatsMock
} from '../utils/stats.js';

export const updateUserProfile = async (req, res) => {
  try {
    const { platforms } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ SAVE PLATFORMS
    user.platforms = platforms;

    // 🔥 FETCH REAL STATS
    const github = await getGitHubStats(platforms.github);
    const leetcode = await getLeetCodeStats(platforms.leetcode);
    const hackerrank = getHackerRankStatsMock(platforms.hackerrank);
    const linkedin = getLinkedInStatsMock(platforms.linkedin);

    // ✅ BUILD STATS OBJECT
    const stats = {
      githubCommits: github.commits,
      githubRepos: github.repos,
      leetcodeSolved: leetcode.solved,
      hackerrankProgress: hackerrank.progress,
      linkedinPosts: linkedin.posts,
      streak: 10 // later improve
    };

    user.stats = stats;

    await user.save();

    // ✅ RESPONSE (IMPORTANT)
    res.json({
      platforms: user.platforms,
      stats: user.stats
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};