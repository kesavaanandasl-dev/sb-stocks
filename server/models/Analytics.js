import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true
    },
    dailyTrades: {
      type: Number,
      default: 0
    },
    dailyVolume: {
      type: Number,
      default: 0
    },
    totalUsers: {
      type: Number,
      default: 0
    },
    topStocks: [
      {
        stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
        symbol: String,
        tradesCount: Number
      }
    ]
  },
  { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
