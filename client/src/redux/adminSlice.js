import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchAdminAnalytics = createAsyncThunk(
  'admin/fetchAdminAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'admin/deleteUserAccount',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      dispatch(fetchAllUsers());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeUserRole = createAsyncThunk(
  'admin/changeUserRole',
  async ({ userId, role }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      dispatch(fetchAllUsers());
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    analytics: null,
    users: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default adminSlice.reducer;
