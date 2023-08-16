import axios from "axios";
import { ReactNode } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUserId, setLoginState } from "@/store/reducers/user";
import { useRouter } from "next/router";
import frontApi, { formDataApi } from "@/modules/apiInstance";
import { IRootState } from "@/dto/ReduxDto";

type Props = {
  children?: ReactNode;
};
export default async function useAxiosInterceptors() {
  const { push } = useRouter();
  const { userId } = useSelector((state: IRootState) => state.userReducer);
  const dispatch = useDispatch();

  function setLogOut() {
    dispatch(setLoginState(0));
    dispatch(setCurrentUserId(""));
    localStorage.removeItem("token");
    push("/member/login");
  }

  async function getNewCsrfToken() {
    const result = await axios.get("/api/getCsrf");
    return result.data.CSRF_TOKEN;
  }
  frontApi.interceptors.request.use(
    (config) => {
      if (!config.headers) return config;
      const token = localStorage.getItem("token");
      const csrfToken = Cookies.get("X-CSRF-TOKEN");
      if (["put", "patch", "delete"].includes(config.method as string)) {
        config.data["userId"] = userId;
      }
      config.headers["X-CSRF-TOKEN"] = csrfToken;

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
        const setLogOutMessage = [
          "refresh token expired",
          "비정상적인 접근입니다.",
          "invalid csrf token",
        ];
        if (setLogOutMessage.includes(message)) {
          if (message === "invalid csrf token") {
            const csrfToken = await getNewCsrfToken();
            Cookies.set("X-CSRF-TOKEN", csrfToken);
          }
          setLogOut();
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

  // formData
  formDataApi.interceptors.request.use(
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

  formDataApi.interceptors.response.use(
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
          return formDataApi(config);
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
