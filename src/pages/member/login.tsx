import { Alert, Box, Button, TextField } from "@mui/material";
import styled from "@/styles/member/Login.module.css";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginState, setCurrentUserId } from "@/store/actions/user";
import { useRouter } from "next/router";
import frontApi from "@/modules/apiInstance";

export default function Login() {
  const { push } = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
      dispatch(setCurrentUserId(userId));
      setError(false);
      push("/");
    } else if (data.error === true && data.message) {
      setError(true);
      setErrorMsg(data.message);
    }
  };

  return (
    <Box className={styled.loginWrap}>
      <Box className={styled.loginBox}>
        {error ? <Alert severity="error">{errorMsg}</Alert> : ""}
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
