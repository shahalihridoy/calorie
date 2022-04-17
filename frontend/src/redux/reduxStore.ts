import { authApi } from "@redux/auth/authApi";
import authSlice from "@redux/auth/authSlice";
import { foodApi } from "@redux/food/foodApi";
import { mealApi } from "@redux/meal/mealApi";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { createWrapper } from "next-redux-wrapper";

const reduxStore = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [foodApi.reducerPath]: foodApi.reducer,
    [mealApi.reducerPath]: mealApi.reducer,
  },
  middleware: (gDM) =>
    gDM().concat(authApi.middleware, foodApi.middleware, mealApi.middleware),
  devTools: true,
});

setupListeners(reduxStore.dispatch);

const createStore = () => reduxStore;

// Create redux wrapper for next.js
export const reduxWrapper = createWrapper(createStore);

export type AppDispatch = typeof reduxStore.dispatch;
export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default reduxStore;
