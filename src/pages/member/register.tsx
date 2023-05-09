import { Alert, Box, Button, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import styled from "../../styles/member/Register.module.css";
import { ChangeEvent, ChangeEventHandler, useContext, useState } from "react";
import frontApi from "@/modules/apiInstance";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { IErrorDto } from "@/components/dto/ErrorDto";

interface IRegisterForm {
  userId: string;
  password: string;
  nickname: string;
}
export default function Register() {
  const [userData, setUserData] = useState({
    userId: "",
    password: "",
    nickname: "",
  });

  const [errorData, setErrorData] = useState({
    isError: false,
    errorList: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>({
    mode: "onSubmit",
    defaultValues: {
      userId: "",
      password: "",
      nickname: "",
    },
  });
  const changeUserId = (event: ChangeEvent<HTMLInputElement>): void => {
    const userId: string = event.target.value;
    console.log(userId);
    setUserData((current) => {
      return {
        ...current,
        userId,
      };
    });
  };

  const changePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    const password: string = event.target.value;
    setUserData((current) => {
      return {
        ...current,
        password,
      };
    });
  };

  const changeNickname = (event: ChangeEvent<HTMLInputElement>): void => {
    const nickname: string = event.target.value;
    setUserData((current) => {
      return {
        ...current,
        nickname,
      };
    });
  };

  const handleAddUser = async (): Promise<void> => {
    await registerMutation.mutate();
  };

  const addUser = async (): Promise<void> => {
    const { data } = await frontApi.post("/member/register", userData);
    /* if (data.error === true) {
      throw new Error(data);
    }*/
  };

  const registerMutation = useMutation("register", addUser, {
    onSuccess: (data) => {
      setErrorData({
        isError: false,
        errorList: [],
      });
    },
  });
  return (
    <form onSubmit={handleSubmit(handleAddUser)} name="registerForm">
      <Box className={styled.registerWrap}>
        <Box className={styled.registerError}>
          {errorData.isError
            ? errorData.errorList.map((err, index) => {
                return (
                  <Alert key={index} severity="error">
                    {err}
                  </Alert>
                );
              })
            : ""}
        </Box>
        <TextField
          {...register("userId", {
            required: "아이디를 입력해주세요",
            minLength: 4,
            min: "최소 4글자 이상 입력해주세요.",
          })}
          onChange={changeUserId}
          label="ID"
          variant="standard"
        />
        {errors.userId?.message ? (
          <Alert severity="error">{errors.userId.message}</Alert>
        ) : (
          ""
        )}
        <TextField
          {...register("password", {
            required: "패스워드를 입력해주세요",
            minLength: 8,
            min: "비밀번호는 최소 8글자 이상 입력해주세요",
          })}
          onChange={changePassword}
          label="PASSWORD"
          variant="standard"
          type="password"
        />
        {errors.password?.message ? (
          <Alert severity="error">{errors.password.message}</Alert>
        ) : (
          ""
        )}
        <TextField
          {...register("nickname", {
            required: true,
            minLength: 3,
            min: "최소 3글자 이상 입력해주세요",
          })}
          onChange={changeNickname}
          label="NICKNAME"
          variant="standard"
        />
        {errors.nickname?.message ? (
          <Alert severity="error">{errors.nickname.message}</Alert>
        ) : (
          ""
        )}
        <Button type="submit" variant="outlined" endIcon={<SendIcon />}>
          Register
        </Button>
      </Box>
    </form>
  );
}
