import Layout from "@/components/layout/Layout";
import type { AppProps } from "next/app";
import styled from "@/styles/Global.module.css";
import { Box, Grid, Hidden, LinearProgress } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import frontApi from "@/modules/apiInstance";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Router } from "next/router";
import SideBar from "@/components/layout/SideBar";
import { HelmetProvider } from "react-helmet-async";
import { useState } from "react";
import { ReactQueryDevtools } from "react-query/devtools";

export default function App({ Component, pageProps }: AppProps) {
  if (
    typeof Cookies.get("X-CSRF-TOKEN") === "undefined" ||
    !sessionStorage.getItem("visited")
  ) {
    frontApi.get("/getCsrf").then((result) => {
      if (result.status === 200) {
        Cookies.set("X-CSRF-TOKEN", result.data.CSRF_TOKEN);
        typeof window !== "undefined"
          ? sessionStorage.setItem("visited", "1")
          : null;
      }
    });
  }
  const [client] = useState(() => new QueryClient());

  let persistor = persistStore(store);
  NProgress.configure({
    showSpinner: false,
  });
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={client}>
            <Hydrate state={pageProps.dehydratedState}>
              <HelmetProvider>
                <Layout>
                  <Grid container sx={{ flexGrow: 1 }} className={styled.wrap}>
                    {pageProps && pageProps.isSideBarRender === false ? (
                      ""
                    ) : (
                      <Hidden mdDown>
                        <Grid item md={3}>
                          <SideBar />
                        </Grid>
                      </Hidden>
                    )}

                    <Grid
                      item
                      xs={12}
                      md={
                        pageProps && pageProps.isSideBarRender === false
                          ? 12
                          : 8
                      }
                      gridAutoColumns={"auto"}
                    >
                      <Component {...pageProps} />
                    </Grid>
                  </Grid>
                </Layout>
              </HelmetProvider>
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
              />
            </Hydrate>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
      <style jsx global>{`
        html,
        body {
          font-family: "S-CoreDream", "sans-serif" !important;
          margin: 0;
          padding: 0;
          background: white;
        }
        p {
          font-family: "S-CoreDream", "sans-serif" !important;
        }
        a {
          color: #000;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
