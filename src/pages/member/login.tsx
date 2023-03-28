import { Box, Button, TextField } from "@mui/material";
import styled from "@/styles/member/Login.module.css";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useState } from "react";
import { apiContext } from "@/context/ApiContext";
import { useDispatch, useSelector } from "react-redux";
import { setLoginState } from "@/store/actions/user";
import { useRouter } from "next/router";

export default function Login() {
  const { push } = useRouter();
  const { frontApi } = useContext(apiContext);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const { login_state } = useSelector((state) => state.userReducer);

  if (localStorage.getItem("token") && login_state === 1) {
    push("/");
  }

  const handleLogin = async () => {
    const { data }: object = await frontApi.post("/member/login", {
      userId,
      password,
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
      dispatch(setLoginState(1));
      push("/");
    }
  };

  return (
    <Box className={styled.loginWrap}>
      <Box className={styled.loginBox}>
        <TextField
          onChange={(e) => setUserId(e.target.value)}
          label="ID"
          variant="standard"
        />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
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
