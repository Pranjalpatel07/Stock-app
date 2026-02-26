import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPortfolio = createAsyncThunk('portfolio/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/portfolio');
    return data.portfolio;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch portfolio');
  }
});

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    holdings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.holdings = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default portfolioSlice.reducer;
