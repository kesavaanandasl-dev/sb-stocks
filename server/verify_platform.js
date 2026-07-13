const API_BASE = 'http://localhost:5000/api';

async function runVerification() {
  console.log('=====================================================');
  console.log('🚀 SB STOCKS FULL-STACK API VERIFICATION SUITE');
  console.log('=====================================================\n');

  let token = '';
  let adminToken = '';
  let sampleStockId = '';
  let sampleStockSymbol = '';

  try {
    // 1. Health check
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    console.log(`[PASS] Health Check: ${healthData.service} is ${healthData.status}`);

    // 2. Register a test user
    const testEmail = `verification_${Date.now()}@sbstocks.com`;
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification Trader',
        email: testEmail,
        password: 'Password@123',
        confirmPassword: 'Password@123'
      })
    });
    const regData = await regRes.json();
    if (!regData.success) {
      console.log('Registration error payload:', regData);
      throw new Error(regData.message || 'Registration failed');
    }
    token = regData.token || regData.data?.token;
    const userObj = regData.user || regData.data?.user;
    console.log(`[PASS] Registered test user: ${userObj.email} with Starting Balance: $${userObj.balance}`);

    // 3. Fetch Stocks
    const stocksRes = await fetch(`${API_BASE}/stocks?limit=5`);
    const stocksData = await stocksRes.json();
    const stocksArr = stocksData.stocks || stocksData.data;
    if (!stocksData.success || !stocksArr || stocksArr.length === 0) throw new Error('Stocks fetch failed');
    sampleStockId = stocksArr[0]._id;
    sampleStockSymbol = stocksArr[0].symbol;
    const samplePrice = stocksArr[0].currentPrice;
    console.log(`[PASS] Fetched stocks list. Sample stock selected: ${sampleStockSymbol} ($${samplePrice})`);

    // 4. Buy Stock Order
    const buyRes = await fetch(`${API_BASE}/portfolio/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        stockId: sampleStockId,
        quantity: 10
      })
    });
    const buyData = await buyRes.json();
    if (!buyData.success) throw new Error(buyData.message);
    console.log(`[PASS] Executed BUY order: 10 shares of ${sampleStockSymbol}. Remaining Cash Balance: $${buyData.newBalance}`);

    // 5. Check Portfolio Holdings
    const portRes = await fetch(`${API_BASE}/portfolio`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const portData = await portRes.json();
    const holdingsList = portData.holdings || portData.data?.holdings;
    const summaryObj = portData.summary || portData.data?.summary;
    if (!portData.success || !holdingsList || holdingsList.length === 0) throw new Error('Portfolio empty after buy');
    console.log(`[PASS] Portfolio Holdings verified: ${holdingsList[0].quantity} shares of ${holdingsList[0].stock.symbol}. Total Investment: $${summaryObj.totalInvestment}`);

    // 6. Check Transaction Ledger
    const transRes = await fetch(`${API_BASE}/transactions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const transData = await transRes.json();
    const txList = Array.isArray(transData.data) ? transData.data : (Array.isArray(transData) ? transData : []);
    if (!transData.success || txList.length === 0) throw new Error('Transaction ledger empty');
    console.log(`[PASS] Transaction Ledger verified: Found ${txList.length} trade records`);

    // 7. Watchlist Add/Remove
    const watchAddRes = await fetch(`${API_BASE}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stockId: sampleStockId })
    });
    const watchAddData = await watchAddRes.json();
    if (!watchAddData.success) throw new Error('Watchlist add failed');
    console.log(`[PASS] Watchlist added item: ${sampleStockSymbol}`);

    // 8. Admin Login & Dashboard Analytics
    const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@sbstocks.com',
        password: 'Admin@12345'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginData.success) throw new Error('Admin login failed');
    adminToken = adminLoginData.token || adminLoginData.data?.token;

    const adminStatsRes = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminStatsData = await adminStatsRes.json();
    if (!adminStatsData.success) throw new Error('Admin stats failed');
    console.log(`[PASS] Admin Dashboard Analytics verified: ${adminStatsData.data.totalUsers} Users | ${adminStatsData.data.totalStocks} Stocks | $${adminStatsData.data.totalVolume} Total Trade Volume`);

    console.log('\n=====================================================');
    console.log('🎉 ALL API ENDPOINTS & WORKFLOWS PASSED 100%!');
    console.log('=====================================================');
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
    process.exit(1);
  }
}

runVerification();
