import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { startMarketSimulator } from './services/marketSimService.js';
import Stock from './models/Stock.js';
import { seedDatabase } from './seed/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Check if stocks exist; if database is empty, auto-seed
    const count = await Stock.countDocuments({});
    if (count === 0) {
      console.log('⚡ Empty database detected. Auto-seeding 100 stocks, admin, and demo users...');
      await seedDatabase();
    } else {
      console.log(`📊 Found ${count} stocks in database.`);
    }

    // Start simulated price ticker engine
    startMarketSimulator();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 [Server] SB Stocks API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Fatal server error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
