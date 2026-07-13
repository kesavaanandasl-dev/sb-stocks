/**
 * Generates 30 days of realistic daily OHLCV candlestick data ending at basePrice
 */
const generateChartHistory = (basePrice) => {
  const history = [];
  let price = basePrice * 0.92; // start ~8% below current price
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    const changePercent = (Math.random() - 0.48) * 0.04; // slight upward drift
    const open = Number(price.toFixed(2));
    price = Math.max(1, price * (1 + changePercent));
    const close = Number(price.toFixed(2));
    const high = Number((Math.max(open, close) * (1 + Math.random() * 0.015)).toFixed(2));
    const low = Number((Math.min(open, close) * (1 - Math.random() * 0.015)).toFixed(2));
    const volume = Math.floor(500000 + Math.random() * 8000000);

    history.push({
      date: d.toISOString().split('T')[0],
      price: close,
      open,
      high,
      low,
      volume
    });
  }
  return history;
};

export const sampleStocks = [
  // Technology
  { symbol: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', marketCap: 3400000000000, currentPrice: 228.50, exchange: 'NASDAQ' },
  { symbol: 'NVDA', companyName: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: 3150000000000, currentPrice: 128.40, exchange: 'NASDAQ' },
  { symbol: 'MSFT', companyName: 'Microsoft Corporation', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 3200000000000, currentPrice: 442.80, exchange: 'NASDAQ' },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Content & Information', marketCap: 2200000000000, currentPrice: 182.15, exchange: 'NASDAQ' },
  { symbol: 'META', companyName: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Internet Content & Information', marketCap: 1250000000000, currentPrice: 504.60, exchange: 'NASDAQ' },
  { symbol: 'AVGO', companyName: 'Broadcom Inc.', sector: 'Technology', industry: 'Semiconductors', marketCap: 780000000000, currentPrice: 168.90, exchange: 'NASDAQ' },
  { symbol: 'AMD', companyName: 'Advanced Micro Devices Inc.', sector: 'Technology', industry: 'Semiconductors', marketCap: 260000000000, currentPrice: 162.30, exchange: 'NASDAQ' },
  { symbol: 'ORCL', companyName: 'Oracle Corporation', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 390000000000, currentPrice: 142.10, exchange: 'NYSE' },
  { symbol: 'CRM', companyName: 'Salesforce Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 250000000000, currentPrice: 258.40, exchange: 'NYSE' },
  { symbol: 'ADBE', companyName: 'Adobe Inc.', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 240000000000, currentPrice: 545.20, exchange: 'NASDAQ' },
  { symbol: 'INTC', companyName: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors', marketCap: 135000000000, currentPrice: 31.80, exchange: 'NASDAQ' },
  { symbol: 'QCOM', companyName: 'Qualcomm Inc.', sector: 'Technology', industry: 'Semiconductors', marketCap: 225000000000, currentPrice: 202.40, exchange: 'NASDAQ' },
  { symbol: 'CSCO', companyName: 'Cisco Systems Inc.', sector: 'Technology', industry: 'Communication Equipment', marketCap: 190000000000, currentPrice: 47.90, exchange: 'NASDAQ' },
  { symbol: 'IBM', companyName: 'International Business Machines', sector: 'Technology', industry: 'Information Technology Services', marketCap: 165000000000, currentPrice: 178.60, exchange: 'NYSE' },
  { symbol: 'AMAT', companyName: 'Applied Materials Inc.', sector: 'Technology', industry: 'Semiconductor Equipment', marketCap: 195000000000, currentPrice: 235.10, exchange: 'NASDAQ' },

  // Communication Services
  { symbol: 'NFLX', companyName: 'Netflix Inc.', sector: 'Communication Services', industry: 'Entertainment', marketCap: 290000000000, currentPrice: 678.90, exchange: 'NASDAQ' },
  { symbol: 'DIS', companyName: 'The Walt Disney Company', sector: 'Communication Services', industry: 'Entertainment', marketCap: 180000000000, currentPrice: 98.40, exchange: 'NYSE' },
  { symbol: 'TMUS', companyName: 'T-Mobile US Inc.', sector: 'Communication Services', industry: 'Telecom Services', marketCap: 210000000000, currentPrice: 178.50, exchange: 'NASDAQ' },
  { symbol: 'VZ', companyName: 'Verizon Communications Inc.', sector: 'Communication Services', industry: 'Telecom Services', marketCap: 175000000000, currentPrice: 41.60, exchange: 'NYSE' },
  { symbol: 'T', companyName: 'AT&T Inc.', sector: 'Communication Services', industry: 'Telecom Services', marketCap: 135000000000, currentPrice: 18.90, exchange: 'NYSE' },
  { symbol: 'CMCSA', companyName: 'Comcast Corporation', sector: 'Communication Services', industry: 'Entertainment', marketCap: 155000000000, currentPrice: 39.20, exchange: 'NASDAQ' },
  { symbol: 'SPOT', companyName: 'Spotify Technology S.A.', sector: 'Communication Services', industry: 'Internet Content', marketCap: 62000000000, currentPrice: 318.40, exchange: 'NYSE' },

  // Consumer Cyclical
  { symbol: 'AMZN', companyName: 'Amazon.com Inc.', sector: 'Consumer Cyclical', industry: 'Internet Retail', marketCap: 2050000000000, currentPrice: 198.70, exchange: 'NASDAQ' },
  { symbol: 'TSLA', companyName: 'Tesla Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', marketCap: 780000000000, currentPrice: 248.50, exchange: 'NASDAQ' },
  { symbol: 'HD', companyName: 'The Home Depot Inc.', sector: 'Consumer Cyclical', industry: 'Home Improvement Retail', marketCap: 345000000000, currentPrice: 348.90, exchange: 'NYSE' },
  { symbol: 'MCD', companyName: 'McDonald\'s Corporation', sector: 'Consumer Cyclical', industry: 'Restaurants', marketCap: 185000000000, currentPrice: 258.10, exchange: 'NYSE' },
  { symbol: 'NKE', companyName: 'NIKE Inc.', sector: 'Consumer Cyclical', industry: 'Footwear & Accessories', marketCap: 110000000000, currentPrice: 74.30, exchange: 'NYSE' },
  { symbol: 'SBUX', companyName: 'Starbucks Corporation', sector: 'Consumer Cyclical', industry: 'Restaurants', marketCap: 88000000000, currentPrice: 78.90, exchange: 'NASDAQ' },
  { symbol: 'ABNB', companyName: 'Airbnb Inc.', sector: 'Consumer Cyclical', industry: 'Travel Services', marketCap: 95000000000, currentPrice: 151.20, exchange: 'NASDAQ' },
  { symbol: 'BKNG', companyName: 'Booking Holdings Inc.', sector: 'Consumer Cyclical', industry: 'Travel Services', marketCap: 138000000000, currentPrice: 4015.00, exchange: 'NASDAQ' },
  { symbol: 'LOW', companyName: 'Lowe\'s Companies Inc.', sector: 'Consumer Cyclical', industry: 'Home Improvement Retail', marketCap: 125000000000, currentPrice: 221.80, exchange: 'NYSE' },
  { symbol: 'LULU', companyName: 'Lululemon Athletica Inc.', sector: 'Consumer Cyclical', industry: 'Apparel Retail', marketCap: 38000000000, currentPrice: 304.50, exchange: 'NASDAQ' },

  // Financial Services
  { symbol: 'BRK.B', companyName: 'Berkshire Hathaway Inc.', sector: 'Financial Services', industry: 'Insurance - Diversified', marketCap: 890000000000, currentPrice: 412.30, exchange: 'NYSE' },
  { symbol: 'JPM', companyName: 'JPMorgan Chase & Co.', sector: 'Financial Services', industry: 'Banks - Diversified', marketCap: 585000000000, currentPrice: 206.80, exchange: 'NYSE' },
  { symbol: 'V', companyName: 'Visa Inc.', sector: 'Financial Services', industry: 'Credit Services', marketCap: 540000000000, currentPrice: 268.40, exchange: 'NYSE' },
  { symbol: 'MA', companyName: 'Mastercard Inc.', sector: 'Financial Services', industry: 'Credit Services', marketCap: 415000000000, currentPrice: 445.90, exchange: 'NYSE' },
  { symbol: 'BAC', companyName: 'Bank of America Corporation', sector: 'Financial Services', industry: 'Banks - Diversified', marketCap: 310000000000, currentPrice: 41.20, exchange: 'NYSE' },
  { symbol: 'WFC', companyName: 'Wells Fargo & Company', sector: 'Financial Services', industry: 'Banks - Diversified', marketCap: 205000000000, currentPrice: 58.60, exchange: 'NYSE' },
  { symbol: 'GS', companyName: 'The Goldman Sachs Group', sector: 'Financial Services', industry: 'Capital Markets', marketCap: 158000000000, currentPrice: 482.10, exchange: 'NYSE' },
  { symbol: 'MS', companyName: 'Morgan Stanley', sector: 'Financial Services', industry: 'Capital Markets', marketCap: 165000000000, currentPrice: 102.30, exchange: 'NYSE' },
  { symbol: 'AXP', companyName: 'American Express Company', sector: 'Financial Services', industry: 'Credit Services', marketCap: 168000000000, currentPrice: 236.80, exchange: 'NYSE' },
  { symbol: 'BLK', companyName: 'BlackRock Inc.', sector: 'Financial Services', industry: 'Asset Management', marketCap: 122000000000, currentPrice: 815.60, exchange: 'NYSE' },

  // Healthcare
  { symbol: 'LLY', companyName: 'Eli Lilly and Company', sector: 'Healthcare', industry: 'Drug Manufacturers', marketCap: 850000000000, currentPrice: 912.40, exchange: 'NYSE' },
  { symbol: 'UNH', companyName: 'UnitedHealth Group Inc.', sector: 'Healthcare', industry: 'Healthcare Plans', marketCap: 460000000000, currentPrice: 504.20, exchange: 'NYSE' },
  { symbol: 'JNJ', companyName: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Drug Manufacturers', marketCap: 355000000000, currentPrice: 148.60, exchange: 'NYSE' },
  { symbol: 'MRK', companyName: 'Merck & Co. Inc.', sector: 'Healthcare', industry: 'Drug Manufacturers', marketCap: 325000000000, currentPrice: 128.90, exchange: 'NYSE' },
  { symbol: 'ABBV', companyName: 'AbbVie Inc.', sector: 'Healthcare', industry: 'Drug Manufacturers', marketCap: 305000000000, currentPrice: 172.40, exchange: 'NYSE' },
  { symbol: 'TMO', companyName: 'Thermo Fisher Scientific', sector: 'Healthcare', industry: 'Diagnostics & Research', marketCap: 215000000000, currentPrice: 558.10, exchange: 'NYSE' },
  { symbol: 'ABT', companyName: 'Abbott Laboratories', sector: 'Healthcare', industry: 'Medical Devices', marketCap: 182000000000, currentPrice: 104.80, exchange: 'NYSE' },
  { symbol: 'PFE', companyName: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Drug Manufacturers', marketCap: 162000000000, currentPrice: 28.60, exchange: 'NYSE' },
  { symbol: 'AMGN', companyName: 'Amgen Inc.', sector: 'Healthcare', industry: 'Biotechnology', marketCap: 175000000000, currentPrice: 326.50, exchange: 'NASDAQ' },
  { symbol: 'ISRG', companyName: 'Intuitive Surgical Inc.', sector: 'Healthcare', industry: 'Medical Instruments', marketCap: 152000000000, currentPrice: 428.30, exchange: 'NASDAQ' },

  // Consumer Defensive
  { symbol: 'WMT', companyName: 'Walmart Inc.', sector: 'Consumer Defensive', industry: 'Discount Stores', marketCap: 560000000000, currentPrice: 69.80, exchange: 'NYSE' },
  { symbol: 'PG', companyName: 'Procter & Gamble Co.', sector: 'Consumer Defensive', industry: 'Household & Personal Products', marketCap: 395000000000, currentPrice: 167.40, exchange: 'NYSE' },
  { symbol: 'COST', companyName: 'Costco Wholesale Corporation', sector: 'Consumer Defensive', industry: 'Discount Stores', marketCap: 375000000000, currentPrice: 848.20, exchange: 'NASDAQ' },
  { symbol: 'KO', companyName: 'The Coca-Cola Company', sector: 'Consumer Defensive', industry: 'Beverages - Non-Alcoholic', marketCap: 278000000000, currentPrice: 64.20, exchange: 'NYSE' },
  { symbol: 'PEP', companyName: 'PepsiCo Inc.', sector: 'Consumer Defensive', industry: 'Beverages - Non-Alcoholic', marketCap: 232000000000, currentPrice: 168.90, exchange: 'NASDAQ' },
  { symbol: 'PM', companyName: 'Philip Morris International', sector: 'Consumer Defensive', industry: 'Tobacco', marketCap: 162000000000, currentPrice: 104.50, exchange: 'NYSE' },
  { symbol: 'TGT', companyName: 'Target Corporation', sector: 'Consumer Defensive', industry: 'Discount Stores', marketCap: 68000000000, currentPrice: 148.60, exchange: 'NYSE' },
  { symbol: 'CL', companyName: 'Colgate-Palmolive Company', sector: 'Consumer Defensive', industry: 'Household & Personal Products', marketCap: 81000000000, currentPrice: 98.40, exchange: 'NYSE' },

  // Industrials
  { symbol: 'GE', companyName: 'General Electric Company', sector: 'Industrials', industry: 'Specialty Industrial Machinery', marketCap: 185000000000, currentPrice: 168.40, exchange: 'NYSE' },
  { symbol: 'CAT', companyName: 'Caterpillar Inc.', sector: 'Industrials', industry: 'Farm & Heavy Construction Machinery', marketCap: 168000000000, currentPrice: 338.90, exchange: 'NYSE' },
  { symbol: 'UNP', companyName: 'Union Pacific Corporation', sector: 'Industrials', industry: 'Railroads', marketCap: 142000000000, currentPrice: 234.60, exchange: 'NYSE' },
  { symbol: 'UPS', companyName: 'United Parcel Service Inc.', sector: 'Industrials', industry: 'Integrated Freight & Logistics', marketCap: 118000000000, currentPrice: 138.20, exchange: 'NYSE' },
  { symbol: 'BA', companyName: 'The Boeing Company', sector: 'Industrials', industry: 'Aerospace & Defense', marketCap: 112000000000, currentPrice: 182.40, exchange: 'NYSE' },
  { symbol: 'DE', companyName: 'Deere & Company', sector: 'Industrials', industry: 'Farm & Heavy Construction Machinery', marketCap: 105000000000, currentPrice: 384.50, exchange: 'NYSE' },
  { symbol: 'LMT', companyName: 'Lockheed Martin Corporation', sector: 'Industrials', industry: 'Aerospace & Defense', marketCap: 112000000000, currentPrice: 468.20, exchange: 'NYSE' },

  // Energy
  { symbol: 'XOM', companyName: 'Exxon Mobil Corporation', sector: 'Energy', industry: 'Oil & Gas Integrated', marketCap: 458000000000, currentPrice: 114.80, exchange: 'NYSE' },
  { symbol: 'CVX', companyName: 'Chevron Corporation', sector: 'Energy', industry: 'Oil & Gas Integrated', marketCap: 288000000000, currentPrice: 156.40, exchange: 'NYSE' },
  { symbol: 'COP', companyName: 'ConocoPhillips', sector: 'Energy', industry: 'Oil & Gas E&P', marketCap: 132000000000, currentPrice: 112.50, exchange: 'NYSE' },
  { symbol: 'SLB', companyName: 'Schlumberger Limited', sector: 'Energy', industry: 'Oil & Gas Equipment & Services', marketCap: 68000000000, currentPrice: 48.60, exchange: 'NYSE' },
  { symbol: 'EOG', companyName: 'EOG Resources Inc.', sector: 'Energy', industry: 'Oil & Gas E&P', marketCap: 72000000000, currentPrice: 124.80, exchange: 'NYSE' },

  // Utilities & Real Estate
  { symbol: 'NEE', companyName: 'NextEra Energy Inc.', sector: 'Utilities', industry: 'Utilities - Regulated Electric', marketCap: 148000000000, currentPrice: 72.40, exchange: 'NYSE' },
  { symbol: 'SO', companyName: 'The Southern Company', sector: 'Utilities', industry: 'Utilities - Regulated Electric', marketCap: 86000000000, currentPrice: 78.90, exchange: 'NYSE' },
  { symbol: 'DUK', companyName: 'Duke Energy Corporation', sector: 'Utilities', industry: 'Utilities - Regulated Electric', marketCap: 78000000000, currentPrice: 101.40, exchange: 'NYSE' },
  { symbol: 'PLD', companyName: 'Prologis Inc.', sector: 'Real Estate', industry: 'REIT - Industrial', marketCap: 112000000000, currentPrice: 122.60, exchange: 'NYSE' },
  { symbol: 'AMT', companyName: 'American Tower Corporation', sector: 'Real Estate', industry: 'REIT - Specialty', marketCap: 98000000000, currentPrice: 210.40, exchange: 'NYSE' },
  { symbol: 'EQIX', companyName: 'Equinix Inc.', sector: 'Real Estate', industry: 'REIT - Specialty', marketCap: 76000000000, currentPrice: 804.20, exchange: 'NASDAQ' },

  // More High-Growth Tech / AI / Fintech / Biotech
  { symbol: 'PLTR', companyName: 'Palantir Technologies Inc.', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 65000000000, currentPrice: 28.90, exchange: 'NYSE' },
  { symbol: 'SNOW', companyName: 'Snowflake Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 45000000000, currentPrice: 134.50, exchange: 'NYSE' },
  { symbol: 'CRWD', companyName: 'CrowdStrike Holdings Inc.', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 94000000000, currentPrice: 384.20, exchange: 'NASDAQ' },
  { symbol: 'NET', companyName: 'Cloudflare Inc.', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 28000000000, currentPrice: 82.40, exchange: 'NYSE' },
  { symbol: 'DDOG', companyName: 'Datadog Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 42000000000, currentPrice: 126.80, exchange: 'NASDAQ' },
  { symbol: 'SQ', companyName: 'Block Inc.', sector: 'Financial Services', industry: 'Financial Data & Stock Exchanges', marketCap: 41000000000, currentPrice: 66.40, exchange: 'NYSE' },
  { symbol: 'PYPL', companyName: 'PayPal Holdings Inc.', sector: 'Financial Services', industry: 'Credit Services', marketCap: 64000000000, currentPrice: 61.20, exchange: 'NASDAQ' },
  { symbol: 'COIN', companyName: 'Coinbase Global Inc.', sector: 'Financial Services', industry: 'Financial Data & Stock Exchanges', marketCap: 58000000000, currentPrice: 232.50, exchange: 'NASDAQ' },
  { symbol: 'ROKU', companyName: 'Roku Inc.', sector: 'Communication Services', industry: 'Entertainment', marketCap: 9800000000, currentPrice: 68.40, exchange: 'NASDAQ' },
  { symbol: 'TTD', companyName: 'The Trade Desk Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 48000000000, currentPrice: 98.70, exchange: 'NASDAQ' },
  { symbol: 'ZS', companyName: 'Zscaler Inc.', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 29000000000, currentPrice: 194.20, exchange: 'NASDAQ' },
  { symbol: 'PANW', companyName: 'Palo Alto Networks Inc.', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 104000000000, currentPrice: 324.60, exchange: 'NASDAQ' },
  { symbol: 'NOW', companyName: 'ServiceNow Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 165000000000, currentPrice: 804.50, exchange: 'NYSE' },
  { symbol: 'WDAY', companyName: 'Workday Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 59000000000, currentPrice: 224.80, exchange: 'NASDAQ' },
  { symbol: 'MDB', companyName: 'MongoDB Inc.', sector: 'Technology', industry: 'Software - Infrastructure', marketCap: 18000000000, currentPrice: 246.30, exchange: 'NASDAQ' },
  { symbol: 'ARM', companyName: 'Arm Holdings plc', sector: 'Technology', industry: 'Semiconductors', marketCap: 172000000000, currentPrice: 166.40, exchange: 'NASDAQ' },
  { symbol: 'MU', companyName: 'Micron Technology Inc.', sector: 'Technology', industry: 'Semiconductors', marketCap: 145000000000, currentPrice: 131.20, exchange: 'NASDAQ' },
  { symbol: 'SMCI', companyName: 'Super Micro Computer Inc.', sector: 'Technology', industry: 'Computer Hardware', marketCap: 48000000000, currentPrice: 84.50, exchange: 'NASDAQ' },
  { symbol: 'DELL', companyName: 'Dell Technologies Inc.', sector: 'Technology', industry: 'Computer Hardware', marketCap: 95000000000, currentPrice: 136.80, exchange: 'NYSE' },
  { symbol: 'HPQ', companyName: 'HP Inc.', sector: 'Technology', industry: 'Computer Hardware', marketCap: 35000000000, currentPrice: 36.20, exchange: 'NYSE' },

  // Additional Blue Chips & Mid/Large Caps to hit 100 stocks
  { symbol: 'SPGI', companyName: 'S&P Global Inc.', sector: 'Financial Services', industry: 'Financial Data', marketCap: 138000000000, currentPrice: 442.10, exchange: 'NYSE' },
  { symbol: 'CME', companyName: 'CME Group Inc.', sector: 'Financial Services', industry: 'Financial Data', marketCap: 71000000000, currentPrice: 198.50, exchange: 'NASDAQ' },
  { symbol: 'MCO', companyName: 'Moody\'s Corporation', sector: 'Financial Services', industry: 'Financial Data', marketCap: 78000000000, currentPrice: 428.60, exchange: 'NYSE' },
  { symbol: 'ICE', companyName: 'Intercontinental Exchange', sector: 'Financial Services', industry: 'Financial Data', marketCap: 79000000000, currentPrice: 138.90, exchange: 'NYSE' },
  { symbol: 'C', companyName: 'Citigroup Inc.', sector: 'Financial Services', industry: 'Banks - Diversified', marketCap: 124000000000, currentPrice: 64.80, exchange: 'NYSE' },
  { symbol: 'SCHW', companyName: 'The Charles Schwab Corp.', sector: 'Financial Services', industry: 'Capital Markets', marketCap: 134000000000, currentPrice: 73.40, exchange: 'NYSE' },
  { symbol: 'PGR', companyName: 'The Progressive Corporation', sector: 'Financial Services', industry: 'Insurance', marketCap: 124000000000, currentPrice: 212.80, exchange: 'NYSE' },
  { symbol: 'CB', companyName: 'Chubb Limited', sector: 'Financial Services', industry: 'Insurance', marketCap: 104000000000, currentPrice: 256.40, exchange: 'NYSE' },

  { symbol: 'BSX', companyName: 'Boston Scientific Corp.', sector: 'Healthcare', industry: 'Medical Devices', marketCap: 112000000000, currentPrice: 76.90, exchange: 'NYSE' },
  { symbol: 'SYK', companyName: 'Stryker Corporation', sector: 'Healthcare', industry: 'Medical Devices', marketCap: 128000000000, currentPrice: 338.20, exchange: 'NYSE' },
  { symbol: 'GILD', companyName: 'Gilead Sciences Inc.', sector: 'Healthcare', industry: 'Drug Manufacturers', marketCap: 88000000000, currentPrice: 71.20, exchange: 'NASDAQ' },
  { symbol: 'REGN', companyName: 'Regeneron Pharmaceuticals', sector: 'Healthcare', industry: 'Biotechnology', marketCap: 114000000000, currentPrice: 1058.00, exchange: 'NASDAQ' },
  { symbol: 'VRTX', companyName: 'Vertex Pharmaceuticals', sector: 'Healthcare', industry: 'Biotechnology', marketCap: 122000000000, currentPrice: 472.50, exchange: 'NASDAQ' },

  { symbol: 'TJX', companyName: 'The TJX Companies Inc.', sector: 'Consumer Cyclical', industry: 'Apparel Retail', marketCap: 126000000000, currentPrice: 111.40, exchange: 'NYSE' },
  { symbol: 'F', companyName: 'Ford Motor Company', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', marketCap: 48000000000, currentPrice: 12.10, exchange: 'NYSE' },
  { symbol: 'GM', companyName: 'General Motors Company', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', marketCap: 54000000000, currentPrice: 47.30, exchange: 'NYSE' },
  { symbol: 'RCL', companyName: 'Royal Caribbean Group', sector: 'Consumer Cyclical', industry: 'Travel Services', marketCap: 41000000000, currentPrice: 158.40, exchange: 'NYSE' },
  { symbol: 'MAR', companyName: 'Marriott International', sector: 'Consumer Cyclical', industry: 'Travel Services', marketCap: 71000000000, currentPrice: 248.60, exchange: 'NASDAQ' },
  { symbol: 'HLT', companyName: 'Hilton Worldwide Holdings', sector: 'Consumer Cyclical', industry: 'Travel Services', marketCap: 54000000000, currentPrice: 216.40, exchange: 'NYSE' },
  { symbol: 'CMG', companyName: 'Chipotle Mexican Grill', sector: 'Consumer Cyclical', industry: 'Restaurants', marketCap: 88000000000, currentPrice: 62.80, exchange: 'NYSE' },

  // E-Commerce & Global Tech (13 stocks to make exactly 100)
  { symbol: 'UBER', companyName: 'Uber Technologies Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 154000000000, currentPrice: 72.40, exchange: 'NYSE' },
  { symbol: 'LYFT', companyName: 'Lyft Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 5800000000, currentPrice: 14.20, exchange: 'NASDAQ' },
  { symbol: 'DASH', companyName: 'DoorDash Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 48000000000, currentPrice: 118.50, exchange: 'NASDAQ' },
  { symbol: 'SHOP', companyName: 'Shopify Inc.', sector: 'Technology', industry: 'Software - Application', marketCap: 88000000000, currentPrice: 68.40, exchange: 'NYSE' },
  { symbol: 'PINS', companyName: 'Pinterest Inc.', sector: 'Communication Services', industry: 'Internet Content', marketCap: 28000000000, currentPrice: 42.10, exchange: 'NYSE' },
  { symbol: 'SNAP', companyName: 'Snap Inc.', sector: 'Communication Services', industry: 'Internet Content', marketCap: 24000000000, currentPrice: 14.80, exchange: 'NYSE' },
  { symbol: 'RIVN', companyName: 'Rivian Automotive Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', marketCap: 14000000000, currentPrice: 13.90, exchange: 'NASDAQ' },
  { symbol: 'LCID', companyName: 'Lucid Group Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', marketCap: 7500000000, currentPrice: 3.40, exchange: 'NASDAQ' },
  { symbol: 'NIO', companyName: 'NIO Inc.', sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', marketCap: 10500000000, currentPrice: 4.80, exchange: 'NYSE' },
  { symbol: 'SE', companyName: 'Sea Limited', sector: 'Consumer Cyclical', industry: 'Internet Retail', marketCap: 42000000000, currentPrice: 74.20, exchange: 'NYSE' },
  { symbol: 'MELI', companyName: 'MercadoLibre Inc.', sector: 'Consumer Cyclical', industry: 'Internet Retail', marketCap: 88000000000, currentPrice: 1740.00, exchange: 'NASDAQ' },
  { symbol: 'BABA', companyName: 'Alibaba Group Holding Ltd.', sector: 'Consumer Cyclical', industry: 'Internet Retail', marketCap: 195000000000, currentPrice: 78.40, exchange: 'NYSE' },
  { symbol: 'JD', companyName: 'JD.com Inc.', sector: 'Consumer Cyclical', industry: 'Internet Retail', marketCap: 42000000000, currentPrice: 28.50, exchange: 'NASDAQ' }
].map(s => {
  const chartHistory = generateChartHistory(s.currentPrice);
  const previousClose = Number((s.currentPrice * (1 + (Math.random() - 0.48) * 0.025)).toFixed(2));
  const openPrice = previousClose;
  const high = Number((Math.max(s.currentPrice, openPrice) * 1.014).toFixed(2));
  const low = Number((Math.min(s.currentPrice, openPrice) * 0.986).toFixed(2));
  const volume = Math.floor(1000000 + Math.random() * 15000000);

  return {
    ...s,
    previousClose,
    openPrice,
    high,
    low,
    volume,
    chartHistory,
    logo: `https://logo.clearbit.com/${s.companyName.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '')}.com`
  };
});
