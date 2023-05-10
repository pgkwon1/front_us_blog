import Layout from "@/components/layout/Layout";
import type { AppProps } from "next/app";
import styled from "@/styles/Global.module.css";
import { Box } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Hydrate, QueryClientProvider } from "react-query";
import apiClient from "@/modules/reactQueryInstance";
import frontApi from "@/modules/apiInstance";
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

  let persistor = persistStore(store);
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={apiClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Layout>
                <Box className={styled.wrap}>
                  <Component {...pageProps} />
                </Box>
              </Layout>
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
