import mongoose from 'mongoose';

const chartDataPointSchema = new mongoose.Schema({
  date: { type: String, required: true },
  price: { type: Number, required: true },
  open: { type: Number },
  high: { type: Number },
  low: { type: Number },
  volume: { type: Number }
}, { _id: false });

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    sector: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      default: 'General'
    },
    marketCap: {
      type: Number,
      required: true
    },
    exchange: {
      type: String,
      default: 'NASDAQ'
    },
    currentPrice: {
      type: Number,
      required: true
    },
    previousClose: {
      type: Number,
      required: true
    },
    openPrice: {
      type: Number,
      required: true
    },
    high: {
      type: Number,
      required: true
    },
    low: {
      type: Number,
      required: true
    },
    volume: {
      type: Number,
      default: 1000000
    },
    chartHistory: [chartDataPointSchema],
    logo: {
      type: String
    }
  },
  { timestamps: true }
);

// Index for efficient search
stockSchema.index({ symbol: 'text', companyName: 'text', sector: 1 });

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;
