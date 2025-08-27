import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const isAuthenticatedSlice = createSlice({
  name: "isAuthenticated",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthenticated, logout } = isAuthenticatedSlice.actions;
export default isAuthenticatedSlice.reducer;
