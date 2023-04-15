import { AppProps } from "next/app";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";
import useAxiosInterceptors from "@/hooks/useAxiosInterceptors";
import moment from "moment-timezone";
import "moment/locale/ko";
moment().tz("Asia/Seoul").utc().format("YYYY-MM-DD HH:mm:ss");
type Props = {
  children?: ReactNode;
};
export default function Layout({ children }: Props) {
  useAxiosInterceptors();
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
