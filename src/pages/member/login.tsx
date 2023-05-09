import { Alert, Box, Button, TextField } from "@mui/material";
import styled from "@/styles/member/Login.module.css";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import frontApi from "@/modules/apiInstance";
import { setCurrentUserId, setLoginState } from "@/store/reducers/user";
import { IRootState } from "@/components/dto/ReduxDto";
import { ILoginDto, ILoginErrorDto } from "@/components/dto/users/LoginDto";
import { isError } from "react-query";

export default function Login() {
  const { push } = useRouter();
  const [loginInfo, setLoginInfo] = useState<ILoginDto>({
    userId: "",
    password: "",
  });
  const [errorInfo, setErrorInfo] = useState<ILoginErrorDto>({
    isError: false,
    errorMsg: "",
  });

  const dispatch = useDispatch();

  const { login_state } = useSelector((state: IRootState) => state.userReducer);

  if (localStorage.getItem("token") && login_state === 1) {
    push("/");
  }

  const handleLogin = async () => {
    const { data } = await frontApi.post("/member/login", {
      userId: loginInfo.userId,
      password: loginInfo.password,
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
      dispatch(setLoginState(1));
      dispatch(setCurrentUserId(loginInfo.userId));
      setErrorInfo((current: ILoginErrorDto) => {
        return {
          ...current,
          isError: false,
        };
      });
      //push("/");
    } else if (data.error === true && data.message) {
      setErrorInfo({
        isError: true,
        errorMsg: data.message,
      });
    }
  };

  return (
    <Box className={styled.loginWrap}>
      <Box className={styled.loginBox}>
        {errorInfo.isError ? (
          <Alert severity="error">{errorInfo.errorMsg}</Alert>
        ) : (
          ""
        )}
        <TextField
          onChange={(e) =>
            setLoginInfo((current) => {
              return {
                ...current,
                userId: e.target.value,
              };
            })
          }
          label="ID"
          variant="standard"
        />
        <TextField
          onChange={(e) =>
            setLoginInfo((current) => {
              return {
                ...current,
                password: e.target.value,
              };
            })
          }
          label="PASSWORD"
          variant="standard"
        />

        <Button
          onClick={handleLogin}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}
