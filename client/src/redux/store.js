import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import stocksReducer from './stocksSlice.js';
import portfolioReducer from './portfolioSlice.js';
import watchlistReducer from './watchlistSlice.js';
import adminReducer from './adminSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stocksReducer,
    portfolio: portfolioReducer,
    watchlist: watchlistReducer,
    admin: adminReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;
