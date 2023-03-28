import Layout from "@/components/layout/Layout";
import type { AppProps } from "next/app";
import styled from "@/styles/Global.module.css";
import { Box } from "@mui/material";
import axios from "axios";
import { apiContext } from "@/context/ApiContext";
import Cookies from "js-cookie";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
export default function App({ Component, pageProps }: AppProps) {
  if (typeof Cookies.get("X-CSRF-TOKEN") === "undefined") {
    axios.get("/api/getCsrf").then((result) => {
      if (result.status === 200) {
        Cookies.set("X-CSRF-TOKEN", result.data.CSRF_TOKEN);
      }
    });
  }
  const frontApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_FRONT_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": Cookies.get("X-CSRF-TOKEN"),
    },
  });

  let persistor = persistStore(store);
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <apiContext.Provider value={{ frontApi }}>
            <Layout>
              <Box className={styled.wrap}>
                <Component {...pageProps} />
              </Box>
            </Layout>
          </apiContext.Provider>
        </PersistGate>
      </Provider>
      <style jsx global>{`
        html,
        body {
          font-family: "S-CoreDream", "sans-serif" !important;
          margin: 0;
          padding: 0;
          background: #f2f2f2;
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