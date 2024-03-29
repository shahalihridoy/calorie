import { foodApi } from "@redux/food/foodApi";
import { mealApi } from "@redux/meal/mealApi";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseQueryFunction, Meal } from "@shared/types";
import { transformRTKResponse } from "@utils/RTKUtils";

export type IBuilder = EndpointBuilder<BaseQueryFunction, "Meal", "mealApi">;

class FoodApiHelper {
  static getMeals = (builder: IBuilder) =>
    builder.query<any, void>({
      query: () => "/meals",
      providesTags: [{ type: "Meal" }],
      transformResponse: transformRTKResponse,
    });

  static getMealsByUser = (builder: IBuilder) =>
    builder.query<any, string>({
      query: (userId) => `/meals/user/${userId}`,
      providesTags: [{ type: "Meal", id: "userId" }],
      transformResponse: transformRTKResponse,
    });

  static addMeal = (builder: IBuilder) =>
    builder.mutation<any, Meal>({
      query: (meal) => ({
        url: "/meals",
        method: "POST",
        data: meal,
      }),
      transformResponse: transformRTKResponse,
      invalidatesTags: [{ type: "Meal", id: "userId" }],
      onQueryStarted: async (meal, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            mealApi.util.updateQueryData(
              "getMeals",
              undefined,
              (list: Meal[]) => {
                list.push(data);
                return list;
              },
            ),
          );
        } catch (error) {
          console.log(error);
        }
      },
    });

  static updateMeal = (builder: IBuilder) =>
    builder.mutation<any, Meal>({
      query: (Meal) => ({
        url: "/meals",
        method: "PUT",
        data: Meal,
      }),
      transformResponse: transformRTKResponse,
      invalidatesTags: [{ type: "Meal", id: "userId" }],
      onQueryStarted: async (Meal, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          // invalidate the entries for the meal
          dispatch(foodApi.util.invalidateTags(["Food-Entries"]));

          // update meal list
          dispatch(
            mealApi.util.updateQueryData(
              "getMeals",
              undefined,
              (list: Meal[]) => {
                return list.map((item) => {
                  if (item._id === data._id) return data;
                  return item;
                });
              },
            ),
          );
        } catch (error) {
          console.log(error);
        }
      },
    });

  static deleteMeal = (builder: IBuilder) =>
    builder.mutation<any, string[]>({
      query: (isList) => ({
        url: "/meals",
        method: "DELETE",
        data: isList,
      }),
      transformResponse: transformRTKResponse,
      onQueryStarted: async (idList, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          const idSet = new Set(idList);

          // invalidate the entries for the meal
          dispatch(foodApi.util.invalidateTags(["Food-Entries"]));

          dispatch(
            mealApi.util.updateQueryData(
              "getMeals",
              undefined,
              (list: Meal[]) => {
                return list.filter((item) => !idSet.has(item._id));
              },
            ),
          );
        } catch (error) {
          console.log(error);
        }
      },
    });
}

export default FoodApiHelper;
