import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface AxiosBaseQueryArgs {
  baseUrl?: string;
  prepareHeaders?: (
    api: Pick<
      BaseQueryApi,
      "getState" | "extra" | "endpoint" | "type" | "forced"
    >,
  ) => Record<string, any>;
}

export interface BaseQueryFnArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
}

const axiosBaseQuery =
  ({
    baseUrl,
    prepareHeaders = (x) => x,
  }: AxiosBaseQueryArgs): BaseQueryFn<
    BaseQueryFnArgs | string,
    unknown,
    unknown
  > =>
  async (args, api): Promise<any> => {
    const { url, method, data } =
      typeof args === "string"
        ? { url: args, method: "GET" as const, data: undefined }
        : args;
    const { getState, extra, endpoint, forced, type } = api;

    if (!baseUrl) return null;

    try {
      const headers: any = prepareHeaders({
        getState,
        extra,
        endpoint,
        forced,
        type,
      });

      const result = await axios(`${baseUrl}${url}`, { method, data, headers });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };

export default axiosBaseQuery;
