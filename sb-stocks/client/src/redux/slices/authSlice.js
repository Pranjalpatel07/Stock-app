import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const userFromStorage = localStorage.getItem('sbUser')
  ? JSON.parse(localStorage.getItem('sbUser'))
  : null;
const tokenFromStorage = localStorage.getItem('sbToken') || null;

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('sbToken', data.token);
    localStorage.setItem('sbUser', JSON.stringify(data.user));
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Registration failed'); }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('sbToken', data.token);
    localStorage.setItem('sbUser', JSON.stringify(data.user));
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Login failed'); }
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/profile');
    localStorage.setItem('sbUser', JSON.stringify(data.user));
    return data.user;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: userFromStorage, token: tokenFromStorage, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null; state.token = null; state.error = null;
      localStorage.removeItem('sbToken'); localStorage.removeItem('sbUser');
    },
    updateBalance: (state, action) => {
      if (state.user) {
        state.user.balance = action.payload;
        localStorage.setItem('sbUser', JSON.stringify(state.user));
      }
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.user = a.payload; });
  },
});

export const { logout, updateBalance, clearError } = authSlice.actions;
export default authSlice.reducer;
