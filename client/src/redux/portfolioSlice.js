import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';
import { updateBalance } from './authSlice.js';

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/portfolio');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const buyStockOrder = createAsyncThunk(
  'portfolio/buyStockOrder',
  async ({ stockId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/portfolio/buy', { stockId, quantity });
      if (response.data?.newBalance !== undefined) {
        dispatch(updateBalance(response.data.newBalance));
      }
      dispatch(fetchPortfolio());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sellStockOrder = createAsyncThunk(
  'portfolio/sellStockOrder',
  async ({ stockId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/portfolio/sell', { stockId, quantity });
      if (response.data?.newBalance !== undefined) {
        dispatch(updateBalance(response.data.newBalance));
      }
      dispatch(fetchPortfolio());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    holdings: [],
    summary: {
      totalInvestment: 0,
      totalCurrentValue: 0,
      totalProfitLoss: 0,
      totalPercentageGain: 0
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.holdings = action.payload.holdings;
        state.summary = action.payload.summary;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default portfolioSlice.reducer;
