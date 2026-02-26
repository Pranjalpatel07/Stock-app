import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('sbTheme') || 'dark';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: savedTheme },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('sbTheme', state.mode);
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
    initTheme: (state) => {
      document.documentElement.classList.toggle('dark', state.mode === 'dark');
    },
  },
});

export const { toggleTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
