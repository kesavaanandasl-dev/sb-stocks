import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import Stock from '../models/Stock.js';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import Transaction from '../models/Transaction.js';
import Watchlist from '../models/Watchlist.js';
import Analytics from '../models/Analytics.js';
import { sampleStocks } from './stocksData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');

    // Clear existing collections
    await Stock.deleteMany({});
    await User.deleteMany({});
    await Portfolio.deleteMany({});
    await Transaction.deleteMany({});
    await Watchlist.deleteMany({});
    await Analytics.deleteMany({});

    // 1. Seed Stocks
    const createdStocks = await Stock.insertMany(sampleStocks);
    console.log(`✅ Seeded ${createdStocks.length} Stocks across 10 sectors.`);

    // 2. Seed Admin User
    const adminUser = await User.create({
      name: 'Platform Administrator',
      email: 'admin@sbstocks.com',
      password: 'Admin@12345',
      role: 'ADMIN',
      balance: 1000000,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    });
    console.log(`✅ Created Admin account: admin@sbstocks.com / Admin@12345`);

    // 3. Seed Demo Trader User
    const demoTrader = await User.create({
      name: 'Alex Rivera (Demo Trader)',
      email: 'trader@sbstocks.com',
      password: 'Trader@12345',
      role: 'USER',
      balance: 100000,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80'
    });
    console.log(`✅ Created Demo Trader account: trader@sbstocks.com / Trader@12345 ($100,000 cash balance)`);

    // 4. Create sample initial portfolio for Demo Trader
    const aapl = createdStocks.find(s => s.symbol === 'AAPL');
    const nvda = createdStocks.find(s => s.symbol === 'NVDA');
    const msft = createdStocks.find(s => s.symbol === 'MSFT');

    if (aapl && nvda && msft) {
      await Portfolio.create([
        {
          userId: demoTrader._id,
          stockId: aapl._id,
          quantity: 20,
          averagePrice: 220.00,
          currentPrice: aapl.currentPrice,
          profitLoss: Number(((aapl.currentPrice - 220.00) * 20).toFixed(2))
        },
        {
          userId: demoTrader._id,
          stockId: nvda._id,
          quantity: 50,
          averagePrice: 115.00,
          currentPrice: nvda.currentPrice,
          profitLoss: Number(((nvda.currentPrice - 115.00) * 50).toFixed(2))
        },
        {
          userId: demoTrader._id,
          stockId: msft._id,
          quantity: 15,
          averagePrice: 430.00,
          currentPrice: msft.currentPrice,
          profitLoss: Number(((msft.currentPrice - 430.00) * 15).toFixed(2))
        }
      ]);

      await Transaction.create([
        {
          userId: demoTrader._id,
          stockId: aapl._id,
          transactionType: 'BUY',
          quantity: 20,
          price: 220.00,
          totalAmount: 4400.00
        },
        {
          userId: demoTrader._id,
          stockId: nvda._id,
          transactionType: 'BUY',
          quantity: 50,
          price: 115.00,
          totalAmount: 5750.00
        },
        {
          userId: demoTrader._id,
          stockId: msft._id,
          transactionType: 'BUY',
          quantity: 15,
          price: 430.00,
          totalAmount: 6450.00
        }
      ]);

      await Watchlist.create([
        { userId: demoTrader._id, stockId: aapl._id },
        { userId: demoTrader._id, stockId: nvda._id },
        { userId: demoTrader._id, stockId: createdStocks.find(s => s.symbol === 'TSLA')?._id || aapl._id }
      ]);
    }

    // 5. Seed Analytics record
    await Analytics.create({
      date: new Date().toISOString().split('T')[0],
      dailyTrades: 42,
      dailyVolume: 1250000,
      totalUsers: 2,
      topStocks: [
        { stockId: nvda?._id, symbol: 'NVDA', tradesCount: 18 },
        { stockId: aapl?._id, symbol: 'AAPL', tradesCount: 14 }
      ]
    });

    console.log('✅ Seeding completed successfully!');
    return { createdStocks, adminUser, demoTrader };
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    throw error;
  }
};

// Run directly if invoked from CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
