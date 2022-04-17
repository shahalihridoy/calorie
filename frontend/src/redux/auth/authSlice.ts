import { createSlice } from "@reduxjs/toolkit";
import { User } from "@shared/types";
import { HYDRATE } from "next-redux-wrapper";

export interface AuthState {
  user: User | null;
  loading: boolean;
}

const name = "auth";
const initialState: AuthState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name,
  initialState,

  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      state = action.payload[name] || state;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

export default authSlice;
