import User from '../models/User.js';
import Admin from '../models/Admin.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  const admin = await Admin.findOne({ username });
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private/Admin
export const resetUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (req.body.newPassword) {
      user.password = req.body.newPassword;
      await user.save();
      
      res.json({ message: `Password for ${user.username} has been reset successfully.` });
    } else {
      res.status(400);
      throw new Error('Please provide a new password');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
