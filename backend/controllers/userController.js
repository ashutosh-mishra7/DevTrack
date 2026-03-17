import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

import {
  getGitHubStats,
  getLeetCodeStats,
  getHackerRankStatsMock,
  getLinkedInStatsMock,
  calculateTotalScore
} from '../utils/fetchPlatformStats.js';


// @desc Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

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

  user.platforms.github = req.body.github || user.platforms.github;
  user.platforms.leetcode = req.body.leetcode || user.platforms.leetcode;
  user.platforms.hackerrank = req.body.hackerrank || user.platforms.hackerrank;
  user.platforms.linkedin = req.body.linkedin || user.platforms.linkedin;

  if (user.platforms.github) {
    const ghStats = await getGitHubStats(user.platforms.github);
    user.stats.githubCommits = ghStats.commits;
    user.stats.githubPushes = ghStats.pushes;
    user.stats.githubRepos = ghStats.repos;
  }

  if (user.platforms.leetcode) {
    const lcStats = await getLeetCodeStats(user.platforms.leetcode);
    user.stats.leetcodeSolved = lcStats.solved;
  }

  if (user.platforms.hackerrank) {
    const hrStats = getHackerRankStatsMock(user.platforms.hackerrank);
    user.stats.hackerrankProgress = hrStats.progress;
  }

  if (user.platforms.linkedin) {
    const liStats = getLinkedInStatsMock(user.platforms.linkedin);
    user.stats.linkedinPosts = liStats.posts;
  }

  if (user.stats.githubCommits > 0 || user.stats.leetcodeSolved > 0) {
    user.stats.streak = (user.stats.streak || 0) + 1;
  }

  user.stats.score = calculateTotalScore(user.stats);

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    platforms: updatedUser.platforms,
    stats: updatedUser.stats,
  });
});


// @desc Update settings (NO OTP)
export const updateUserSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // name
  user.name = req.body.name || user.name;

  // avatar
  if (req.body.avatar) {
    user.avatar = req.body.avatar;
  }

  // 🔐 password change (simple)
  if (req.body.oldPassword && req.body.newPassword) {
    if (await user.matchPassword(req.body.oldPassword)) {
      user.password = req.body.newPassword;
    } else {
      res.status(400);
      throw new Error('Incorrect old password');
    }
  }

  // 📧 email change (direct, no OTP)
  if (req.body.newEmail && req.body.newEmail !== user.email) {
    user.email = req.body.newEmail;
  }

  const updatedUser = await user.save();

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

  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    chartData.push({
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      commits: Math.floor(Math.random() * (user.stats.githubCommits > 0 ? 5 : 1)),
      problems: Math.floor(Math.random() * (user.stats.leetcodeSolved > 0 ? 3 : 1)),
    });
  }

  res.json({
    stats: user.stats,
    chartData
  });
});


// @desc Leaderboard
export const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find()
    .sort({ 'stats.score': -1 })
    .limit(50)
    .select('username stats.score avatar name');

  res.json(users);
});