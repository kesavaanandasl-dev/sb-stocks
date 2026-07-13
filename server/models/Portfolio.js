import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    averagePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currentPrice: {
      type: Number,
      default: 0
    },
    profitLoss: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Prevent duplicate stock entry per user
portfolioSchema.index({ userId: 1, stockId: 1 }, { unique: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
