import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { updateBalance } from './authSlice';

export const buyStock = createAsyncThunk('trade/buy', async (tradeData, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post('/trade/buy', tradeData);
    dispatch(updateBalance(data.newBalance));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Buy failed');
  }
});

export const sellStock = createAsyncThunk('trade/sell', async (tradeData, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post('/trade/sell', tradeData);
    dispatch(updateBalance(data.newBalance));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Sell failed');
  }
});

export const fetchTradeHistory = createAsyncThunk('trade/history', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/trade/history');
    return data.transactions;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
  }
});

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    history: [],
    loading: false,
    historyLoading: false,
    error: null,
    lastTrade: null,
  },
  reducers: {
    clearTradeError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buyStock.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(buyStock.fulfilled, (state, action) => {
        state.loading = false;
        state.lastTrade = action.payload.transaction;
      })
      .addCase(buyStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sellStock.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sellStock.fulfilled, (state, action) => {
        state.loading = false;
        state.lastTrade = action.payload.transaction;
      })
      .addCase(sellStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTradeHistory.pending, (state) => { state.historyLoading = true; })
      .addCase(fetchTradeHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchTradeHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTradeError } = tradeSlice.actions;
export default tradeSlice.reducer;
