import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser, authorizeAdmin);

router.get('/dashboard', adminController.getDashboardAnalytics);
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/role', adminController.changeUserRole);

export default router;
