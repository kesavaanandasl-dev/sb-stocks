import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/watchlist');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'watchlist/addToWatchlist',
  async (stockId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/watchlist', { stockId });
      dispatch(fetchWatchlist());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'watchlist/removeFromWatchlist',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/watchlist/${id}`);
      dispatch(fetchWatchlist());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default watchlistSlice.reducer;
