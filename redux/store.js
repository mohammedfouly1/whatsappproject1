import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/themeSlice';
// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
  reducer: {
    themeSwitcher: themeReducer,
  },
});
