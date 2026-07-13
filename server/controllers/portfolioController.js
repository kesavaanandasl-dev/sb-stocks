import * as portfolioService from '../services/portfolioService.js';

export const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await portfolioService.getUserPortfolio(req.user._id);
    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    next(error);
  }
};

export const buyStock = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;
    const result = await portfolioService.executeBuyOrder(req.user._id, { stockId, quantity });
    res.status(201).json({
      success: true,
      message: 'Buy order executed successfully',
      data: result
    });
  } catch (error) {
    if (error.message.includes('Insufficient') || error.message.includes('positive integer')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const sellStock = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;
    const result = await portfolioService.executeSellOrder(req.user._id, { stockId, quantity });
    res.status(200).json({
      success: true,
      message: 'Sell order executed successfully',
      data: result
    });
  } catch (error) {
    if (error.message.includes('do not own') || error.message.includes('only own')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
