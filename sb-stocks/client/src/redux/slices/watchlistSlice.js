import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWatchlist = createAsyncThunk('watchlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/watchlist');
    return data.watchlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch watchlist');
  }
});

export const addToWatchlist = createAsyncThunk('watchlist/add', async (symbol, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/watchlist', { symbol });
    return data.watchlistItem;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to watchlist');
  }
});

export const removeFromWatchlist = createAsyncThunk('watchlist/remove', async (symbol, { rejectWithValue }) => {
  try {
    await api.delete(`/watchlist/${symbol}`);
    return symbol;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove from watchlist');
  }
});

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.symbol !== action.payload);
      });
  },
});

export default watchlistSlice.reducer;
