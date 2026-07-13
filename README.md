# 📈 SB Stocks — Production Full-Stack MERN Paper Trading Platform

**SB Stocks** is a state-of-the-art, responsive, full-stack Stock Trading Simulation Platform built with the **MERN Stack** (MongoDB, Express.js, React 19, Node.js) and Redux Toolkit. It allows aspiring traders and investors to practice buying and selling 100 US stocks using **$100,000 in virtual cash** with real-time simulated market price ticks, interactive candlestick & area charts, and comprehensive portfolio analytics.

---

## ✨ Features Overview

### 🏛 Core Trading & Market Simulation
- **100 Realistic US Stocks**: Seeded with authentic tickers across 10 sectors (Tech, Healthcare, Financials, Consumer, Energy, etc.).
- **Live Simulated Market Ticker (SSE)**: Server-Sent Events stream real-time price ticks (`/api/stocks/live-ticker`) that dynamically update candlestick charts, watchlist prices, and portfolio valuations every 5 seconds.
- **Interactive Trading Terminal**: Instant order execution (BUY / SELL) with real-time buying power validation, share calculation, and instant Toast alerts.
- **Portfolio Management & Allocation Charts**: Real-time tracking of Invested Principal, Current Market Worth, Unrealized P&L ($ and %), and Recharts Donut Allocation breakdown.
- **Export Reports**: 1-click **PDF Report Export** (`jsPDF`) and **CSV Export** (`PapaParse`) for holdings and transaction history.

### 🔐 Authentication & Security
- **JWT-Based Authentication**: HTTP-only cookies + Bearer token support.
- **Role-Based Access Control**: `USER` and `ADMIN` roles with protected frontend routes and backend middleware.
- **Security Middleware**: `Helmet` HTTP headers, `CORS` configuration, API `Rate Limiting` (up to 300 requests/minute per IP), and input validation via `Joi` / `express-validator`.
- **Zero-Setup In-Memory MongoDB Option**: Automatically falls back to `mongodb-memory-server` if local MongoDB is unavailable, seeding 100 stocks and test users instantly.

### 🛠 Admin Console
- **Platform Analytics**: Live count of total users, listed stocks, total trades, and cumulative trading volume ($).
- **User Administration**: Promote/demote users between `USER` and `ADMIN` roles or remove user accounts.

---

## 📂 Project Architecture & Directory Structure

```
sb-stocks/
├── client/                     # Frontend React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/         # Layouts (Navbar, Sidebar, LiveTickerBar, Footer)
│   │   ├── pages/              # Home, Login, Register, Dashboard, Stocks, StockDetails,
│   │   │                       # Portfolio, Transactions, Watchlist, Profile, AdminDashboard
│   │   ├── redux/              # Redux Toolkit Store & Slices (auth, stocks, portfolio, watchlist, admin)
│   │   └── services/           # Axios API wrapper with auth interceptors
│   └── package.json
├── server/                     # Backend Node.js + Express + MongoDB API Server
│   ├── config/                 # Database connection (with fallback) & Logger
│   ├── controllers/            # Request handlers (auth, stocks, portfolio, transaction, watchlist, admin)
│   ├── middleware/             # JWT Auth, Role check, Error Handler, Rate Limiter, Validator
│   ├── models/                 # Mongoose Schemas (User, Stock, Portfolio, Transaction, Watchlist, Analytics)
│   ├── routes/                 # Express API Router endpoints
│   ├── seed/                   # 100 US Stocks Seeder script & Data
│   ├── services/               # Business logic & Live Market SSE Ticker engine
│   ├── verify_platform.js      # Automated E2E verification suite
│   └── server.js               # Application Entry Point
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Backend Setup & Run
```bash
cd server
npm install
npm run dev
```
- By default, the server runs on **port 5000**.
- If no local MongoDB is running, it automatically launches an **In-Memory MongoDB Server** and seeds 100 US stocks, an Admin account, and a Demo Trader account.

### 2. Frontend Setup & Run
```bash
cd client
npm install
npm run dev
```
- The frontend dev server runs on **http://localhost:5173** and proxies `/api` calls to `http://localhost:5000`.

---

## 🔑 Default Test Accounts (1-Click Demo Login Available)

| Role | Email | Password | Starting Balance |
| :--- | :--- | :--- | :--- |
| **Demo Trader** | `trader@sbstocks.com` | `Trader@12345` | `$100,000.00` |
| **Platform Admin** | `admin@sbstocks.com` | `Admin@12345` | `$100,000.00` |

---

## 🧪 Automated Verification Suite

To verify all full-stack API workflows end-to-end (Registration, Authentication, Stock exploration, Order execution BUY/SELL, Portfolio holdings, Ledger audit trail, Watchlist, and Admin analytics):

```bash
cd server
node verify_platform.js
```
Expected output:
```
🎉 ALL API ENDPOINTS & WORKFLOWS PASSED 100%!
```

---

## 📜 API Reference Summary

- `POST /api/auth/register` — Register new user ($100k balance credited)
- `POST /api/auth/login` — Authenticate & receive JWT
- `GET /api/stocks` — List paginated stocks with search & sector filters
- `GET /api/stocks/live-ticker` — SSE real-time simulated price stream
- `POST /api/portfolio/buy` — Execute BUY order at live market price
- `POST /api/portfolio/sell` — Execute SELL order
- `GET /api/portfolio` — Get holdings, valuation summary & allocation breakdown
- `GET /api/transactions` — Get complete trade audit ledger
- `GET /api/watchlist` — Get user saved watchlist
- `GET /api/admin/dashboard` — Platform analytics (Admin only)
