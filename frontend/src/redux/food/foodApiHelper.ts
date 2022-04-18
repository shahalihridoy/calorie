import { BaseQueryFnArgs } from "@redux/axiosBaseQuery";
import { foodApi } from "@redux/food/foodApi";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { thresholdCalorie } from "@shared/constants";
import { FoodEntry, Meal } from "@shared/types";
import { transformRTKResponse } from "@utils/RTKUtils";

export type IBuilder = EndpointBuilder<
  BaseQueryFn<
    string | BaseQueryFnArgs,
    unknown,
    unknown,
    Record<string, unknown>,
    Record<string, unknown>
  >,
  "Food-Entries" | "Food-Entries-Threshold" | "Food-Entries-Analytics",
  "foodApi"
>;

class FoodApiHelper {
  static getFoodEntries = (builder: IBuilder) =>
    builder.query<any, void>({
      query: () => "/food-entries",
      providesTags: [{ type: "Food-Entries" }],
      transformResponse: transformRTKResponse,
    });

  static getFoodEntriesThreshold = (builder: IBuilder) =>
    builder.query<any, void>({
      query: () => `/food-entries/threshold?limit=${thresholdCalorie}`,
      providesTags: [{ type: "Food-Entries-Threshold" }],
      transformResponse: transformRTKResponse,
    });

  static getFoodEntriesAnalytics = (builder: IBuilder) =>
    builder.query<any, void>({
      query: () => "/food-entries/analytics",
      providesTags: [{ type: "Food-Entries-Analytics" }],
      transformResponse: transformRTKResponse,
    });

  static addFoodEntry = (builder: IBuilder) =>
    builder.mutation<any, { entry: FoodEntry; meal: Meal }>({
      query: ({ entry }) => ({
        url: "/food-entries",
        method: "POST",
        data: entry,
      }),
      transformResponse: transformRTKResponse,
      invalidatesTags: ["Food-Entries-Threshold"],
      onQueryStarted: async ({ meal }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            foodApi.util.updateQueryData(
              "getFoodEntries",
              undefined,
              (list: FoodEntry[]) => {
                list.push({ ...data, meal });
                return list;
              },
            ),
          );
        } catch (error) {
          console.log(error);
        }
      },
    });

  static updateFoodEntry = (builder: IBuilder) =>
    builder.mutation<any, { entry: FoodEntry; meal: Meal }>({
      query: ({ entry }) => ({
        url: "/food-entries",
        method: "PUT",
        data: entry,
      }),
      transformResponse: transformRTKResponse,
      invalidatesTags: ["Food-Entries-Threshold"],
      onQueryStarted: async ({ meal }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            foodApi.util.updateQueryData(
              "getFoodEntries",
              undefined,
              (list: FoodEntry[]) => {
                return list.map((item) => {
                  if (item._id === data._id) return { ...data, meal };
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

  static deleteFoodEntry = (builder: IBuilder) =>
    builder.mutation<any, string[]>({
      query: (isList) => ({
        url: "/food-entries",
        method: "DELETE",
        data: isList,
      }),
      transformResponse: transformRTKResponse,
      onQueryStarted: async (idList, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          const idSet = new Set(idList);

          dispatch(
            foodApi.util.updateQueryData(
              "getFoodEntries",
              undefined,
              (list: FoodEntry[]) => {
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
