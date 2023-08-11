import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

import useAxiosInterceptors from "@/hooks/useAxiosInterceptors";
import moment from "moment-timezone";
import "moment/locale/ko";
import { Alert, Box, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/dto/ReduxDto";
import { setErrorInfo, setNoticeInfo } from "@/store/reducers/global";
moment().tz("Asia/Seoul").utc().format("YYYY-MM-DD HH:mm:ss");
type Props = {
  children?: ReactNode;
};
export default function Layout({ children }: Props) {
  const { isError, errorMessage, isNotice, noticeMessage } = useSelector(
    (state: IRootState) => state.globalReducer
  );
  const dispatch = useDispatch();

  useAxiosInterceptors();

  return (
    <>
      <Header />
      {children}
      <Footer />
      <Box>
        <Snackbar
          open={isError}
          autoHideDuration={6000}
          onClose={() =>
            dispatch(
              setErrorInfo({
                isError: false,
                errorMessage: "",
              })
            )
          }
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>

        <Snackbar
          open={isNotice}
          autoHideDuration={6000}
          onClose={() =>
            dispatch(
              setNoticeInfo({
                isNotice: false,
                noticeMessage: "",
              })
            )
          }
        >
          <Alert severity="success">{noticeMessage}</Alert>
        </Snackbar>
      </Box>
    </>
  );
}
