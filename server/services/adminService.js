import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Transaction from '../models/Transaction.js';

export const getPlatformAnalytics = async () => {
  const [totalUsers, totalStocks, totalTrades, volumeAggregation] = await Promise.all([
    User.countDocuments({}),
    Stock.countDocuments({}),
    Transaction.countDocuments({}),
    Transaction.aggregate([
      { $group: { _id: null, totalVolume: { $sum: '$totalAmount' } } }
    ])
  ]);

  const totalVolume = volumeAggregation[0]?.totalVolume || 0;

  // Recent 10 transactions
  const recentTransactions = await Transaction.find({})
    .populate('userId', 'name email')
    .populate('stockId', 'symbol companyName')
    .sort({ createdAt: -1 })
    .limit(10);

  // Top traded stocks
  const topTraded = await Transaction.aggregate([
    { $group: { _id: '$stockId', count: { $sum: 1 }, totalValue: { $sum: '$totalAmount' } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const populatedTopTraded = await Stock.populate(topTraded, { path: '_id', select: 'symbol companyName sector' });

  return {
    totalUsers,
    totalStocks,
    totalTrades,
    totalVolume: Number(totalVolume.toFixed(2)),
    recentTransactions,
    topTradedStocks: populatedTopTraded
  };
};

export const getAllUsers = async () => {
  return await User.find({}).select('-password').sort({ createdAt: -1 });
};

export const deleteUserById = async (id) => {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error('User not found');
  }
  return true;
};

export const updateUserRole = async (id, role) => {
  const updated = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!updated) {
    throw new Error('User not found');
  }
  return updated;
};
