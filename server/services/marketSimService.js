import Stock from '../models/Stock.js';

const sseClients = new Set();
let isSimulating = false;

/**
 * Register SSE client for live simulated price ticks
 */
export const addSSEClient = (res) => {
  sseClients.add(res);
  res.on('close', () => {
    sseClients.delete(res);
  });
};

/**
 * Broadcast simulated price update to all active SSE clients
 */
const broadcastPriceTicks = (ticks) => {
  if (sseClients.size === 0) return;
  const payload = `data: ${JSON.stringify(ticks)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch (e) {
      sseClients.delete(client);
    }
  });
};

/**
 * Start simulated market fluctuations (every 5 seconds randomly updates 5-10 stocks slightly)
 */
export const startMarketSimulator = () => {
  if (isSimulating) return;
  isSimulating = true;
  console.log('📈 [LiveMarketSim] Stock price simulation engine activated.');

  setInterval(async () => {
    try {
      const allStocks = await Stock.find({}, 'symbol currentPrice previousClose openPrice high low volume');
      if (!allStocks || allStocks.length === 0) return;

      // Select 8 random stocks to tick
      const ticks = [];
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * allStocks.length);
        const stock = allStocks[randomIndex];

        // Small random change between -1.5% and +1.5%
        const deltaPercent = (Math.random() - 0.49) * 0.015;
        const oldPrice = stock.currentPrice;
        let newPrice = Number((oldPrice * (1 + deltaPercent)).toFixed(2));
        if (newPrice <= 0.5) newPrice = 0.5;

        const newHigh = Math.max(stock.high, newPrice);
        const newLow = Math.min(stock.low, newPrice);

        stock.currentPrice = newPrice;
        stock.high = newHigh;
        stock.low = newLow;
        stock.volume += Math.floor(100 + Math.random() * 5000);

        await stock.save();

        ticks.push({
          _id: stock._id,
          symbol: stock.symbol,
          oldPrice,
          currentPrice: newPrice,
          change: Number((newPrice - stock.previousClose).toFixed(2)),
          changePercent: Number((((newPrice - stock.previousClose) / stock.previousClose) * 100).toFixed(2)),
          high: newHigh,
          low: newLow,
          volume: stock.volume
        });
      }

      broadcastPriceTicks(ticks);
    } catch (error) {
      // Suppress error logs during high concurrency simulation ticks
    }
  }, 5000);
};
