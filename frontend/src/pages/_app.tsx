import { CacheProvider } from "@emotion/react";
import { useAppDispatch } from "@hooks/reduxHooks";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useGetUserQuery } from "@redux/auth/authApi";
import { authActions } from "@redux/auth/authSlice";
import { reduxWrapper } from "@redux/reduxStore";
import { emotionLTRCache } from "@shared/emotionCache";
import theme from "@shared/theme";
import Head from "next/head";
import Router from "next/router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import React, { useEffect } from "react";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

// show progress bar on route change
Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());
nProgress.configure({ showSpinner: false });

const App = (props: any) => {
  const { Component, LTRCache = emotionLTRCache, pageProps } = props;
  const { data: user, isLoading } = useGetUserQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(authActions.setUserInfo(user));
    }
  }, [dispatch, isLoading, user]);

  return (
    <CacheProvider value={LTRCache}>
      <Head>
        <title>Calorie</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
        <NotificationContainer />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default reduxWrapper.withRedux(App);
