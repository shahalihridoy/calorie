import axiosBaseQuery from "@redux/axiosBaseQuery";
import mealApiHelper, { IBuilder } from "@redux/meal/mealApiHelper";
import { createApi } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@shared/constants";
import { prepareHeaders } from "@utils/RTKUtils";
import { HYDRATE } from "next-redux-wrapper";

export const mealApi = createApi({
  reducerPath: "mealApi",
  tagTypes: ["Meal"],
  baseQuery: axiosBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders,
  }),
  endpoints: (builder: IBuilder) => ({
    getMeals: mealApiHelper.getMeals(builder),
    getMealsByUser: mealApiHelper.getMealsByUser(builder),
    addMeal: mealApiHelper.addMeal(builder),
    updateMeal: mealApiHelper.updateMeal(builder),
    deleteMeal: mealApiHelper.deleteMeal(builder),
  }),
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
});

export const {
  useGetMealsQuery,
  useAddMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} = mealApi;

export const { getMealsByUser } = mealApi.endpoints;
