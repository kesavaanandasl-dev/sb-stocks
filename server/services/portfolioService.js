import Portfolio from '../models/Portfolio.js';
import Stock from '../models/Stock.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getUserPortfolio = async (userId) => {
  const holdings = await Portfolio.find({ userId }).populate('stockId');

  // Recalculate current price and P&L for each holding
  let totalInvestment = 0;
  let totalCurrentValue = 0;

  const updatedHoldings = await Promise.all(
    holdings.map(async (h) => {
      if (!h.stockId) return h;
      const currentPrice = h.stockId.currentPrice;
      const invested = h.quantity * h.averagePrice;
      const value = h.quantity * currentPrice;
      const profitLoss = Number((value - invested).toFixed(2));
      const percentageGain = Number(((profitLoss / invested) * 100).toFixed(2));

      h.currentPrice = currentPrice;
      h.profitLoss = profitLoss;
      await h.save();

      totalInvestment += invested;
      totalCurrentValue += value;

      return {
        _id: h._id,
        stock: h.stockId,
        quantity: h.quantity,
        averagePrice: h.averagePrice,
        currentPrice,
        profitLoss,
        percentageGain,
        investedAmount: Number(invested.toFixed(2)),
        currentValue: Number(value.toFixed(2))
      };
    })
  );

  const totalProfitLoss = Number((totalCurrentValue - totalInvestment).toFixed(2));
  const totalPercentageGain = totalInvestment > 0 ? Number(((totalProfitLoss / totalInvestment) * 100).toFixed(2)) : 0;

  return {
    holdings: updatedHoldings,
    summary: {
      totalInvestment: Number(totalInvestment.toFixed(2)),
      totalCurrentValue: Number(totalCurrentValue.toFixed(2)),
      totalProfitLoss,
      totalPercentageGain
    }
  };
};

export const executeBuyOrder = async (userId, { stockId, quantity }) => {
  const qty = Number(quantity);
  if (!qty || qty <= 0 || !Number.isInteger(qty)) {
    throw new Error('Quantity must be a positive integer');
  }

  const [user, stock] = await Promise.all([
    User.findById(userId),
    Stock.findById(stockId)
  ]);

  if (!stock) throw new Error('Stock not found');
  if (!user) throw new Error('User not found');

  const price = stock.currentPrice;
  const totalAmount = Number((price * qty).toFixed(2));

  if (user.balance < totalAmount) {
    throw new Error(`Insufficient virtual balance. Order requires $${totalAmount.toLocaleString()}, but balance is $${user.balance.toLocaleString()}`);
  }

  // Deduct balance
  user.balance = Number((user.balance - totalAmount).toFixed(2));
  await user.save();

  // Update or create portfolio holding
  let holding = await Portfolio.findOne({ userId, stockId });

  if (holding) {
    const newQuantity = holding.quantity + qty;
    const totalInvested = holding.quantity * holding.averagePrice + totalAmount;
    const newAveragePrice = Number((totalInvested / newQuantity).toFixed(2));

    holding.quantity = newQuantity;
    holding.averagePrice = newAveragePrice;
    holding.currentPrice = price;
    holding.profitLoss = Number(((price - newAveragePrice) * newQuantity).toFixed(2));
    await holding.save();
  } else {
    holding = await Portfolio.create({
      userId,
      stockId,
      quantity: qty,
      averagePrice: price,
      currentPrice: price,
      profitLoss: 0
    });
  }

  // Create ledger transaction
  const transaction = await Transaction.create({
    userId,
    stockId,
    transactionType: 'BUY',
    quantity: qty,
    price,
    totalAmount
  });

  return {
    holding,
    transaction,
    newBalance: user.balance
  };
};

export const executeSellOrder = async (userId, { stockId, quantity }) => {
  const qty = Number(quantity);
  if (!qty || qty <= 0 || !Number.isInteger(qty)) {
    throw new Error('Quantity must be a positive integer');
  }

  const holding = await Portfolio.findOne({ userId, stockId }).populate('stockId');
  if (!holding) {
    throw new Error('You do not own shares of this stock');
  }

  if (holding.quantity < qty) {
    throw new Error(`You only own ${holding.quantity} shares of this stock`);
  }

  const user = await User.findById(userId);
  const stock = holding.stockId || (await Stock.findById(stockId));

  const price = stock.currentPrice;
  const totalAmount = Number((price * qty).toFixed(2));

  // Add proceeds to user balance
  user.balance = Number((user.balance + totalAmount).toFixed(2));
  await user.save();

  // Update holding
  if (holding.quantity === qty) {
    await Portfolio.findByIdAndDelete(holding._id);
  } else {
    holding.quantity -= qty;
    holding.currentPrice = price;
    holding.profitLoss = Number(((price - holding.averagePrice) * holding.quantity).toFixed(2));
    await holding.save();
  }

  // Create ledger transaction
  const transaction = await Transaction.create({
    userId,
    stockId,
    transactionType: 'SELL',
    quantity: qty,
    price,
    totalAmount
  });

  return {
    transaction,
    newBalance: user.balance,
    remainingQuantity: holding.quantity - qty
  };
};
