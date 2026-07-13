import Transaction from '../models/Transaction.js';

/**
 * @desc    Get user transactions with filter & sorting
 * @route   GET /api/transactions
 * @access  Private
 */
export const getTransactions = async (req, res, next) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    const query = { userId: req.user._id };

    if (type && (type === 'BUY' || type === 'SELL')) {
      query.transactionType = type;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('stockId', 'symbol companyName sector logo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};
