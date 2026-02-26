import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stockReducer from './slices/stockSlice';
import tradeReducer from './slices/tradeSlice';
import portfolioReducer from './slices/portfolioSlice';
import watchlistReducer from './slices/watchlistSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stockReducer,
    trade: tradeReducer,
    portfolio: portfolioReducer,
    watchlist: watchlistReducer,
    theme: themeReducer,
  },
});
