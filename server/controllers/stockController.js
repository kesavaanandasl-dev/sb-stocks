import * as stockService from '../services/stockService.js';
import { addSSEClient } from '../services/marketSimService.js';

/**
 * @desc    Get all stocks with search, filter, sort & pagination
 * @route   GET /api/stocks
 * @access  Public
 */
export const getStocks = async (req, res, next) => {
  try {
    const { page, limit, search, sector, sort } = req.query;
    const result = await stockService.getStocks({ page, limit, search, sector, sort });
    res.status(200).json({
      success: true,
      ...result,
      data: result.stocks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get top gainers, losers, and most active stocks
 * @route   GET /api/stocks/movers
 * @access  Public
 */
export const getTopMovers = async (req, res, next) => {
  try {
    const movers = await stockService.getTopMovers();
    res.status(200).json({
      success: true,
      data: movers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single stock details by ID or Symbol
 * @route   GET /api/stocks/:id
 * @access  Public
 */
export const getStockDetails = async (req, res, next) => {
  try {
    const stock = await stockService.getStockByIdOrSymbol(req.params.id);
    res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Subscribe to live stock price simulation ticks via SSE
 * @route   GET /api/stocks/live-ticker
 * @access  Public
 */
export const subscribeLiveTicker = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  addSSEClient(res);
};

/**
 * @desc    Create new stock (Admin)
 * @route   POST /api/stocks
 * @access  Private/Admin
 */
export const createStock = async (req, res, next) => {
  try {
    const stock = await stockService.createStock(req.body);
    res.status(201).json({
      success: true,
      data: stock
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update stock (Admin)
 * @route   PUT /api/stocks/:id
 * @access  Private/Admin
 */
export const updateStock = async (req, res, next) => {
  try {
    const stock = await stockService.updateStock(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete stock (Admin)
 * @route   DELETE /api/stocks/:id
 * @access  Private/Admin
 */
export const deleteStock = async (req, res, next) => {
  try {
    await stockService.deleteStock(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Stock deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
