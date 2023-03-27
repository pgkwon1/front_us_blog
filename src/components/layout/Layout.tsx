import { AppProps } from "next/app";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";
type Props = {
  children?: ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
