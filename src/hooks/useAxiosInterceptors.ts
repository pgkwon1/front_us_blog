import axios from "axios";
import { ReactNode, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCurrentUserId, setLoginState } from "@/store/reducers/user";
import { useRouter } from "next/router";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import frontApi, { formDataApi } from "@/modules/apiInstance";

type Props = {
  children?: ReactNode;
};
export default async function useAxiosInterceptors() {
  const { push } = useRouter();
  const dispatch = useDispatch();

  frontApi.interceptors.request.use(
    (config) => {
      if (!config.headers) return config;
      const token = localStorage.getItem("token");
      const csrfToken = Cookies.get("X-CSRF-TOKEN");

      if (
        "X-CSRF-TOKEN" in config.headers === false ||
        config.headers?.["X-CSRF-TOKEN"] === undefined
      ) {
        config.headers["X-CSRF-TOKEN"] = csrfToken;
      }

      if (config.headers && token) {
        config.headers.authorization = `Bearer ${token}`;
        return config;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  frontApi.interceptors.response.use(
    async (response) => {
      const { config, data } = response;

      if (data.message === "access token expired") {
        // 토큰 만료
        const { authorization } = config.headers;
        const result = await axios.post(
          "/api/retoken",
          {
            accessToken: authorization.replace("Bearer ", ""),
          },
          {
            headers: {
              "X-CSRF-TOKEN": Cookies.get("X-CSRF-TOKEN"),
            },
          }
        );

        const { message } = result.data;
        if (
          message === "refresh token expired" ||
          message === "비정상적인 접근입니다."
        ) {
          dispatch(setLoginState(0));
          dispatch(setCurrentUserId(""));
          localStorage.removeItem("token");
          push("/member/login");
          return response;
        } else {
          localStorage.setItem("token", result.data.newAccessToken);
          config.headers[
            "Authorization"
          ] = `Bearer ${result.data.newAccessToken}`;
          return frontApi(config);
        }
      }

      return response;
    },
    async (error) => {
      return error;
    }
  );
  return true;
}
