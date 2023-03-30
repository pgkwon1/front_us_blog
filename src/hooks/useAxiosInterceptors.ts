import { apiContext } from "@/context/ApiContext";
import axios from "axios";
import { ReactNode, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCurrentUserId, setLoginState } from "@/store/actions/user";
import { useRouter } from "next/router";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
type Props = {
  children?: ReactNode;
};
export default async function useAxiosInterceptors() {
  const { frontApi } = useContext(apiContext);

  frontApi.interceptors.request.use(
    (config) => {
      if (!config.headers) return config;
      const token = localStorage.getItem("token");
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
      if (data.expired === true) {
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
        localStorage.setItem("token", result.data.newAccessToken);
        if (result.data.error === true) {
          // refresh 토큰도 만료됐을때 로그아웃 구현하기
          /*
          const { push } = useRouter();
          const dispatch = useDispatch();
          dispatch(setLoginState(0));
          dispatch(setCurrentUserId(""));
          push("/login");
          */
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
