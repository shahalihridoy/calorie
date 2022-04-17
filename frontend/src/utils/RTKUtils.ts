import { currentUserToken } from "@shared/constants";

export const prepareHeaders = () => {
  return {
    Authorization: `Bearer ${currentUserToken}`,
  };
};

export const transformRTKResponse = <T>(response: Record<string, any>): T =>
  response.data;
