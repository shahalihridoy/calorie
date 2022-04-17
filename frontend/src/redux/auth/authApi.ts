import axiosBaseQuery from "@redux/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@shared/constants";
import { prepareHeaders, transformRTKResponse } from "@utils/RTKUtils";
import { HYDRATE } from "next-redux-wrapper";

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["User"],
  baseQuery: axiosBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    inviteUser: builder.mutation<any, { email: string; name: string }>({
      query: (credentials) => ({
        url: "/auth/invite",
        method: "POST",
        data: credentials,
      }),
      transformResponse: transformRTKResponse,
    }),
    getUser: builder.query<any, void>({
      query: () => "/auth/verify-token",
      providesTags: [{ type: "User" }],
      transformResponse: transformRTKResponse,
    }),
  }),
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
});

// Export hooks for usage in functional components
export const { useInviteUserMutation, useGetUserQuery } = authApi;
