import express from 'express';
import { getAllUsers, resetUserPassword, adminLogin } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.route('/users').get(protectAdmin, getAllUsers);
router.route('/users/:id/reset-password').put(protectAdmin, resetUserPassword);

export default router;
