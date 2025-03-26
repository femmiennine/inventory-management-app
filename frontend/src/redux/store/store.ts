import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
