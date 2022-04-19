import { BaseQueryFnArgs } from "@redux/axiosBaseQuery";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { AuthRoles } from "@shared/enums";

export type AnyRecord<T = any> = Record<string, T>;

export interface Error {
  data: {
    message: string;
    status: number;
  };
}
export interface User {
  _id: string;
  role: AuthRoles;
  email: string;
  name: string;
}
export interface Meal {
  _id: string;
  name: string;
  user: string;
  maxFoodItemCount: number;
}
export interface FoodEntry {
  _id: string;
  name: string;
  calorie: number;
  date: string;
  user: string;
  meal: Pick<Meal, "_id" | "name"> | string;
}

export type BaseQueryFunction = BaseQueryFn<
  string | BaseQueryFnArgs,
  unknown,
  unknown,
  Record<string, unknown>,
  Record<string, unknown>
>;

export type RTKBuilder<T extends string, S extends string> = EndpointBuilder<
  BaseQueryFunction,
  T,
  S
>;
