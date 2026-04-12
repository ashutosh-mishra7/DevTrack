import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import User from './models/User.js';
import Admin from './models/Admin.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/admin', adminRoutes);

// Seed Admin Account
const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: 'devashu' });
    if (!adminExists) {
      await Admin.create({
        username: 'devashu',
        password: 'Devtrackashu',
      });
      console.log('Dedicated Admin account (devashu) seeded successfully.');
    } else if (adminExists.password && adminExists.password.startsWith('$2b$')) {
      // Migrate hashed password back to plaintext
      adminExists.password = 'Devtrackashu';
      await adminExists.save();
      console.log('Admin password migrated back to plaintext.');
    }
    
    // Cleanup old User-based admin if exists from previous iteration
    await User.findOneAndDelete({ username: 'devashu', isAdmin: true });
  } catch (error) {
    console.error('Failed to seed admin:', error);
  }
};

// Execute Seeding
seedAdmin();

app.get('/', (req, res) => {
  res.send('DevTrack API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
