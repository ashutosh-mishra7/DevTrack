import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

import {
  getGitHubStats,
  getLeetCodeStats,
  getHackerRankStatsMock,
  getLinkedInStatsMock,
  getCodeChefStatsMock,
  calculateTotalScore
} from '../utils/fetchPlatformStats.js';


// @desc Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // ✅ Cache disable
  res.set('Cache-Control', 'no-store');
  res.json({
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    platforms: user.platforms,
    stats: user.stats,
  });
});


// @desc Update profile + stats
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // ✅ Fixed: req.body.platforms se read karo
  user.platforms.github = req.body.platforms?.github !== undefined ? req.body.platforms.github : user.platforms.github;
  user.platforms.leetcode = req.body.platforms?.leetcode !== undefined ? req.body.platforms.leetcode : user.platforms.leetcode;
  user.platforms.hackerrank = req.body.platforms?.hackerrank !== undefined ? req.body.platforms.hackerrank : user.platforms.hackerrank;
  user.platforms.linkedin = req.body.platforms?.linkedin !== undefined ? req.body.platforms.linkedin : user.platforms.linkedin;
  user.platforms.codechef = req.body.platforms?.codechef !== undefined ? req.body.platforms.codechef : user.platforms.codechef;

  if (user.platforms.github) {
    const ghStats = await getGitHubStats(user.platforms.github);
    user.stats.githubCommits = ghStats.commits;
    user.stats.githubPushes = ghStats.pushes;
    user.stats.githubRepos = ghStats.repos;
    user.stats.activityFlow = ghStats.activityFlow;
  } else {
    user.stats.githubCommits = 0;
    user.stats.githubPushes = 0;
    user.stats.githubRepos = 0;
    user.stats.activityFlow = [];
  }

  if (user.platforms.leetcode) {
    const lcStats = await getLeetCodeStats(user.platforms.leetcode);
    user.stats.leetcodeSolved = lcStats.solved;
  } else {
    user.stats.leetcodeSolved = 0;
  }

  if (user.platforms.hackerrank) {
    const hrStats = getHackerRankStatsMock(user.platforms.hackerrank);
    user.stats.hackerrankSolved = hrStats.solved;
  } else {
    user.stats.hackerrankSolved = 0;
  }

  if (user.platforms.linkedin) {
    const liStats = getLinkedInStatsMock(user.platforms.linkedin);
    user.stats.linkedinPosts = liStats.posts;
  } else {
    user.stats.linkedinPosts = 0;
  }

  if (user.platforms.codechef) {
    const ccStats = getCodeChefStatsMock(user.platforms.codechef);
    user.stats.codechefSolved = ccStats.solved;
  } else {
    user.stats.codechefSolved = 0;
  }

  if (user.stats.githubCommits > 0 || user.stats.leetcodeSolved > 0) {
    user.stats.streak = (user.stats.streak || 0) + 1;
  }

  user.stats.score = calculateTotalScore(user.stats);

  const updatedUser = await user.save();

  // ✅ Cache disable
  res.set('Cache-Control', 'no-store');
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    platforms: updatedUser.platforms,
    stats: updatedUser.stats,
  });
});


// @desc Update settings
export const updateUserSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update Username
  if (req.body.username && req.body.username !== user.username) {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      res.status(400);
      throw new Error('Username already taken');
    }
    user.username = req.body.username;
  }

  user.name = req.body.name || user.name;

  if (req.body.avatar) {
    user.avatar = req.body.avatar;
  }

  if (req.body.oldPassword && req.body.newPassword) {
    if (await user.matchPassword(req.body.oldPassword)) {
      user.password = req.body.newPassword;
    } else {
      res.status(400);
      throw new Error('Incorrect old password');
    }
  }

  if (req.body.newEmail && req.body.newEmail !== user.email) {
    user.email = req.body.newEmail;
  }

  const updatedUser = await user.save();

  res.set('Cache-Control', 'no-store');
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
  });
});


// @desc Dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const allUsers = await User.find().sort({ 'stats.score': -1 }).select('_id');
  const rankPosition = allUsers.findIndex(u => u._id.toString() === user._id.toString()) + 1;
  const totalUsers = allUsers.length;

  let chartData = user.stats.activityFlow;

  if (!chartData || chartData.length === 0) {
    chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      chartData.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        commits: 0
      });
    }
  }

  res.set('Cache-Control', 'no-store');
  res.json({
    stats: user.stats,
    chartData,
    rankPosition,
    totalUsers
  });
});


// @desc Leaderboard
export const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find()
    .sort({ 'stats.score': -1 })
    .limit(50)
    .select('username stats.score avatar name');

  res.set('Cache-Control', 'no-store');
  res.json(users);
});