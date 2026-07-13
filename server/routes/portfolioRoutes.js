import express from 'express';
import * as portfolioController from '../controllers/portfolioController.js';
import { tradeValidator } from '../validators/tradeValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', portfolioController.getPortfolio);
router.post('/buy', tradeValidator, validate, portfolioController.buyStock);
router.post('/sell', tradeValidator, validate, portfolioController.sellStock);

export default router;
