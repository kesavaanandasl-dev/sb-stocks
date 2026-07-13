import express from 'express';
import * as authController from '../controllers/authController.js';
import * as authValidator from '../validators/authValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authValidator.registerValidator, validate, authController.register);
router.post('/login', authValidator.loginValidator, validate, authController.login);
router.get('/profile', authenticateUser, authController.getProfile);
router.put('/profile', authenticateUser, authValidator.updateProfileValidator, validate, authController.updateProfile);
router.put('/change-password', authenticateUser, authValidator.changePasswordValidator, validate, authController.changePassword);

export default router;
