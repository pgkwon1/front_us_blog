import { AppProps } from "next/app";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";
import useAxiosInterceptors from "@/hooks/useAxiosInterceptors";
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
