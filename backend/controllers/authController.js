import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';


// 🔐 Register
export const registerUser = asyncHandler(async (req, res) => {
  const { username, name, email, password, avatar } = req.body;

  if (!username || !/^[A-Za-z0-9_-]+$/.test(username)) {
    res.status(400);
    throw new Error('Invalid username format');
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    res.status(400);
    if (userExists.username === username) {
      throw new Error('Username already exists');
    }
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    username,
    name,
    email,
    password,
    avatar,
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});


// 🔐 Login
export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid username/email or password');
  }
});


// 🔐 Change Password (NEW)
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // old password check
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Old password is incorrect');
  }

  // new password match
  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  // update password
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});