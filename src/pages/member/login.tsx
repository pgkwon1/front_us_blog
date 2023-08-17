import { Box, Button, TextField } from "@mui/material";
import styled from "@/styles/member/Login.module.css";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import frontApi from "@/modules/apiInstance";
import { setCurrentUserId, setLoginState } from "@/store/reducers/user";
import { IRootState } from "@/dto/ReduxDto";
import { ILoginDto } from "@/dto/users/LoginDto";
import { setErrorInfo } from "@/store/reducers/global";

export default function Login() {
  const { push } = useRouter();
  const [loginInfo, setLoginInfo] = useState<ILoginDto>({
    userId: "",
    password: "",
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

      //push("/");
    } else if (data.error === true && data.message) {
      dispatch(
        setErrorInfo({
          isError: true,
          errorMessage: data.message,
        })
      );
    }
  };

  return (
    <Box className={styled.loginWrap}>
      <Box className={styled.loginBox}>
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
          type="password"
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

export const getServerSideProps = () => {
  return {
    props: {
      isSideBarRender: false,
    },
  };
};
