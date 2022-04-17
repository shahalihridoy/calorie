import axiosBaseQuery from "@redux/axiosBaseQuery";
import FoodApiHelper, { IBuilder } from "@redux/food/foodApiHelper";
import { createApi } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@shared/constants";
import { prepareHeaders } from "@utils/RTKUtils";
import { HYDRATE } from "next-redux-wrapper";

export const foodApi = createApi({
  reducerPath: "foodApi",
  tagTypes: ["Food-Entries", "Food-Entries-Threshold"],
  baseQuery: axiosBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders,
  }),
  endpoints: (builder: IBuilder) => ({
    getFoodEntries: FoodApiHelper.getFoodEntries(builder),
    getFoodEntriesThreshold: FoodApiHelper.getFoodEntriesThreshold(builder),
    getFoodEntriesAnalytics: FoodApiHelper.getFoodEntriesAnalytics(builder),
    addFoodEntry: FoodApiHelper.addFoodEntry(builder),
    updateFoodEntry: FoodApiHelper.updateFoodEntry(builder),
    deleteFoodEntry: FoodApiHelper.deleteFoodEntry(builder),
  }),
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
});

export const {
  useGetFoodEntriesQuery,
  useGetFoodEntriesThresholdQuery,
  useGetFoodEntriesAnalyticsQuery,
  useAddFoodEntryMutation,
  useUpdateFoodEntryMutation,
  useDeleteFoodEntryMutation,
} = foodApi;
