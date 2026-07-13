import express from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', transactionController.getTransactions);

export default router;
