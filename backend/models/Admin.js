import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

adminSchema.methods.matchPassword = async function (enteredPassword) {
  // Directly compare plaintext
  return enteredPassword === this.password;
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
