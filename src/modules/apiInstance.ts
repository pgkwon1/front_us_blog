import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const frontApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FRONT_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": Cookies.get("X-CSRF-TOKEN"),
  },
});

export default frontApi;
