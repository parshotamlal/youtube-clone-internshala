import { configureStore } from '@reduxjs/toolkit';

import authSlice from './authSlice';
import videoSlice from './videoSlice';
import channelSlice from './channelSlice';
import isAuthenticatedReducer from "./isAuthenticated";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    videos: videoSlice,
    channels: channelSlice,
    isAuthenticated: isAuthenticatedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;