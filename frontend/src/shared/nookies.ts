import { GetServerSidePropsContext, NextPageContext } from "next";
import _nookies from "nookies";

export const getCookies = (
  field: string,
  context?: GetServerSidePropsContext,
) => {
  return _nookies.get(context, field);
};

export const setCookies = (
  context: NextPageContext | null,
  field: string,
  value: any,
  maxAge?: number,
) => {
  _nookies.set(context, field, value, {
    path: "/",
    maxAge: maxAge || 30 * 24 * 60 * 60,
    sameSite: true,
  });
};

export const destroyCookies = (field: string) => {
  _nookies.destroy(null, field);
};

export default _nookies;
