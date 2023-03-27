import { createContext } from "react";
import { AxiosInstance } from "axios";

interface IApiInfo {
  frontApi: AxiosInstance;
  backApi: AxiosInstance;
}
const defaultValue: IApiInfo = {};
export const apiContext = createContext(defaultValue);
