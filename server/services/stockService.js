import Stock from '../models/Stock.js';

export const getStocks = async ({ page = 1, limit = 20, search = '', sector = '', sort = 'marketCap_desc' }) => {
  const query = {};

  if (search && search.trim() !== '') {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [{ symbol: regex }, { companyName: regex }];
  }

  if (sector && sector !== 'All' && sector !== '') {
    query.sector = sector;
  }

  let sortOptions = { marketCap: -1 };
  if (sort === 'price_asc') sortOptions = { currentPrice: 1 };
  else if (sort === 'price_desc') sortOptions = { currentPrice: -1 };
  else if (sort === 'symbol_asc') sortOptions = { symbol: 1 };
  else if (sort === 'volume_desc') sortOptions = { volume: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [stocks, total] = await Promise.all([
    Stock.find(query).sort(sortOptions).skip(skip).limit(Number(limit)),
    Stock.countDocuments(query)
  ]);

  return {
    stocks,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit))
    }
  };
};

export const getStockByIdOrSymbol = async (identifier) => {
  let stock;
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    stock = await Stock.findById(identifier);
  }
  if (!stock) {
    stock = await Stock.findOne({ symbol: identifier.toUpperCase() });
  }
  if (!stock) {
    throw new Error('Stock not found');
  }
  return stock;
};

export const getTopMovers = async () => {
  const allStocks = await Stock.find({}, 'symbol companyName sector currentPrice previousClose volume logo');
  
  const stocksWithChange = allStocks.map(s => {
    const change = Number((s.currentPrice - s.previousClose).toFixed(2));
    const changePercent = Number((((s.currentPrice - s.previousClose) / s.previousClose) * 100).toFixed(2));
    return {
      _id: s._id,
      symbol: s.symbol,
      companyName: s.companyName,
      sector: s.sector,
      currentPrice: s.currentPrice,
      previousClose: s.previousClose,
      change,
      changePercent,
      volume: s.volume,
      logo: s.logo
    };
  });

  const sortedByGain = [...stocksWithChange].sort((a, b) => b.changePercent - a.changePercent);
  const sortedByLoss = [...stocksWithChange].sort((a, b) => a.changePercent - b.changePercent);
  const sortedByVolume = [...stocksWithChange].sort((a, b) => b.volume - a.volume);

  return {
    topGainers: sortedByGain.slice(0, 5),
    topLosers: sortedByLoss.slice(0, 5),
    mostActive: sortedByVolume.slice(0, 5)
  };
};

export const createStock = async (data) => {
  const existing = await Stock.findOne({ symbol: data.symbol.toUpperCase() });
  if (existing) {
    throw new Error('Stock with this symbol already exists');
  }
  return await Stock.create({
    ...data,
    symbol: data.symbol.toUpperCase(),
    previousClose: data.currentPrice,
    openPrice: data.currentPrice,
    high: data.currentPrice,
    low: data.currentPrice
  });
};

export const updateStock = async (id, data) => {
  const stock = await Stock.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!stock) {
    throw new Error('Stock not found');
  }
  return stock;
};

export const deleteStock = async (id) => {
  const stock = await Stock.findByIdAndDelete(id);
  if (!stock) {
    throw new Error('Stock not found');
  }
  return true;
};
