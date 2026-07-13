import Watchlist from '../models/Watchlist.js';
import Stock from '../models/Stock.js';

/**
 * @desc    Get user watchlist
 * @route   GET /api/watchlist
 * @access  Private
 */
export const getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user._id }).populate('stockId');
    res.status(200).json({
      success: true,
      data: watchlist
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add stock to watchlist
 * @route   POST /api/watchlist
 * @access  Private
 */
export const addToWatchlist = async (req, res, next) => {
  try {
    const { stockId } = req.body;
    if (!stockId) {
      return res.status(400).json({ success: false, message: 'Stock ID is required' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const existing = await Watchlist.findOne({ userId: req.user._id, stockId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Stock is already in your watchlist' });
    }

    const item = await Watchlist.create({ userId: req.user._id, stockId });
    await item.populate('stockId');

    res.status(201).json({
      success: true,
      message: 'Added to watchlist',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove stock from watchlist
 * @route   DELETE /api/watchlist/:id
 * @access  Private
 */
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = await Watchlist.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deleted) {
      // Also check if id passed was the stockId
      deleted = await Watchlist.findOneAndDelete({ stockId: id, userId: req.user._id });
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Watchlist entry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from watchlist'
    });
  } catch (error) {
    next(error);
  }
};
