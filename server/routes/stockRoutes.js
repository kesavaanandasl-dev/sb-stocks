import express from 'express';
import * as stockController from '../controllers/stockController.js';
import * as stockValidator from '../validators/stockValidator.js';
import { validate } from '../middleware/validate.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', stockController.getStocks);
router.get('/movers', stockController.getTopMovers);
router.get('/live-ticker', stockController.subscribeLiveTicker);
router.get('/:id', stockController.getStockDetails);

// Protected Admin routes
router.post('/', authenticateUser, authorizeAdmin, stockValidator.createStockValidator, validate, stockController.createStock);
router.put('/:id', authenticateUser, authorizeAdmin, stockController.updateStock);
router.delete('/:id', authenticateUser, authorizeAdmin, stockController.deleteStock);

export default router;
