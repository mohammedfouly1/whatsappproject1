/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  themeDark: false,
};

const themeSlice = createSlice({
  name: 'themeSwitcher',
  initialState: INITIAL_STATE,
  reducers: {
    toggleTheme: (state) => {
      state.themeDark = !state.themeDark;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export const selectTheme = (state) => state.themeSwitcher.themeDark;
export default themeSlice.reducer;
