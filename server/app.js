import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { requestLogger } from './config/logger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Security & utility middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// Rate limiting (exempt SSE endpoint)
app.use('/api', (req, res, next) => {
  if (req.path.includes('/live-ticker')) return next();
  return rateLimiter({ windowMs: 60 * 1000, max: 300 })(req, res, next);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    service: 'SB Stocks Backend API',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
