import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchStocks = createAsyncThunk('stocks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/stocks');
    return data.stocks;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stocks');
  }
});

export const fetchStockDetail = createAsyncThunk('stocks/fetchOne', async (symbol, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/stocks/${symbol}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stock');
  }
});

const stockSlice = createSlice({
  name: 'stocks',
  initialState: {
    list: [],
    currentStock: null,
    historical: [],
    loading: false,
    detailLoading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStockDetail.pending, (state) => { state.detailLoading = true; })
      .addCase(fetchStockDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentStock = action.payload.stock;
        state.historical = action.payload.historical;
      })
      .addCase(fetchStockDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery } = stockSlice.actions;
export default stockSlice.reducer;
