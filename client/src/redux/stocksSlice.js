import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchStocks = createAsyncThunk(
  'stocks/fetchStocks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/stocks', { params });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTopMovers = createAsyncThunk(
  'stocks/fetchTopMovers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/stocks/movers');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStockDetails = createAsyncThunk(
  'stocks/fetchStockDetails',
  async (idOrSymbol, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stocks/${idOrSymbol}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: {
    list: [],
    pagination: { total: 0, page: 1, limit: 20, pages: 0 },
    topMovers: { topGainers: [], topLosers: [], mostActive: [] },
    selectedStock: null,
    loading: false,
    error: null
  },
  reducers: {
    applyLiveTicks: (state, action) => {
      const ticks = action.payload; // Array of tick objects
      ticks.forEach((tick) => {
        // Update in list if present
        const index = state.list.findIndex(s => s.symbol === tick.symbol || s._id === tick._id);
        if (index !== -1) {
          state.list[index].currentPrice = tick.currentPrice;
          state.list[index].high = tick.high;
          state.list[index].low = tick.low;
        }
        // Update selectedStock if currently viewing it
        if (state.selectedStock && state.selectedStock.symbol === tick.symbol) {
          state.selectedStock.currentPrice = tick.currentPrice;
          state.selectedStock.high = tick.high;
          state.selectedStock.low = tick.low;
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.stocks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTopMovers.fulfilled, (state, action) => {
        state.topMovers = action.payload;
      })
      .addCase(fetchStockDetails.pending, (state) => {
        state.loading = true;
        state.selectedStock = null;
      })
      .addCase(fetchStockDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload;
      })
      .addCase(fetchStockDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { applyLiveTicks } = stocksSlice.actions;
export default stocksSlice.reducer;
