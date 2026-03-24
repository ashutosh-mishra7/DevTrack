import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      match: [/^[A-Za-z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'],
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    avatar: {
      type: Number,
      required: [true, 'Please select an avatar'],
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: String,
    emailVerificationCodeExpires: Date,
    resetPasswordCode: String,
    resetPasswordCodeExpires: Date,
    
    platforms: {
      github: { type: String, default: '' },
      leetcode: { type: String, default: '' },
      hackerrank: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      codechef: { type: String, default: '' },
    },
    
    stats: {
      githubCommits: { type: Number, default: 0 },
      githubPushes: { type: Number, default: 0 },
      githubRepos: { type: Number, default: 0 },
      leetcodeSolved: { type: Number, default: 0 },
      hackerrankSolved: { type: Number, default: 0 },
      codechefSolved: { type: Number, default: 0 },
      linkedinPosts: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      activityFlow: { type: Array, default: [] },
      lastActivityTime: { type: Date, default: Date.now },
      score: { type: Number, default: 0 },
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
