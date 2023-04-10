import { Alert, Box, Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import styled from "../../styles/member/Register.module.css";
import { useContext, useState } from "react";
import frontApi from "@/modules/apiInstance";

export default function Register() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const changeUserId = (event): void => {
    setUserId(event.target.value);
  };

  const changePassword = (event): void => {
    setPassword(event.target.value);
  };

  const changeNickname = (event): void => {
    setNickname(event.target.value);
  };
  const handleSubmit = async (): Promise<boolean> => {
    const result = await frontApi.post("/member/register", {
      userId,
      password,
      nickname,
    });

    if (result.data.error === true) {
      const { message } = result.data;
      setErrorList(message.split(","));
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };
  return (
    <Box className={styled.registerWrap}>
      <Box className={styled.registerError}>
        {error
          ? errorList.map((err, index) => {
              return (
                <Alert key={index} severity="error">
                  {err}
                </Alert>
              );
            })
          : ""}
      </Box>
      <TextField
        onChange={changeUserId}
        name=""
        label="ID"
        variant="standard"
      />
      <TextField
        onChange={changePassword}
        label="PASSWORD"
        variant="standard"
        required={true}
      />
      <TextField
        onChange={changeNickname}
        label="NICKNAME"
        variant="standard"
        required={true}
      />

      <Button onClick={handleSubmit} variant="outlined" endIcon={<SendIcon />}>
        Register
      </Button>
    </Box>
  );
}
