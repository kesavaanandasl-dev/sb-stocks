import express from 'express';
import * as watchlistController from '../controllers/watchlistController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/', watchlistController.getWatchlist);
router.post('/', watchlistController.addToWatchlist);
router.delete('/:id', watchlistController.removeFromWatchlist);

export default router;
