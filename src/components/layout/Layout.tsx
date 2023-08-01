import Header from "./Header";
import Footer from "./Footer";
import { ReactNode, useState } from "react";
import useAxiosInterceptors from "@/hooks/useAxiosInterceptors";
import moment from "moment-timezone";
import "moment/locale/ko";
import { Alert, Box, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/dto/ReduxDto";
import { setErrorInfo } from "@/store/reducers/global";
moment().tz("Asia/Seoul").utc().format("YYYY-MM-DD HH:mm:ss");
type Props = {
  children?: ReactNode;
};
export default function Layout({ children }: Props) {
  const { isError, errorMessage } = useSelector(
    (state: IRootState) => state.globalReducer
  );
  const dispatch = useDispatch();

  useAxiosInterceptors();

  setTimeout(() => {
    dispatch(
      setErrorInfo({
        isError: false,
        errorMessage: "",
      })
    );
  }, 6000);
  return (
    <>
      <Header />
      {children}
      <Footer />
      <Box>
        <Snackbar open={isError} autoHideDuration={6000}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      </Box>
    </>
  );
}
